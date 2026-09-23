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
?>
