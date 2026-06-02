<?php
// api/add_producto.php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_marca']) || !isset($data['id_coleccion']) || !isset($data['id_tipo']) || 
    !isset($data['talle']) || !isset($data['color']) || !isset($data['precio'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos.']);
    exit;
}

try {
    $pdo->beginTransaction();

    $sql = "INSERT INTO productos (id_marca, id_coleccion, id_tipo, talle, color, cantidad, precio) 
            VALUES (:marca, :coleccion, :tipo, :talle, :color, :cantidad, :precio)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':marca'     => $data['id_marca'],
        ':coleccion' => $data['id_coleccion'],
        ':tipo'      => $data['id_tipo'],
        ':talle'     => $data['talle'],
        ':color'     => $data['color'],
        ':cantidad'  => isset($data['cantidad']) ? $data['cantidad'] : 0,
        ':precio'    => $data['precio']
    ]);

    $newId = $pdo->lastInsertId();
    $pdo->commit();

    echo json_encode([
        'success' => true, 
        'message' => 'Producto agregado correctamente.',
        'id'      => $newId
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Error al agregar producto. Los cambios no fueron guardados.'
    ]);
}
?>
