<?php
/**
 * ============================================
 * API: CLIENTES - CRUD COMPLETO
 * ============================================
 * GET    ?action=list          - Listar clientes
 * GET    ?action=get&id=X      - Obtener cliente
 * POST   ?action=create        - Crear cliente
 * POST   ?action=update        - Actualizar cliente
 * POST   ?action=delete        - Eliminar cliente (soft delete)
 * GET    ?action=search&q=X    - Buscar clientes
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
        listCustomers();
        break;
    case 'get':
        getCustomer();
        break;
    case 'create':
        requerirPermiso('customers.edit');
        createCustomer();
        break;
    case 'update':
        requerirPermiso('customers.edit');
        updateCustomer();
        break;
    case 'delete':
        requerirPermiso('customers.edit');
        deleteCustomer();
        break;
    case 'search':
        searchCustomers();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

/**
 * LISTAR - Obtener todos los clientes con paginación
 */
function listCustomers() {
    $pdo = getDB();
    
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? null;
    
    $sql = "SELECT c.*, 
            (SELECT COUNT(*) FROM conversations WHERE customer_id = c.id) as total_conversations,
            (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as total_orders
            FROM customers c WHERE 1=1";
    $params = [];
    
    if ($search) {
        $sql .= " AND (c.name LIKE ? OR c.dni LIKE ? OR c.email LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    // Contar total
    $countSql = "SELECT COUNT(*) as total FROM customers c WHERE 1=1";
    $countParams = [];
    if ($search) {
        $countSql .= " AND (c.name LIKE ? OR c.dni LIKE ? OR c.email LIKE ?)";
        $countParams = ["%$search%", "%$search%", "%$search%"];
    }
    $stmtCount = $pdo->prepare($countSql);
    $stmtCount->execute($countParams);
    $total = $stmtCount->fetch()['total'];
    
    $sql .= " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $customers = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $customers,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

/**
 * READ - Obtener un cliente por ID
 */
function getCustomer() {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT * FROM customers WHERE id = ?");
    $stmt->execute([$id]);
    $customer = $stmt->fetch();
    
    if (!$customer) {
        echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
        return;
    }
    
    // Obtener pedidos del cliente
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC");
    $stmt->execute([$id]);
    $customer['orders'] = $stmt->fetchAll();
    
    // Obtener conversaciones del cliente
    $stmt = $pdo->prepare("
        SELECT c.*, u.name as agent_name 
        FROM conversations c
        LEFT JOIN users u ON c.agent_id = u.id
        WHERE c.customer_id = ?
        ORDER BY c.created_at DESC LIMIT 10
    ");
    $stmt->execute([$id]);
    $customer['conversations'] = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $customer]);
}

/**
 * CREATE - Crear nuevo cliente
 */
function createCustomer() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = trim($data['name'] ?? '');
    $dni = trim($data['dni'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    
    // Validaciones
    $errors = [];
    if (empty($name)) $errors[] = 'El nombre es requerido';
    if (empty($dni)) $errors[] = 'El DNI es requerido';
    if (strlen($dni) < 7) $errors[] = 'DNI inválido (mínimo 7 caracteres)';
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email inválido';
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar DNI único
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE dni = ?");
    $stmt->execute([$dni]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Ya existe un cliente con ese DNI']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO customers (name, dni, email, phone) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $dni, $email, $phone]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Cliente creado exitosamente',
            'data' => ['id' => $pdo->lastInsertId()]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al crear el cliente']);
    }
}

/**
 * UPDATE - Actualizar cliente existente
 */
function updateCustomer() {
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
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($data['name']) && !empty(trim($data['name']))) {
        $updates[] = "name = ?";
        $params[] = trim($data['name']);
    }
    if (isset($data['dni']) && !empty(trim($data['dni']))) {
        // Verificar DNI único
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE dni = ? AND id != ?");
        $stmt->execute([trim($data['dni']), $id]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Ya existe otro cliente con ese DNI']);
            return;
        }
        $updates[] = "dni = ?";
        $params[] = trim($data['dni']);
    }
    if (isset($data['email'])) {
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Email inválido']);
            return;
        }
        $updates[] = "email = ?";
        $params[] = trim($data['email']);
    }
    if (isset($data['phone'])) {
        $updates[] = "phone = ?";
        $params[] = trim($data['phone']);
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE customers SET " . implode(', ', $updates) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Cliente actualizado exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el cliente']);
    }
}

/**
 * DELETE - Eliminar cliente (soft delete)
 */
function deleteCustomer() {
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
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
        return;
    }
    
    // Verificar si tiene conversaciones activas
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM conversations WHERE customer_id = ? AND status IN ('waiting', 'active', 'on_hold')");
    $stmt->execute([$id]);
    $active = $stmt->fetch()['count'];
    
    if ($active > 0) {
        echo json_encode(['success' => false, 'message' => 'No se puede eliminar: el cliente tiene conversaciones activas']);
        return;
    }
    
    try {
        // Soft delete: eliminar pedidos, conversaciones y mensajes asociados
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE customer_id = ?)");
        $stmt->execute([$id]);
        
        $stmt = $pdo->prepare("DELETE FROM conversations WHERE customer_id = ?");
        $stmt->execute([$id]);
        
        $stmt = $pdo->prepare("DELETE FROM orders WHERE customer_id = ?");
        $stmt->execute([$id]);
        
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        
        $pdo->commit();
        
        echo json_encode(['success' => true, 'message' => 'Cliente eliminado exitosamente']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el cliente']);
    }
}

/**
 * SEARCH - Buscar clientes
 */
function searchCustomers() {
    $query = $_GET['q'] ?? '';
    
    if (empty($query)) {
        echo json_encode(['success' => false, 'message' => 'Query requerida']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT * FROM customers 
        WHERE name LIKE ? OR dni LIKE ? OR email LIKE ?
        ORDER BY name LIMIT 20
    ");
    $searchParam = "%$query%";
    $stmt->execute([$searchParam, $searchParam, $searchParam]);
    
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
}
?>
