<?php
// api/get_options.php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $marcas = $pdo->query("SELECT id_marca as id, nombre_marca as nombre FROM marcas ORDER BY nombre_marca")->fetchAll();
    $colecciones = $pdo->query("SELECT id_coleccion as id, nombre_coleccion as nombre FROM colecciones ORDER BY nombre_coleccion")->fetchAll();
    $tipos = $pdo->query("SELECT id_tipo as id, nombre_tipo as nombre FROM tipos_prenda ORDER BY nombre_tipo")->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'marcas' => $marcas,
            'colecciones' => $colecciones,
            'tipos' => $tipos
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener opciones: ' . $e->getMessage()
    ]);
}
?>
