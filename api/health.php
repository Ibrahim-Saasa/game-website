<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

try {
    $connection = getDatabaseConnection();
    $result = $connection->query('SELECT COUNT(*) AS product_count FROM products');
    $row = $result->fetch_assoc();

    echo json_encode([
        'status' => 'ok',
        'database' => DB_NAME,
        'product_count' => (int) $row['product_count'],
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection is unavailable.',
    ]);
}