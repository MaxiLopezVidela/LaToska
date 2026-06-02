<?php
// api/edit_producto.php
header('Content-Type: application/json');
require_once 'db.php';

// Leer el JSON enviado en el cuerpo de la petición (POST o PUT)
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_producto'])) {
    echo json_encode(['success' => false, 'message' => 'ID de producto no proporcionado.']);
    exit;
}

try {
    // Si bien solo se actualizan algunos campos, aquí se muestran todos.
    // Solo actualizaremos los que vengan en el request
    
    $updateFields = [];
    $params = [':id' => $data['id_producto']];
    
    if (isset($data['id_marca'])) { $updateFields[] = "id_marca = :marca"; $params[':marca'] = $data['id_marca']; }
    if (isset($data['id_coleccion'])) { $updateFields[] = "id_coleccion = :coleccion"; $params[':coleccion'] = $data['id_coleccion']; }
    if (isset($data['id_tipo'])) { $updateFields[] = "id_tipo = :tipo"; $params[':tipo'] = $data['id_tipo']; }
    if (isset($data['talle'])) { $updateFields[] = "talle = :talle"; $params[':talle'] = $data['talle']; }
    if (isset($data['color'])) { $updateFields[] = "color = :color"; $params[':color'] = $data['color']; }
    if (isset($data['cantidad'])) { $updateFields[] = "cantidad = :cantidad"; $params[':cantidad'] = $data['cantidad']; }
    if (isset($data['precio'])) { $updateFields[] = "precio = :precio"; $params[':precio'] = $data['precio']; }
    
    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar.']);
        exit;
    }

    $sql = "UPDATE productos SET " . implode(', ', $updateFields) . " WHERE id_producto = :id";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Producto actualizado correctamente.'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al editar producto: ' . $e->getMessage()
    ]);
}
?>
