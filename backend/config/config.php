<?php
/**
 * ============================================
 * CONFIGURACIÓN GENERAL - Nexo Web Chat
 * ============================================
 */

// Configuración de la aplicación
define('APP_NAME', 'Nexo Web Chat');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/nexo-web-chat');
define('APP_ENV', 'development'); // development | production

// Rutas
define('BASE_PATH', dirname(__DIR__));
define('PUBLIC_PATH', BASE_PATH . '/public');
define('UPLOAD_PATH', BASE_PATH . '/uploads');

// Sesión
define('SESSION_LIFETIME', 3600); // 1 hora
define('SESSION_NAME', 'nexo_session');

// Timezone
date_default_timezone_set('America/Argentina/Buenos_Aires');

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', BASE_PATH . '/logs/error.log');
}

// Configuración de subida de archivos
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt']);

// Paginación
define('ITEMS_PER_PAGE', 20);

// Polling interval (segundos)
define('POLLING_INTERVAL', 3);
?>
