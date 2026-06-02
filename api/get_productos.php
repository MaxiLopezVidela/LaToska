<?php
// api/get_productos.php
header('Content-Type: application/json');
require_once 'db.php';

try {
    // Consulta SQL con JOINs para obtener los nombres en lugar de los IDs
    $sql = "
        SELECT 
            p.id_producto as id,
            m.nombre_marca as marca,
            c.nombre_coleccion as coleccion,
            t.nombre_tipo as tipo,
            p.talle,
            p.color,
            p.cantidad,
            p.precio
        FROM 
            productos p
        LEFT JOIN marcas m ON p.id_marca = m.id_marca
        LEFT JOIN colecciones c ON p.id_coleccion = c.id_coleccion
        LEFT JOIN tipos_prenda t ON p.id_tipo = t.id_tipo
        ORDER BY p.id_producto DESC
    ";
    
    $stmt = $pdo->query($sql);
    $productos = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $productos
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener productos: ' . $e->getMessage()
    ]);
}
?>
