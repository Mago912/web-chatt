<?php
/**
 * ============================================
 * API: PEDIDOS
 * Nexo WebChat - Frávega
 * ============================================
 * Endpoints:
 *   GET /api/pedidos.php?cliente_id=X     - Pedidos de un cliente
 *   GET /api/pedidos.php?numero=X         - Buscar por número
 *   GET /api/pedidos.php?id=X             - Pedido específico
 */

require_once '../config/db.php';
setAPIHeaders();

$pdo = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

if (isset($_GET['numero'])) {
    // Buscar por número de pedido
    $stmt = $pdo->prepare("
        SELECT p.*, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono, c.dni
        FROM pedidos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        WHERE p.numero_pedido = ?
    ");
    $stmt->execute([$_GET['numero']]);
    $pedido = $stmt->fetch();
    
    if (!$pedido) {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido no encontrado']);
        exit;
    }
    
    echo json_encode($pedido);
    
} elseif (isset($_GET['cliente_id'])) {
    // Pedidos de un cliente
    $stmt = $pdo->prepare("
        SELECT * FROM pedidos 
        WHERE cliente_id = ? 
        ORDER BY creado_en DESC
    ");
    $stmt->execute([$_GET['cliente_id']]);
    echo json_encode($stmt->fetchAll());
    
} elseif (isset($_GET['id'])) {
    // Pedido específico
    $stmt = $pdo->prepare("
        SELECT p.*, c.nombre AS cliente_nombre, c.email, c.telefono, c.dni
        FROM pedidos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = ?
    ");
    $stmt->execute([$_GET['id']]);
    $pedido = $stmt->fetch();
    
    if (!$pedido) {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido no encontrado']);
        exit;
    }
    
    echo json_encode($pedido);
    
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Parámetro requerido: cliente_id, numero o id']);
}
?>
