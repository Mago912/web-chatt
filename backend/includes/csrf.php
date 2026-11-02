<?php
/**
 * ============================================
 * PROTECCIÓN CSRF
 * ============================================
 */

require_once __DIR__ . '/auth.php';

/**
 * Generar token CSRF
 */
function generarTokenCSRF() {
    iniciarSesion();
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Validar token CSRF
 */
function validarTokenCSRF($token) {
    iniciarSesion();
    
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Requerir token CSRF (para APIs POST/PUT/DELETE)
 */
function requerirCSRF() {
    $headers = getallheaders();
    $token = $headers['X-CSRF-Token'] ?? $_POST['csrf_token'] ?? null;
    
    if (!$token || !validarTokenCSRF($token)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Token CSRF inválido o faltante'
        ]);
        exit;
    }
}

/**
 * Obtener campo hidden para formularios HTML
 */
function csrf_field() {
    $token = generarTokenCSRF();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token) . '">';
}
?>
