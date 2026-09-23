<?php
/**
 * ============================================
 * API: AUTENTICACIÓN
 * Nexo WebChat - Frávega
 * ============================================
 */

require_once '../config/db.php';
session_start();
setAPIHeaders();

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin($pdo);
        break;
    case 'logout':
        handleLogout();
        break;
    case 'check':
        handleCheck();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida']);
}

function handleLogin($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña requeridos']);
        return;
    }
    
    $stmt = $pdo->prepare("SELECT id, nombre, email, rol, estado, avatar_color FROM usuarios WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        return;
    }
    
    // En producción usar password_verify()
    // Por ahora aceptamos cualquier contraseña para demo
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['nombre'];
    $_SESSION['user_rol'] = $user['rol'];
    
    // Actualizar estado a disponible
    $stmtUpdate = $pdo->prepare("UPDATE usuarios SET estado = 'disponible' WHERE id = ?");
    $stmtUpdate->execute([$user['id']]);
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
}

function handleLogout() {
    if (isset($_SESSION['user_id'])) {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("UPDATE usuarios SET estado = 'desconectado' WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
    }
    
    session_destroy();
    echo json_encode(['success' => true, 'mensaje' => 'Sesión cerrada']);
}

function handleCheck() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'nombre' => $_SESSION['user_name'],
                'rol' => $_SESSION['user_rol']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
}
?>
