<?php
// api/db.php
$host = 'localhost';
$dbname = 'latoska';
$user = 'root'; // Usuario por defecto de XAMPP
$password = ''; // Contraseña por defecto de XAMPP suele estar vacía

try {
    // Configurar la conexión DSN
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    
    // Opciones para PDO: Reportar errores como excepciones y devolver arrays asociativos por defecto
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    // Crear la instancia de PDO
    $pdo = new PDO($dsn, $user, $password, $options);
    
} catch (\PDOException $e) {
    // Si hay un error, mostrarlo (en producción deberías registrarlo en un log, no mostrarlo al usuario)
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
    exit;
}
?>
