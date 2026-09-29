<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['message' => 'Use POST to submit account details.']);
}

$request = json_decode(file_get_contents('php://input'), true);
if (!is_array($request)) {
    respond(400, ['message' => 'The request body must be valid JSON.']);
}

$action = $request['action'] ?? '';
$email = strtolower(trim((string) ($request['email'] ?? '')));
$password = (string) ($request['password'] ?? '');

if (!in_array($action, ['register', 'login'], true)) {
    respond(400, ['message' => 'Choose a valid account action.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    respond(400, ['message' => 'Enter a valid email address.']);
}

if ($action === 'register') {
    $name = trim((string) ($request['name'] ?? ''));
    if ($name === '' || strlen($name) > 50) {
        respond(400, ['message' => 'Player name must be between 1 and 50 characters.']);
    }
    if (($request['termsAccepted'] ?? false) !== true) {
        respond(400, ['message' => 'Accept the Nexus terms to continue.']);
    }
    if (strlen($password) < 8 || strlen($password) > 72) {
        respond(400, ['message' => 'Password must be between 8 and 72 characters.']);
    }
} elseif ($password === '') {
    respond(400, ['message' => 'Password is required.']);
}

require_once __DIR__ . '/../config/database.php';

try {
    $connection = getDatabaseConnection();

    if ($action === 'register') {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $statement = $connection->prepare(
            'INSERT INTO users (player_name, email, password_hash) VALUES (?, ?, ?)'
        );
        $statement->bind_param('sss', $name, $email, $passwordHash);
        $statement->execute();
        $userId = $connection->insert_id;
        $statement->close();
    } else {
        $statement = $connection->prepare(
            'SELECT id, player_name, password_hash FROM users WHERE email = ? LIMIT 1'
        );
        $statement->bind_param('s', $email);
        $statement->execute();
        $user = $statement->get_result()->fetch_assoc();
        $statement->close();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            respond(401, ['message' => 'Email or password is incorrect.']);
        }

        $userId = (int) $user['id'];
        $name = $user['player_name'];
    }

    session_set_cookie_params([
        'httponly' => true,
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
    ]);
    ini_set('session.use_strict_mode', '1');
    session_start();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $_SESSION['player_name'] = $name;
    $_SESSION['email'] = $email;

    respond($action === 'register' ? 201 : 200, [
        'message' => $action === 'register' ? 'Account created successfully.' : 'Login successful.',
        'user' => ['name' => $name, 'email' => $email],
    ]);
} catch (mysqli_sql_exception $error) {
    if ($action === 'register' && (int) $error->getCode() === 1062) {
        respond(409, ['message' => 'An account with this email already exists.']);
    }

    error_log($error->getMessage());
    respond(500, ['message' => 'The account service is temporarily unavailable.']);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ['message' => 'The account service is temporarily unavailable.']);
}