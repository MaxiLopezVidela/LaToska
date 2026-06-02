<?php
// api/auth_session.php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'nombre' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
            'avatar_url' => $_SESSION['user_avatar'] ?? null
        ]
    ]);
} else {
    echo json_encode([
        'logged_in' => false
    ]);
}
?>
