<?php
/**
 * ============================================
 * API: MENSAJES
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listMessages();
        break;
    case 'send':
        sendMessage();
        break;
    case 'update':
        updateMessage();
        break;
    case 'delete':
        deleteMessage();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listMessages() {
    $conversation_id = $_GET['conversation_id'] ?? null;
    $since = $_GET['since'] ?? null;
    
    if (!$conversation_id) {
        echo json_encode(['success' => false, 'message' => 'conversation_id requerido']);
        return;
    }
    
    $pdo = getDB();
    
    $sql = "SELECT m.*, u.name as sender_name
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?";
    
    $params = [$conversation_id];
    
    if ($since) {
        $sql .= " AND m.created_at > ?";
        $params[] = $since;
    }
    
    $sql .= " ORDER BY m.created_at ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $messages = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $messages]);
}

function sendMessage() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirAutenticacion();
    
    $data = json_decode(file_get_contents('php://input'), true);
    $conversation_id = $data['conversation_id'] ?? null;
    $message = trim($data['message'] ?? '');
    $sender_type = $data['sender_type'] ?? 'agent';
    
    if (!$conversation_id || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        return;
    }
    
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    $stmt = $pdo->prepare("
        INSERT INTO messages (conversation_id, sender_type, sender_id, message)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$conversation_id, $sender_type, $usuario['id'], $message]);
    
    // Actualizar conversación a activa si estaba en espera
    $stmt = $pdo->prepare("UPDATE conversations SET status = 'active' WHERE id = ? AND status = 'waiting'");
    $stmt->execute([$conversation_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado',
        'data' => ['message_id' => $pdo->lastInsertId()]
    ]);
}

/**
 * UPDATE - Editar mensaje
 */
function updateMessage() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    requerirAutenticacion();
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $message = trim($data['message'] ?? '');
    
    if (!$id || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        return;
    }
    
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    // Verificar que el mensaje existe y pertenece al usuario
    $stmt = $pdo->prepare("SELECT id, sender_id, sender_type FROM messages WHERE id = ?");
    $stmt->execute([$id]);
    $msg = $stmt->fetch();
    
    if (!$msg) {
        echo json_encode(['success' => false, 'message' => 'Mensaje no encontrado']);
        return;
    }
    
    // Solo el autor puede editar su mensaje
    if ($msg['sender_type'] === 'agent' && $msg['sender_id'] != $usuario['id']) {
        echo json_encode(['success' => false, 'message' => 'No puedes editar mensajes de otros']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE messages SET message = ? WHERE id = ?");
        $stmt->execute([$message, $id]);
        
        echo json_encode(['success' => true, 'message' => 'Mensaje actualizado']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el mensaje']);
    }
}

/**
 * DELETE - Eliminar mensaje
 */
function deleteMessage() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    requerirAutenticacion();
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    // Verificar que el mensaje existe
    $stmt = $pdo->prepare("SELECT id, sender_id, sender_type FROM messages WHERE id = ?");
    $stmt->execute([$id]);
    $msg = $stmt->fetch();
    
    if (!$msg) {
        echo json_encode(['success' => false, 'message' => 'Mensaje no encontrado']);
        return;
    }
    
    // Solo el autor o admin puede eliminar
    if ($msg['sender_type'] === 'agent' && $msg['sender_id'] != $usuario['id'] && $usuario['rol'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'No tienes permiso para eliminar este mensaje']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Mensaje eliminado']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el mensaje']);
    }
}
?>
