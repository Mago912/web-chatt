<?php
/**
 * ============================================
 * CONEXIÓN A BASE DE DATOS - PDO MySQL
 * ============================================
 */

require_once __DIR__ . '/config.php';

// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexo_webchat');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Clase Database - Singleton para conexión PDO
 */
class Database {
    private static $instance = null;
    private $pdo;
    
    private function __construct() {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
        ];
        
        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            if (APP_ENV === 'development') {
                die(json_encode([
                    'success' => false,
                    'message' => 'Error de conexión: ' . $e->getMessage()
                ]));
            } else {
                die(json_encode([
                    'success' => false,
                    'message' => 'Error interno del servidor'
                ]));
            }
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    // Prevenir clonación
    private function __clone() {}
    
    // Prevenir deserialización
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Función helper para obtener conexión
 */
function getDB() {
    return Database::getInstance()->getConnection();
}
?>
