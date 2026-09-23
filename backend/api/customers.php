<?php
/**
 * ============================================
 * API: CLIENTES
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'get';

switch ($action) {
    case 'list':
        listCustomers();
        break;
    case 'get':
        getCustomer();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listCustomers() {
    $pdo = getDB();
    
    $search = $_GET['search'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = ITEMS_PER_PAGE;
    $offset = ($page - 1) * $limit;
    
    $sql = "SELECT c.*, 
            (SELECT COUNT(*) FROM conversations WHERE customer_id = c.id) as total_conversations,
            (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as total_orders
            FROM customers c";
    
    $params = [];
    
    if ($search) {
        $sql .= " WHERE c.name LIKE ? OR c.dni LIKE ? OR c.email LIKE ?";
        $searchParam = "%$search%";
        $params = [$searchParam, $searchParam, $searchParam];
    }
    
    $sql .= " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $customers = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $customers]);
}

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
        ORDER BY c.created_at DESC
        LIMIT 10
    ");
    $stmt->execute([$id]);
    $customer['conversations'] = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $customer]);
}
?>
