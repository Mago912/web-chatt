<?php
/**
 * ============================================
 * API: CALIDAD
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();
requerirPermiso('quality.review');

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listReviews();
        break;
    case 'create':
        createReview();
        break;
    case 'stats':
        getQualityStats();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listReviews() {
    $pdo = getDB();
    
    $stmt = $pdo->query("
        SELECT qr.*, 
        c.subject as conversation_subject,
        cu.name as customer_name,
        u.name as reviewer_name,
        ag.name as agent_name
        FROM quality_reviews qr
        LEFT JOIN conversations c ON qr.conversation_id = c.id
        LEFT JOIN customers cu ON c.customer_id = cu.id
        LEFT JOIN users u ON qr.reviewer_id = u.id
        LEFT JOIN users ag ON c.agent_id = ag.id
        ORDER BY qr.created_at DESC
        LIMIT 50
    ");
    $reviews = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $reviews]);
}

function createReview() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $conversation_id = $data['conversation_id'] ?? null;
    $score = $data['score'] ?? null;
    $comments = trim($data['comments'] ?? '');
    
    if (!$conversation_id || !$score || $score < 1 || $score > 10) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        return;
    }
    
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    $stmt = $pdo->prepare("
        INSERT INTO quality_reviews (conversation_id, reviewer_id, score, comments)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$conversation_id, $usuario['id'], $score, $comments]);
    
    echo json_encode(['success' => true, 'message' => 'Evaluación creada', 'data' => ['id' => $pdo->lastInsertId()]]);
}

function getQualityStats() {
    $pdo = getDB();
    
    // Score promedio general
    $stmt = $pdo->query("SELECT AVG(score) as avg_score, COUNT(*) as total FROM quality_reviews");
    $general = $stmt->fetch();
    
    // Score por agente
    $stmt = $pdo->query("
        SELECT u.name, u.id,
        AVG(qr.score) as avg_score,
        COUNT(qr.id) as total_reviews
        FROM quality_reviews qr
        LEFT JOIN conversations c ON qr.conversation_id = c.id
        LEFT JOIN users u ON c.agent_id = u.id
        WHERE u.id IS NOT NULL
        GROUP BY u.id
        ORDER BY avg_score DESC
    ");
    $by_agent = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'general' => $general,
            'by_agent' => $by_agent
        ]
    ]);
}
?>
