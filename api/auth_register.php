<?php
// api/auth_register.php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$nombre = trim($input['nombre'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$password_confirm = $input['password_confirm'] ?? '';

// Validaciones
if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'El email no es válido']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}

if ($password !== $password_confirm) {
    echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Verificar que el email no exista
    $stmt = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Ya existe una cuenta con ese email']);
        exit;
    }

    // Hashear contraseña e insertar
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password_hash, auth_provider) VALUES (?, ?, ?, ?)');
    $stmt->execute([$nombre, $email, $hash, 'local']);
    $userId = $pdo->lastInsertId();

    $pdo->commit();

    // Iniciar sesión
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $nombre;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_avatar'] = null;

    echo json_encode([
        'success' => true,
        'message' => 'Registro exitoso',
        'user' => [
            'id' => $userId,
            'nombre' => $nombre,
            'email' => $email,
            'avatar_url' => null
        ]
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error al registrar usuario. Intentá de nuevo.']);
}
?>
