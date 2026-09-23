<?php
/**
 * ============================================
 * API: MENSAJES
 * Nexo WebChat - Frávega
 * ============================================
 * Endpoints:
 *   GET  /api/mensajes.php?conversacion_id=X  - Obtener mensajes (polling)
 *   GET  /api/mensajes.php?conversacion_id=X&since=Y - Mensajes desde timestamp
 *   POST /api/mensajes.php                    - Enviar nuevo mensaje
 */

require_once '../config/db.php';
setAPIHeaders();

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

/**
 * GET: Obtener mensajes de una conversación
 * Soporta polling: ?conversacion_id=X&since=TIMESTAMP
 */
function handleGet($pdo) {
    if (!isset($_GET['conversacion_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'conversacion_id es requerido']);
        return;
    }
    
    $conversacion_id = (int)$_GET['conversacion_id'];
    $since = $_GET['since'] ?? null;
    
    $sql = "
        SELECT m.id, m.tipo_emisor, m.emisor_id, m.mensaje, m.creado_en,
               COALESCE(u.nombre, m.tipo_emisor) AS emisor_nombre
        FROM mensajes m
        LEFT JOIN usuarios u ON m.emisor_id = u.id
        WHERE m.conversacion_id = ?
    ";
    $params = [$conversacion_id];
    
    if ($since) {
        $sql .= " AND m.creado_en > ?";
        $params[] = $since;
    }
    
    $sql .= " ORDER BY m.creado_en ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $mensajes = $stmt->fetchAll();
    
    echo json_encode($mensajes);
}

/**
 * POST: Enviar nuevo mensaje
 */
function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['conversacion_id']) || !isset($data['mensaje'])) {
        http_response_code(400);
        echo json_encode(['error' => 'conversacion_id y mensaje son requeridos']);
        return;
    }
    
    // Validar que la conversación existe y está activa
    $stmt = $pdo->prepare("SELECT estado FROM conversaciones WHERE id = ?");
    $stmt->execute([$data['conversacion_id']]);
    $conv = $stmt->fetch();
    
    if (!$conv) {
        http_response_code(404);
        echo json_encode(['error' => 'Conversación no encontrada']);
        return;
    }
    
    if ($conv['estado'] === 'cerrado') {
        http_response_code(400);
        echo json_encode(['error' => 'La conversación está cerrada']);
        return;
    }
    
    // Insertar mensaje
    $stmt = $pdo->prepare("
        INSERT INTO mensajes (conversacion_id, tipo_emisor, emisor_id, mensaje)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['conversacion_id'],
        $data['tipo_emisor'] ?? 'agente',
        $data['emisor_id'] ?? null,
        $data['mensaje']
    ]);
    
    $mensaje_id = $pdo->lastInsertId();
    
    // Si es un agente, actualizar estado de la conversación a 'activo'
    if (($data['tipo_emisor'] ?? '') === 'agente') {
        $stmtUpdate = $pdo->prepare("
            UPDATE conversaciones SET estado = 'activo' WHERE id = ? AND estado = 'esperando'
        ");
        $stmtUpdate->execute([$data['conversacion_id']]);
    }
    
    echo json_encode([
        'id' => $mensaje_id,
        'mensaje' => 'Mensaje enviado exitosamente',
        'creado_en' => date('Y-m-d H:i:s')
    ]);
}
?>
