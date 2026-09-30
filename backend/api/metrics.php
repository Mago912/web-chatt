<?php
/**
 * ============================================
 * API: MÉTRICAS
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();
requerirPermiso('metrics.view');

$action = $_GET['action'] ?? 'dashboard';

switch ($action) {
    case 'dashboard':
        getDashboardMetrics();
        break;
    case 'agents':
        getAgentMetrics();
        break;
    case 'detailed':
        getDetailedMetrics();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function getDashboardMetrics() {
    $pdo = getDB();
    
    // Conversaciones en espera
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM conversations WHERE status = 'waiting'");
    $waiting = $stmt->fetch()['count'];
    
    // Conversaciones activas
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM conversations WHERE status = 'active'");
    $active = $stmt->fetch()['count'];
    
    // Tiempo medio de primera respuesta (en segundos)
    $stmt = $pdo->query("
        SELECT AVG(TIMESTAMPDIFF(SECOND, started_at, 
            (SELECT MIN(created_at) FROM messages m WHERE m.conversation_id = c.id AND m.sender_type = 'agent')
        )) as avg_time
        FROM conversations c
        WHERE c.status IN ('active', 'closed')
        AND EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.id AND m.sender_type = 'agent')
    ");
    $avg_first_response = round($stmt->fetch()['avg_time'] ?? 0);
    
    // CSAT promedio
    $stmt = $pdo->query("SELECT AVG(csat_score) as avg_csat FROM conversations WHERE csat_score IS NOT NULL");
    $avg_csat = round($stmt->fetch()['avg_csat'] ?? 0, 1);
    
    // FCR (First Contact Resolution)
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN agent_id IS NOT NULL AND closed_at IS NOT NULL THEN 1 ELSE 0 END) as resolved
        FROM conversations
        WHERE DATE(created_at) = CURDATE()
    ");
    $fcr_data = $stmt->fetch();
    $fcr = $fcr_data['total'] > 0 ? round(($fcr_data['resolved'] / $fcr_data['total']) * 100) : 0;
    
    // AHT (Average Handle Time)
    $stmt = $pdo->query("
        SELECT AVG(TIMESTAMPDIFF(SECOND, started_at, closed_at)) as avg_handle
        FROM conversations
        WHERE closed_at IS NOT NULL AND DATE(closed_at) = CURDATE()
    ");
    $avg_handle = round($stmt->fetch()['avg_handle'] ?? 0);
    
    // Agentes disponibles
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users WHERE rol = 'agent' AND status = 'available'");
    $available_agents = $stmt->fetch()['count'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'waiting' => $waiting,
            'active' => $active,
            'avg_first_response' => $avg_first_response,
            'avg_csat' => $avg_csat,
            'fcr' => $fcr,
            'avg_handle_time' => $avg_handle,
            'available_agents' => $available_agents
        ]
    ]);
}

function getAgentMetrics() {
    $pdo = getDB();
    
    $stmt = $pdo->query("
        SELECT u.id, u.name, u.status,
        COUNT(DISTINCT c.id) as total_conversations,
        AVG(c.csat_score) as avg_csat,
        SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) as active_chats
        FROM users u
        LEFT JOIN conversations c ON u.id = c.agent_id AND DATE(c.created_at) = CURDATE()
        WHERE u.rol = 'agent'
        GROUP BY u.id
        ORDER BY u.name
    ");
    $agents = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $agents]);
}

function getDetailedMetrics() {
    $pdo = getDB();
    
    // Conversaciones por día (últimos 7 días)
    $stmt = $pdo->query("
        SELECT DATE(created_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
        FROM conversations
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
    ");
    $daily = $stmt->fetchAll();
    
    // Motivos de contacto más frecuentes
    $stmt = $pdo->query("
        SELECT reason, COUNT(*) as count
        FROM conversations
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY reason
        ORDER BY count DESC
        LIMIT 5
    ");
    $reasons = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'daily' => $daily,
            'top_reasons' => $reasons
        ]
    ]);
}
?>
