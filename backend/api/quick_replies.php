<?php
/**
 * ============================================
 * API: RESPUESTAS RÁPIDAS
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listQuickReplies();
        break;
    case 'search':
        searchQuickReplies();
        break;
    case 'create':
        createQuickReply();
        break;
    case 'update':
        updateQuickReply();
        break;
    case 'delete':
        deleteQuickReply();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listQuickReplies() {
    $pdo = getDB();
    $category = $_GET['category'] ?? null;
    
    $sql = "SELECT * FROM quick_replies WHERE active = 1";
    $params = [];
    
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    $sql .= " ORDER BY category, title";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $replies = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $replies]);
}

function searchQuickReplies() {
    $query = $_GET['q'] ?? '';
    
    if (empty($query)) {
        echo json_encode(['success' => false, 'message' => 'Query requerida']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT * FROM quick_replies 
        WHERE active = 1 AND (title LIKE ? OR content LIKE ? OR shortcut LIKE ?)
        ORDER BY category, title
    ");
    $searchParam = "%$query%";
    $stmt->execute([$searchParam, $searchParam, $searchParam]);
    $replies = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $replies]);
}

function createQuickReply() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('quick_replies.write');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');
    $category = trim($data['category'] ?? 'General');
    $shortcut = trim($data['shortcut'] ?? '');
    
    if (empty($title) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Título y contenido son requeridos']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("INSERT INTO quick_replies (title, content, category, shortcut) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $content, $category, $shortcut]);
    
    echo json_encode(['success' => true, 'message' => 'Respuesta rápida creada', 'data' => ['id' => $pdo->lastInsertId()]]);
}

function updateQuickReply() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('quick_replies.write');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $updates = [];
    $params = [];
    
    if (isset($data['title'])) { $updates[] = "title = ?"; $params[] = $data['title']; }
    if (isset($data['content'])) { $updates[] = "content = ?"; $params[] = $data['content']; }
    if (isset($data['category'])) { $updates[] = "category = ?"; $params[] = $data['category']; }
    if (isset($data['shortcut'])) { $updates[] = "shortcut = ?"; $params[] = $data['shortcut']; }
    if (isset($data['active'])) { $updates[] = "active = ?"; $params[] = $data['active']; }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE quick_replies SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Respuesta rápida actualizada']);
}

function deleteQuickReply() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('quick_replies.write');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE quick_replies SET active = 0 WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Respuesta rápida eliminada']);
}
?>
