<?php
/**
 * ============================================
 * API: AUTENTICACIÓN
 * ============================================
 * Endpoints:
 *   POST ?action=login    - Iniciar sesión
 *   POST ?action=logout   - Cerrar sesión
 *   GET  ?action=check    - Verificar sesión
 *   GET  ?action=csrf     - Obtener token CSRF
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'check':
        handleCheck();
        break;
    case 'csrf':
        handleCSRF();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
        return;
    }
    
    $result = login($email, $password);
    echo json_encode($result);
}

function handleLogout() {
    $result = logout();
    echo json_encode($result);
}

function handleCheck() {
    if (estaAutenticado()) {
        $usuario = getUsuarioActual();
        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => $usuario
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'authenticated' => false
        ]);
    }
}

function handleCSRF() {
    $token = generarTokenCSRF();
    echo json_encode([
        'success' => true,
        'token' => $token
    ]);
}
?>
