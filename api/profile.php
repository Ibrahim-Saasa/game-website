<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

function profileRespond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    profileRespond(401, ['message' => 'Sign in to view your profile.']);
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    profileRespond(405, ['message' => 'Unsupported request method.']);
}

require_once __DIR__ . '/../config/database.php';

try {
    $connection = getDatabaseConnection();
    $userId = (int) $_SESSION['user_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $statement = $connection->prepare(
            'SELECT player_name, email, avatar_path, created_at FROM users WHERE id = ?'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();
        $user = $statement->get_result()->fetch_assoc();
        $statement->close();

        if (!$user) {
            session_destroy();
            profileRespond(401, ['message' => 'Your account could not be found. Please sign in again.']);
        }

        $user['wishlist_count'] = (int) $connection->query(
            'SELECT COUNT(*) FROM wishlist_items WHERE user_id = ' . $userId
        )->fetch_row()[0];
        $user['purchase_count'] = (int) $connection->query(
            'SELECT COUNT(*) FROM purchases WHERE user_id = ' . $userId
        )->fetch_row()[0];
        profileRespond(200, ['user' => $user]);
    }

    $name = trim((string) ($_POST['player_name'] ?? ''));
    if ($name === '' || mb_strlen($name) > 50) {
        profileRespond(400, ['message' => 'Player name must be between 1 and 50 characters.']);
    }

    $avatarPath = null;
    $hasAvatar = isset($_FILES['avatar']) && $_FILES['avatar']['error'] !== UPLOAD_ERR_NO_FILE;
    if ($hasAvatar) {
        $avatar = $_FILES['avatar'];
        if ($avatar['error'] !== UPLOAD_ERR_OK || $avatar['size'] > 2 * 1024 * 1024) {
            profileRespond(400, ['message' => 'Choose an image smaller than 2 MB.']);
        }

        $image = @getimagesize($avatar['tmp_name']);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        $mime = $image['mime'] ?? '';
        if (!$image || !isset($extensions[$mime]) || $image[0] > 5000 || $image[1] > 5000) {
            profileRespond(400, ['message' => 'Use a JPEG, PNG, or WebP image up to 5000 pixels wide or tall.']);
        }

        $avatarDirectory = __DIR__ . '/../uploads/avatars';
        if (!is_dir($avatarDirectory) && !mkdir($avatarDirectory, 0755, true) && !is_dir($avatarDirectory)) {
            profileRespond(500, ['message' => 'The profile image folder is unavailable.']);
        }
        $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
        if (!move_uploaded_file($avatar['tmp_name'], $avatarDirectory . '/' . $filename)) {
            profileRespond(500, ['message' => 'The profile image could not be saved.']);
        }
        $avatarPath = 'uploads/avatars/' . $filename;
    }

    if ($hasAvatar) {
        $statement = $connection->prepare('UPDATE users SET player_name = ?, avatar_path = ? WHERE id = ?');
        $statement->bind_param('ssi', $name, $avatarPath, $userId);
    } else {
        $statement = $connection->prepare('UPDATE users SET player_name = ? WHERE id = ?');
        $statement->bind_param('si', $name, $userId);
    }
    $statement->execute();
    $statement->close();
    $_SESSION['player_name'] = $name;

    $statement = $connection->prepare('SELECT player_name, email, avatar_path, created_at FROM users WHERE id = ?');
    $statement->bind_param('i', $userId);
    $statement->execute();
    $user = $statement->get_result()->fetch_assoc();
    $statement->close();

    profileRespond(200, ['message' => 'Profile updated.', 'user' => $user]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    profileRespond(500, ['message' => 'The profile could not be loaded or saved.']);
}