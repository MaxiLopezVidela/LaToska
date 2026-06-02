<?php
// api/delete_producto.php
header('Content-Type: application/json');
require_once 'db.php';

// Leer el JSON enviado
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de producto requerido.']);
    exit;
}

try {
    $sql = "DELETE FROM productos WHERE id_producto = :id";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $data['id']]);
    
    // Verificar si se eliminó alguna fila
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true, 
            'message' => 'Producto eliminado correctamente.'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'No se encontró el producto o ya fue eliminado.'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar producto: ' . $e->getMessage()
    ]);
}
?>
