<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['authenticated' => false]);
    exit;
}

echo json_encode([
    'authenticated' => true,
    'player_name' => $_SESSION['player_name'] ?? '',
]);