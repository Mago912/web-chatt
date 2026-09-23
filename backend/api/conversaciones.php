<?php
/**
 * ============================================
 * API: CONVERSACIONES
 * Nexo WebChat - Frávega
 * ============================================
 * Endpoints:
 *   GET    /api/conversaciones.php          - Listar todas
 *   GET    /api/conversaciones.php?id=X     - Obtener una con mensajes
 *   POST   /api/conversaciones.php          - Crear nueva
 *   PUT    /api/conversaciones.php          - Actualizar (tomar, resolver, cerrar)
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
    case 'PUT':
        handlePut($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

/**
 * GET: Listar conversaciones o obtener una específica
 */
function handleGet($pdo) {
    if (isset($_GET['id'])) {
        // Obtener conversación específica con mensajes
        $stmt = $pdo->prepare("
            SELECT c.*, 
                   cl.nombre AS cliente_nombre, cl.email AS cliente_email, 
                   cl.telefono, cl.dni, cl.cliente_desde, cl.pedidos_totales, 
                   cl.casos_totales, cl.avatar AS cliente_avatar,
                   p.numero_pedido, p.producto_resumen, p.monto, 
                   p.metodo_entrega, p.fecha_estimada, p.estado_logistico,
                   u.nombre AS agente_nombre
            FROM conversaciones c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN pedidos p ON c.pedido_id = p.id
            LEFT JOIN usuarios u ON c.agente_id = u.id
            WHERE c.id = ?
        ");
        $stmt->execute([$_GET['id']]);
        $conversacion = $stmt->fetch();
        
        if (!$conversacion) {
            http_response_code(404);
            echo json_encode(['error' => 'Conversación no encontrada']);
            return;
        }
        
        // Obtener mensajes
        $stmtMsg = $pdo->prepare("
            SELECT m.*, u.nombre AS emisor_nombre
            FROM mensajes m
            LEFT JOIN usuarios u ON m.emisor_id = u.id
            WHERE m.conversacion_id = ?
            ORDER BY m.creado_en ASC
        ");
        $stmtMsg->execute([$_GET['id']]);
        $conversacion['mensajes'] = $stmtMsg->fetchAll();
        
        echo json_encode($conversacion);
    } else {
        // Listar todas las conversaciones
        $estado = $_GET['estado'] ?? null;
        $agente_id = $_GET['agente_id'] ?? null;
        
        $sql = "
            SELECT c.id, c.motivo, c.estado, c.calificacion_csat, 
                   c.inicio_conversacion, c.fin_conversacion,
                   cl.nombre AS cliente_nombre, cl.avatar AS cliente_avatar,
                   u.nombre AS agente_nombre,
                   (SELECT mensaje FROM mensajes WHERE conversacion_id = c.id ORDER BY creado_en DESC LIMIT 1) AS ultimo_mensaje,
                   TIMESTAMPDIFF(SECOND, c.inicio_conversacion, NOW()) AS segundos_espera
            FROM conversaciones c
            INNER JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN usuarios u ON c.agente_id = u.id
            WHERE 1=1
        ";
        $params = [];
        
        if ($estado) {
            $sql .= " AND c.estado = ?";
            $params[] = $estado;
        }
        if ($agente_id) {
            $sql .= " AND c.agente_id = ?";
            $params[] = $agente_id;
        }
        
        $sql .= " ORDER BY c.inicio_conversacion DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll());
    }
}

/**
 * POST: Crear nueva conversación
 */
function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['cliente_id']) || !isset($data['motivo'])) {
        http_response_code(400);
        echo json_encode(['error' => 'cliente_id y motivo son requeridos']);
        return;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO conversaciones (cliente_id, pedido_id, motivo, estado)
        VALUES (?, ?, ?, 'esperando')
    ");
    $stmt->execute([
        $data['cliente_id'],
        $data['pedido_id'] ?? null,
        $data['motivo']
    ]);
    
    $conversacion_id = $pdo->lastInsertId();
    
    // Crear mensaje de bienvenida del bot
    $stmtMsg = $pdo->prepare("
        INSERT INTO mensajes (conversacion_id, tipo_emisor, mensaje)
        VALUES (?, 'bot', '¡Hola! 👋 Soy el asistente virtual de Frávega. ¿En qué puedo ayudarte hoy?')
    ");
    $stmtMsg->execute([$conversacion_id]);
    
    echo json_encode(['id' => $conversacion_id, 'mensaje' => 'Conversación creada exitosamente']);
}

/**
 * PUT: Actualizar conversación (tomar, resolver, cerrar, calificar)
 */
function handlePut($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de conversación requerido']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($data['agente_id'])) {
        $updates[] = "agente_id = ?";
        $params[] = $data['agente_id'];
    }
    if (isset($data['estado'])) {
        $updates[] = "estado = ?";
        $params[] = $data['estado'];
        
        if ($data['estado'] === 'resuelto' || $data['estado'] === 'cerrado') {
            $updates[] = "fin_conversacion = NOW()";
        }
    }
    if (isset($data['calificacion_csat'])) {
        $updates[] = "calificacion_csat = ?";
        $params[] = $data['calificacion_csat'];
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No hay campos para actualizar']);
        return;
    }
    
    $params[] = $data['id'];
    $sql = "UPDATE conversaciones SET " . implode(', ', $updates) . " WHERE id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['mensaje' => 'Conversación actualizada']);
}
?>
