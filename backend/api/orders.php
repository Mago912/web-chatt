<?php
/**
 * ============================================
 * API: PEDIDOS
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'get';

switch ($action) {
    case 'list':
        listOrders();
        break;
    case 'get':
        getOrder();
        break;
    case 'by_customer':
        getOrdersByCustomer();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listOrders() {
    $pdo = getDB();
    
    $search = $_GET['search'] ?? null;
    $status = $_GET['status'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = ITEMS_PER_PAGE;
    $offset = ($page - 1) * $limit;
    
    $sql = "SELECT o.*, c.name as customer_name, c.dni as customer_dni
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE 1=1";
    
    $params = [];
    
    if ($search) {
        $sql .= " AND (o.order_number LIKE ? OR c.name LIKE ?)";
        $searchParam = "%$search%";
        $params = [$searchParam, $searchParam];
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
