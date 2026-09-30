<?php
/**
 * ============================================
 * AUTENTICACIÓN Y SESIONES
 * ============================================
 */

require_once __DIR__ . '/../config/database.php';

/**
 * Iniciar sesión segura
 */
function iniciarSesion() {
    if (session_status() === PHP_SESSION_NONE) {
        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path' => '/',
            'secure' => false, // true en producción con HTTPS
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}

/**
 * Verificar si el usuario está autenticado
 */
function estaAutenticado() {
    iniciarSesion();
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Obtener usuario actual
 */
function getUsuarioActual() {
    if (!estaAutenticado()) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'nombre' => $_SESSION['user_nombre'],
        'email' => $_SESSION['user_email'],
        'rol' => $_SESSION['user_rol']
    ];
}

/**
 * Login de usuario
 */
function login($email, $password) {
    $pdo = getDB();
    
    // Buscar usuario por email
    $stmt = $pdo->prepare("SELECT id, nombre, email, password, rol FROM users WHERE email = ? AND active = 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        return ['success' => false, 'message' => 'Credenciales inválidas'];
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        return ['success' => false, 'message' => 'Credenciales inválidas'];
    }
    
    // Iniciar sesión
    iniciarSesion();
    
    // Regenerar ID de sesión para prevenir session fixation
    session_regenerate_id(true);
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_nombre'] = $user['nombre'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_rol'] = $user['rol'];
    $_SESSION['login_time'] = time();
    
    // Actualizar estado del agente
    $stmt = $pdo->prepare("UPDATE users SET status = 'available', last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    return [
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email'],
            'rol' => $user['rol']
        ]
    ];
}

/**
 * Logout
 */
function logout() {
    if (estaAutenticado()) {
        $pdo = getDB();
        $stmt = $pdo->prepare("UPDATE users SET status = 'offline' WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
    }
    
    iniciarSesion();
    session_destroy();
    
    return ['success' => true, 'message' => 'Sesión cerrada'];
}

/**
 * Requerir autenticación (para APIs)
 */
function requerirAutenticacion() {
    if (!estaAutenticado()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'No autenticado'
        ]);
        exit;
    }
}
?>
