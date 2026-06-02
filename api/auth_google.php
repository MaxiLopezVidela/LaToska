<?php
// api/auth_google.php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$credential = $input['credential'] ?? '';

if (empty($credential)) {
    echo json_encode(['success' => false, 'message' => 'Token de Google no proporcionado']);
    exit;
}

// Verificar el token JWT con Google
// Decodificamos el payload del JWT (parte central, separada por puntos)
$parts = explode('.', $credential);
if (count($parts) !== 3) {
    echo json_encode(['success' => false, 'message' => 'Token inválido']);
    exit;
}

// Decodificar payload (segunda parte del JWT)
$payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);

if (!$payload) {
    echo json_encode(['success' => false, 'message' => 'No se pudo decodificar el token']);
    exit;
}

// Verificar que el token no esté expirado
if (isset($payload['exp']) && $payload['exp'] < time()) {
    echo json_encode(['success' => false, 'message' => 'Token expirado']);
    exit;
}

// Extraer datos del usuario de Google
$googleId = $payload['sub'] ?? '';
$email = $payload['email'] ?? '';
$nombre = $payload['name'] ?? '';
$avatarUrl = $payload['picture'] ?? '';
$emailVerified = $payload['email_verified'] ?? false;

if (empty($email) || empty($googleId)) {
    echo json_encode(['success' => false, 'message' => 'Datos de Google incompletos']);
    exit;
}

if (!$emailVerified) {
    echo json_encode(['success' => false, 'message' => 'El email de Google no está verificado']);
    exit;
}

// Buscar si ya existe un usuario con ese email
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    // Usuario ya existe — actualizar datos de Google si es necesario
    $stmt = $pdo->prepare('UPDATE usuarios SET google_id = ?, avatar_url = ?, nombre = ? WHERE id_usuario = ?');
    $stmt->execute([$googleId, $avatarUrl, $nombre, $user['id_usuario']]);

    $_SESSION['user_id'] = $user['id_usuario'];
    $_SESSION['user_name'] = $nombre;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_avatar'] = $avatarUrl;
} else {
    // Usuario nuevo — crear cuenta con Google
    $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, google_id, avatar_url, auth_provider) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$nombre, $email, $googleId, $avatarUrl, 'google']);

    $userId = $pdo->lastInsertId();

    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $nombre;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_avatar'] = $avatarUrl;
}

echo json_encode([
    'success' => true,
    'message' => 'Login con Google exitoso',
    'user' => [
        'id' => $_SESSION['user_id'],
        'nombre' => $nombre,
        'email' => $email,
        'avatar_url' => $avatarUrl
    ]
]);
?>
