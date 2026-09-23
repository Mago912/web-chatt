<?php
/**
 * ============================================
 * API: ESCALACIONES
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listEscalations();
        break;
    case 'create':
        createEscalation();
        break;
    case 'resolve':
        resolveEscalation();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listEscalations() {
    $pdo = getDB();
    $status = $_GET['status'] ?? null;
    
    $sql = "SELECT e.*, 
            c.subject as conversation_subject,
            cu.name as customer_name,
            u1.name as created_by_name,
            u2.name as assigned_to_name
            FROM escalations e
            LEFT JOIN conversations c ON e.conversation_id = c.id
            LEFT JOIN customers cu ON c.customer_id = cu.id
            LEFT JOIN users u1 ON e.created_by = u1.id
            LEFT JOIN users u2 ON e.assigned_to = u2.id
            WHERE 1=1";
    
    $params = [];
    
    if ($status) {
        $sql .= " AND e.status = ?";
        $params[] = $status;
    }
    
    $sql .= " ORDER BY 
        CASE e.priority 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            WHEN 'low' THEN 4 
        END,
        e.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $escalations = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $escalations]);
}

function createEscalation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('escalations.create');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $conversation_id = $data['conversation_id'] ?? null;
    $reason = trim($data['reason'] ?? '');
    $notes = trim($data['notes'] ?? '');
    $assigned_to = $data['assigned_to'] ?? null;
    $priority = $data['priority'] ?? 'medium';
    
    if (empty($reason)) {
        echo json_encode(['success' => false, 'message' => 'Razón es requerida']);
        return;
    }
    
    $pdo = getDB();
    $usuario = getUsuarioActual();
    
    $stmt = $pdo->prepare("
        INSERT INTO escalations (conversation_id, created_by, assigned_to, reason, notes, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    ");
    $stmt->execute([$conversation_id, $usuario['id'], $assigned_to, $reason, $notes, $priority]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Escalación creada',
        'data' => ['id' => $pdo->lastInsertId()]
    ]);
}

function resolveEscalation() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    requerirPermiso('escalations.resolve');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $notes = trim($data['notes'] ?? '');
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE escalations SET status = 'resolved', notes = CONCAT(notes, ?, ' [Resuelto]'), resolved_at = NOW() WHERE id = ?");
    $stmt->execute(["\n" . $notes, $id]);
    
    echo json_encode(['success' => true, 'message' => 'Escalación resuelta']);
}
?>
