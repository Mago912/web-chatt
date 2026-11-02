<?php
/**
 * ============================================
 * API: PEDIDOS - CRUD COMPLETO
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

requerirAutenticacion();

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listOrders();
        break;
    case 'get':
        getOrder();
        break;
    case 'create':
        crearOrder();
        break;
    case 'update':
        updateOrder();
        break;
    case 'delete':
        deleteOrder();
        break;
    case 'by_customer':
        getOrdersByCustomer();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listOrders() {
    $pdo = getDB();
    
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? null;
    $status = $_GET['status'] ?? null;
    
    $sql = "SELECT o.*, c.name as customer_name, c.dni as customer_dni
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE 1=1";
    
    $params = [];
    
    if ($search) {
        $sql .= " AND (o.order_number LIKE ? OR c.name LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if ($status) {
        $sql .= " AND o.status = ?";
        $params[] = $status;
    }
    
    $sql .= " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $orders]);
}

function getOrder() {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT o.*, c.name as customer_name, c.dni, c.email, c.phone
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
    ");
    $stmt->execute([$id]);
    $order = $stmt->fetch();
    
    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Pedido no encontrado']);
        return;
    }
    
    echo json_encode(['success' => true, 'data' => $order]);
}

function crearOrder() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $customer_id = $data['customer_id'] ?? null;
    $order_number = trim($data['order_number'] ?? '');
    $product = trim($data['product'] ?? '');
    $amount = $data['amount'] ?? 0;
    $payment_method = trim($data['payment_method'] ?? '');
    $delivery_method = trim($data['delivery_method'] ?? '');
    $estimated_delivery = $data['estimated_delivery'] ?? null;
    
    // Validaciones
    if (!$customer_id || empty($order_number) || empty($product) || $amount <= 0) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos o inválidos']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar que el cliente existe
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->execute([$customer_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
        return;
    }
    
    // Verificar número de pedido único
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE order_number = ?");
    $stmt->execute([$order_number]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Ya existe un pedido con ese número']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO orders (order_number, customer_id, product, amount, payment_method, delivery_method, estimated_delivery, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'preparing')
        ");
        $stmt->execute([$order_number, $customer_id, $product, $amount, $payment_method, $delivery_method, $estimated_delivery]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Pedido creado exitosamente',
            'data' => ['id' => $pdo->lastInsertId()]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al crear el pedido']);
    }
}

function updateOrder() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar que existe
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Pedido no encontrado']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($data['product'])) {
        $updates[] = "product = ?";
        $params[] = trim($data['product']);
    }
    if (isset($data['amount']) && $data['amount'] > 0) {
        $updates[] = "amount = ?";
        $params[] = $data['amount'];
    }
    if (isset($data['payment_method'])) {
        $updates[] = "payment_method = ?";
        $params[] = trim($data['payment_method']);
    }
    if (isset($data['delivery_method'])) {
        $updates[] = "delivery_method = ?";
        $params[] = trim($data['delivery_method']);
    }
    if (isset($data['estimated_delivery'])) {
        $updates[] = "estimated_delivery = ?";
        $params[] = $data['estimated_delivery'];
    }
    if (isset($data['status'])) {
        $validStatus = ['preparing', 'shipping', 'delivered', 'delayed', 'cancelled'];
        if (in_array($data['status'], $validStatus)) {
            $updates[] = "status = ?";
            $params[] = $data['status'];
        }
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Pedido actualizado exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el pedido']);
    }
}

function deleteOrder() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar que existe
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Pedido no encontrado']);
        return;
    }
    
    // Verificar si tiene conversaciones asociadas
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM conversations WHERE order_id = ?");
    $stmt->execute([$id]);
    $conversations = $stmt->fetch()['count'];
    
    if ($conversations > 0) {
        echo json_encode(['success' => false, 'message' => 'No se puede eliminar: el pedido tiene conversaciones asociadas']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Pedido eliminado exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el pedido']);
    }
}

function getOrdersByCustomer() {
    $customer_id = $_GET['customer_id'] ?? null;
    
    if (!$customer_id) {
        echo json_encode(['success' => false, 'message' => 'customer_id requerido']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC");
    $stmt->execute([$customer_id]);
    $orders = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $orders]);
}
?>
