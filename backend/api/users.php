<?php
/**
 * ============================================
 * API: USUARIOS (Solo Admin)
 * ============================================
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');
requerirAutenticacion();
requerirPermiso('users.manage');

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        listUsers();
        break;
    case 'create':
        createUser();
        break;
    case 'update':
        updateUser();
        break;
    case 'delete':
        deleteUser();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function listUsers() {
    $pdo = getDB();
    
    $stmt = $pdo->query("
        SELECT id, name, email, rol, status, active, last_login, created_at
        FROM users
        ORDER BY name
    ");
    $users = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'data' => $users]);
}

function createUser() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $rol = $data['rol'] ?? 'agent';
    
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Nombre, email y contraseña son requeridos']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Email inválido']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar email único
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email ya registrado']);
        return;
    }
    
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $password_hash, $rol]);
    
    echo json_encode(['success' => true, 'message' => 'Usuario creado', 'data' => ['id' => $pdo->lastInsertId()]]);
}

function updateUser() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $updates = [];
    $params = [];
    
    if (isset($data['name'])) { $updates[] = "name = ?"; $params[] = $data['name']; }
    if (isset($data['email'])) { $updates[] = "email = ?"; $params[] = $data['email']; }
    if (isset($data['rol'])) { $updates[] = "rol = ?"; $params[] = $data['rol']; }
    if (isset($data['status'])) { $updates[] = "status = ?"; $params[] = $data['status']; }
    if (isset($data['active'])) { $updates[] = "active = ?"; $params[] = $data['active']; }
    if (isset($data['password']) && !empty($data['password'])) {
        $updates[] = "password = ?";
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
        return;
    }
    
    $params[] = $id;
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(['success' => true, 'message' => 'Usuario actualizado']);
}

function deleteUser() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID requerido']);
        return;
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE users SET active = 0 WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'message' => 'Usuario desactivado']);
}
?>
