<?php
// api/seed_data.php
require_once 'db.php';

try {
    // 1. Insertar Marcas
    $marcas = ['Zara', 'H&M', 'Nike', 'Adidas', 'Levis', 'Bensimon'];
    foreach ($marcas as $marca) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO marcas (nombre_marca) VALUES (?)");
        $stmt->execute([$marca]);
    }

    // 2. Insertar Colecciones
    $colecciones = ['Verano 2026', 'Invierno 2026', 'Otoño 2026', 'Primavera 2026', 'Básicos', 'Edición Limitada'];
    foreach ($colecciones as $col) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO colecciones (nombre_coleccion) VALUES (?)");
        $stmt->execute([$col]);
    }

    // 3. Insertar Tipos de Prenda
    $tipos = ['Remera', 'Pantalón', 'Campera', 'Buzo', 'Zapatillas', 'Short', 'Vestido'];
    foreach ($tipos as $tipo) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO tipos_prenda (nombre_tipo) VALUES (?)");
        $stmt->execute([$tipo]);
    }

    // 4. Insertar Productos de prueba
    $idMarca1 = $pdo->query("SELECT id_marca FROM marcas WHERE nombre_marca = 'Nike'")->fetchColumn();
    $idMarca2 = $pdo->query("SELECT id_marca FROM marcas WHERE nombre_marca = 'Levis'")->fetchColumn();
    $idMarca3 = $pdo->query("SELECT id_marca FROM marcas WHERE nombre_marca = 'Zara'")->fetchColumn();

    $idCol1 = $pdo->query("SELECT id_coleccion FROM colecciones WHERE nombre_coleccion = 'Verano 2026'")->fetchColumn();
    $idCol2 = $pdo->query("SELECT id_coleccion FROM colecciones WHERE nombre_coleccion = 'Básicos'")->fetchColumn();
    $idCol3 = $pdo->query("SELECT id_coleccion FROM colecciones WHERE nombre_coleccion = 'Invierno 2026'")->fetchColumn();

    $idTipo1 = $pdo->query("SELECT id_tipo FROM tipos_prenda WHERE nombre_tipo = 'Remera'")->fetchColumn();
    $idTipo2 = $pdo->query("SELECT id_tipo FROM tipos_prenda WHERE nombre_tipo = 'Pantalón'")->fetchColumn();
    $idTipo3 = $pdo->query("SELECT id_tipo FROM tipos_prenda WHERE nombre_tipo = 'Campera'")->fetchColumn();

    $pdo->exec("DELETE FROM productos");
    $pdo->exec("ALTER TABLE productos AUTO_INCREMENT = 1");

    $productosTest = [
        [$idMarca1, $idCol1, $idTipo1, 'L', 'Blanco', 15, 12500.50],
        [$idMarca1, $idCol1, $idTipo1, 'M', 'Negro', 10, 12500.50],
        [$idMarca2, $idCol2, $idTipo2, '42', 'Azul', 25, 45000.00],
        [$idMarca3, $idCol3, $idTipo3, 'S', 'Gris', 5, 85000.00],
        [$idMarca3, $idCol2, $idTipo1, 'XL', 'Rojo', 8, 14000.00]
    ];

    $sql = "INSERT INTO productos (id_marca, id_coleccion, id_tipo, talle, color, cantidad, precio) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    foreach ($productosTest as $p) {
        $stmt->execute($p);
    }

    echo "Datos de prueba insertados.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
