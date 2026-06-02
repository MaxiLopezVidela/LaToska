<?php
// api/auth_login.php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
    exit;
}

// Buscar usuario por email
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
    exit;
}

// Si el usuario se registró con Google y no tiene contraseña
if ($user['auth_provider'] === 'google' && empty($user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Esta cuenta usa Google para iniciar sesión. Usá el botón de Google.']);
    exit;
}

// Verificar contraseña
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
    exit;
}

// Iniciar sesión
$_SESSION['user_id'] = $user['id_usuario'];
$_SESSION['user_name'] = $user['nombre'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_avatar'] = $user['avatar_url'];

echo json_encode([
    'success' => true,
    'message' => 'Login exitoso',
    'user' => [
        'id' => $user['id_usuario'],
        'nombre' => $user['nombre'],
        'email' => $user['email'],
        'avatar_url' => $user['avatar_url']
    ]
]);
?>
