<?php
/**
 * ============================================
 * API: RESPUESTAS RÁPIDAS (Canned Responses)
 * Nexo WebChat - Frávega
 * ============================================
 */

require_once '../config/db.php';
setAPIHeaders();

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $categoria = $_GET['categoria'] ?? null;
        
        if ($categoria && $categoria !== 'Todas') {
            $stmt = $pdo->prepare("SELECT * FROM respuestas_rapidas WHERE categoria = ? ORDER BY uso_count DESC");
            $stmt->execute([$categoria]);
        } else {
            $stmt = $pdo->query("SELECT * FROM respuestas_rapidas ORDER BY categoria, uso_count DESC");
        }
        
        echo json_encode($stmt->fetchAll());
        break;
        
    case 'POST':
        // Incrementar contador de uso
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            $stmt = $pdo->prepare("UPDATE respuestas_rapidas SET uso_count = uso_count + 1 WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(['success' => true]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
?>
