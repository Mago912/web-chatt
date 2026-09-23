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
    case 'update':
        updateReview();
        break;
    case 'delete':
        deleteReview();
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

/**
 * UPDATE - Actualizar evaluación de calidad
 */
function updateReview() {
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
    $stmt = $pdo->prepare("SELECT id FROM quality_reviews WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Evaluación no encontrada']);
        return;
    }
    
    $updates = [];
    $params = [];
    
    if (isset($data['score']) && $data['score'] >= 1 && $data['score'] <= 10) {
        $updates[] = "score = ?";
        $params[] = $data['score'];
    }
    if (isset($data['comments'])) {
        $updates[] = "comments = ?";
        $params[] = trim($data['comments']);
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE quality_reviews SET " . implode(', ', $updates) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Evaluación actualizada exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la evaluación']);
    }
}

/**
 * DELETE - Eliminar evaluación de calidad
 */
function deleteReview() {
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
    $stmt = $pdo->prepare("SELECT id FROM quality_reviews WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Evaluación no encontrada']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM quality_reviews WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Evaluación eliminada exitosamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar la evaluación']);
    }
}
?>
