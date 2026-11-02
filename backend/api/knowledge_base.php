<?php
/**
 * ============================================
 * API: BASE DE CONOCIMIENTO
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listArticles();
        break;
    case 'search':
        searchArticles();
        break;
    case 'get':
        getArticle();
        break;
    case 'create':
        createArticle();
        break;
    case 'update':
        updateArticle();
        break;
    case 'delete':
        deleteArticle();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listArticles() {
    $pdo = getDB();
    $category = $_GET['category'] ?? null;
    
    $sql = "SELECT * FROM knowledge_base WHERE active = 1";
    $params = [];
    
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    $sql .= " ORDER BY category, title";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $articles]);
}

function searchArticles() {
    $query = $_GET['q'] ?? '';
    
    if (empty($query)) {
        echo json_encode(['success' => false, 'message' => 'Query requerida']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT * FROM knowledge_base 
        WHERE active = 1 AND (
            title LIKE ? OR content LIKE ? OR keywords LIKE ? OR category LIKE ?
        )
        ORDER BY category, title
    ");
    $searchParam = "%$query%";
    $stmt->execute([$searchParam, $searchParam, $searchParam, $searchParam]);
    $articles = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $articles]);
}

function getArticle() {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT * FROM knowledge_base WHERE id = ?");
    $stmt->execute([$id]);
    $article = $stmt->fetch();
    
    if (!$article) {
        echo json_encode(['success' => false, 'message' => 'Artículo no encontrado']);
        return;
    }
    
    echo json_encode(['success' => true, 'data' => $article]);
}

function createArticle() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('knowledge.write');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');
    $category = trim($data['category'] ?? 'General');
    $keywords = trim($data['keywords'] ?? '');
    
    if (empty($title) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Título y contenido son requeridos']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO knowledge_base (title, content, category, keywords) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $content, $category, $keywords]);
    
    echo json_encode(['success' => true, 'message' => 'Artículo creado', 'data' => ['id' => $pdo->lastInsertId()]]);
}

function updateArticle() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('knowledge.write');
    
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
    if (isset($data['keywords'])) { $updates[] = "keywords = ?"; $params[] = $data['keywords']; }
    if (isset($data['active'])) { $updates[] = "active = ?"; $params[] = $data['active']; }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE knowledge_base SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Artículo actualizado']);
}

function deleteArticle() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('knowledge.write');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE knowledge_base SET active = 0 WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Artículo eliminado']);
}
?>
