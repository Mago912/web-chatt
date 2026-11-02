<?php
/**
 * ============================================
 * API: CONVERSACIONES
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listConversations();
        break;
    case 'get':
        getConversation();
        break;
    case 'create':
        createConversation();
        break;
    case 'take':
        takeConversation();
        break;
    case 'close':
        closeConversation();
        break;
    case 'hold':
        holdConversation();
        break;
    case 'rate':
        rateConversation();
        break;
    case 'update':
        updateConversation();
        break;
    case 'delete':
        deleteConversation();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listConversations() {
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    $status = $_GET['status'] ?? null;
    $agent_id = $_GET['agent_id'] ?? null;
    
    $sql = "SELECT c.*, 
            cu.name as customer_name, cu.dni as customer_dni,
            u.name as agent_name,
            o.order_number,
            (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
            TIMESTAMPDIFF(SECOND, c.started_at, NOW()) as wait_seconds
            FROM conversations c
            LEFT JOIN customers cu ON c.customer_id = cu.id
            LEFT JOIN users u ON c.agent_id = u.id
            LEFT JOIN orders o ON c.order_id = o.id
            WHERE 1=1";
    
    $params = [];
    
    // Agentes solo ven sus propias conversaciones
    if ($usuario['rol'] === 'agent') {
        $sql .= " AND (c.agent_id = ? OR c.status = 'waiting')";
        $params[] = $usuario['id'];
    }
    
    if ($status) {
        $sql .= " AND c.status = ?";
        $params[] = $status;
    }
    
    if ($agent_id) {
        $sql .= " AND c.agent_id = ?";
        $params[] = $agent_id;
    }
    
    $sql .= " ORDER BY 
        CASE c.status 
            WHEN 'waiting' THEN 1 
            WHEN 'active' THEN 2 
            WHEN 'on_hold' THEN 3 
            WHEN 'closed' THEN 4 
        END,
        c.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $conversations = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $conversations]);
}

function getConversation() {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT c.*, 
        cu.name as customer_name, cu.dni, cu.email, cu.phone, cu.created_at as customer_since,
        u.name as agent_name,
        o.order_number, o.product, o.amount, o.payment_method, o.delivery_method, 
        o.estimated_delivery, o.status as order_status
        FROM conversations c
        LEFT JOIN customers cu ON c.customer_id = cu.id
        LEFT JOIN users u ON c.agent_id = u.id
        LEFT JOIN orders o ON c.order_id = o.id
        WHERE c.id = ?
    ");
    $stmt->execute([$id]);
    $conversation = $stmt->fetch();
    
    if (!$conversation) {
        echo json_encode(['success' => false, 'message' => 'Conversación no encontrada']);
        return;
    }
    
    // Obtener mensajes
    $stmt = $pdo->prepare("
        SELECT m.*, u.name as sender_name
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    ");
    $stmt->execute([$id]);
    $conversation['messages'] = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $conversation]);
}

function createConversation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $customer_name = trim($data['customer_name'] ?? '');
    $customer_dni = trim($data['customer_dni'] ?? '');
    $customer_email = trim($data['customer_email'] ?? '');
    $customer_phone = trim($data['customer_phone'] ?? '');
    $order_id = $data['order_id'] ?? null;
    $reason = trim($data['reason'] ?? '');
    $first_message = trim($data['message'] ?? '');
    
    if (empty($customer_name) || empty($customer_dni)) {
        echo json_encode(['success' => false, 'message' => 'Nombre y DNI son requeridos']);
        return;
    }
    
    $pdo = getDB();
    
    try {
        $pdo->beginTransaction();
        
        // Buscar o crear cliente
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE dni = ?");
        $stmt->execute([$customer_dni]);
        $customer = $stmt->fetch();
        
        if (!$customer) {
            $stmt = $pdo->prepare("INSERT INTO customers (name, dni, email, phone) VALUES (?, ?, ?, ?)");
            $stmt->execute([$customer_name, $customer_dni, $customer_email, $customer_phone]);
            $customer_id = $pdo->lastInsertId();
        } else {
            $customer_id = $customer['id'];
        }
        
        // Crear conversación
        $subject = $reason ?: 'Consulta general';
        $stmt = $pdo->prepare("
            INSERT INTO conversations (customer_id, order_id, subject, reason, status, priority, started_at)
            VALUES (?, ?, ?, ?, 'waiting', 'medium', NOW())
        ");
        $stmt->execute([$customer_id, $order_id, $subject, $reason]);
        $conversation_id = $pdo->lastInsertId();
        
        // Crear primer mensaje
        if (!empty($first_message)) {
            $stmt = $pdo->prepare("
                INSERT INTO messages (conversation_id, sender_type, message)
                VALUES (?, 'customer', ?)
            ");
            $stmt->execute([$conversation_id, $first_message]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Conversación creada',
            'data' => ['conversation_id' => $conversation_id]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error al crear conversación']);
    }
}

function takeConversation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('conversations.take');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $usuario = getUsuarioActual();
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar que la conversación esté en espera
    $stmt = $pdo->prepare("SELECT status FROM conversations WHERE id = ?");
    $stmt->execute([$id]);
    $conv = $stmt->fetch();
    
    if (!$conv || $conv['status'] !== 'waiting') {
        echo json_encode(['success' => false, 'message' => 'La conversación no está disponible']);
        return;
    }
    
    $stmt = $pdo->prepare("UPDATE conversations SET agent_id = ?, status = 'active' WHERE id = ?");
    $stmt->execute([$usuario['id'], $id]);
    
    // Mensaje del sistema
    $stmt = $pdo->prepare("
        INSERT INTO messages (conversation_id, sender_type, sender_id, message)
        VALUES (?, 'system', ?, ?)
    ");
    $stmt->execute([$id, $usuario['id'], "Conversación tomada por {$usuario['nombre']}"]);
    
    echo json_encode(['success' => true, 'message' => 'Conversación tomada']);
}

function closeConversation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE conversations SET status = 'closed', closed_at = NOW() WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Conversación cerrada']);
}

function holdConversation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE conversations SET status = 'on_hold' WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Conversación en espera']);
}

function rateConversation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $score = $data['score'] ?? null;
    
    if (!$id || !$score || $score < 1 || $score > 5) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE conversations SET csat_score = ? WHERE id = ?");
    $stmt->execute([$score, $id]);
    
    echo json_encode(['success' => true, 'message' => 'Calificación registrada']);
}

/**
 * UPDATE - Actualizar conversación
 */
function updateConversation() {
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
    $stmt = $pdo->prepare("SELECT id FROM conversations WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Conversación no encontrada']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($data['subject'])) {
        $updates[] = "subject = ?";
        $params[] = trim($data['subject']);
    }
    if (isset($data['reason'])) {
        $updates[] = "reason = ?";
        $params[] = trim($data['reason']);
    }
    if (isset($data['priority'])) {
        $validPriority = ['low', 'medium', 'high', 'critical'];
        if (in_array($data['priority'], $validPriority)) {
            $updates[] = "priority = ?";
            $params[] = $data['priority'];
        }
    }
    if (isset($data['agent_id'])) {
        $updates[] = "agent_id = ?";
        $params[] = $data['agent_id'];
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE conversations SET " . implode(', ', $updates) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Conversación actualizada exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la conversación']);
    }
}

/**
 * DELETE - Eliminar conversación
 */
function deleteConversation() {
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
    $stmt = $pdo->prepare("SELECT id FROM conversations WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Conversación no encontrada']);
        return;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Eliminar mensajes primero (por CASCADE)
        $stmt = $pdo->prepare("DELETE FROM messages WHERE conversation_id = ?");
        $stmt->execute([$id]);
        
        // Eliminar conversación
        $stmt = $pdo->prepare("DELETE FROM conversations WHERE id = ?");
        $stmt->execute([$id]);
        
        $pdo->commit();
        
        echo json_encode(['success' => true, 'message' => 'Conversación eliminada exitosamente']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Error al eliminar la conversación']);
    }
}
?>
