<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

function libraryRespond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    libraryRespond(401, ['message' => 'Sign in to manage your collection.']);
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    libraryRespond(405, ['message' => 'Unsupported request method.']);
}

require_once __DIR__ . '/../config/database.php';

try {
    $connection = getDatabaseConnection();
    $userId = (int) $_SESSION['user_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $wishlistStatement = $connection->prepare(
            'SELECT p.id, p.name, p.category, p.price, p.image, p.description, p.specs, w.created_at AS saved_at
             FROM wishlist_items w JOIN products p ON p.id = w.product_id
             WHERE w.user_id = ? ORDER BY w.created_at DESC'
        );
        $wishlistStatement->bind_param('i', $userId);
        $wishlistStatement->execute();
        $wishlist = $wishlistStatement->get_result()->fetch_all(MYSQLI_ASSOC);
        $wishlistStatement->close();

        $purchaseStatement = $connection->prepare(
            'SELECT p.id, p.name, p.category, p.image, p.description, p.specs,
                    o.purchase_price AS price, o.purchased_at
             FROM purchases o JOIN products p ON p.id = o.product_id
             WHERE o.user_id = ? ORDER BY o.purchased_at DESC, o.id DESC'
        );
        $purchaseStatement->bind_param('i', $userId);
        $purchaseStatement->execute();
        $purchases = $purchaseStatement->get_result()->fetch_all(MYSQLI_ASSOC);
        $purchaseStatement->close();

        foreach ($wishlist as &$item) {
            $item['id'] = (int) $item['id'];
            $item['price'] = (float) $item['price'];
            $item['specs'] = json_decode($item['specs'], true) ?: [];
        }
        unset($item);
        foreach ($purchases as &$item) {
            $item['id'] = (int) $item['id'];
            $item['price'] = (float) $item['price'];
            $item['specs'] = json_decode($item['specs'], true) ?: [];
        }
        unset($item);

        libraryRespond(200, ['wishlist' => $wishlist, 'purchases' => $purchases]);
    }

    $request = json_decode(file_get_contents('php://input'), true);
    if (!is_array($request) || !isset($request['product_id'])) {
        libraryRespond(400, ['message' => 'Choose a valid product.']);
    }
    $productId = filter_var($request['product_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($productId === false) {
        libraryRespond(400, ['message' => 'Choose a valid product.']);
    }

    $action = $request['action'] ?? '';
    if ($action === 'wishlist_add') {
        $statement = $connection->prepare(
            'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)'
        );
        $statement->bind_param('ii', $userId, $productId);
        $statement->execute();
        $statement->close();
        libraryRespond(201, ['message' => 'Added to your wishlist.']);
    }

    if ($action === 'wishlist_remove') {
        $statement = $connection->prepare(
            'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?'
        );
        $statement->bind_param('ii', $userId, $productId);
        $statement->execute();
        $statement->close();
        libraryRespond(200, ['message' => 'Removed from your wishlist.']);
    }

    if ($action === 'demo_purchase') {
        $statement = $connection->prepare(
            'INSERT INTO purchases (user_id, product_id, purchase_price)
             SELECT ?, id, price FROM products WHERE id = ?'
        );
        $statement->bind_param('ii', $userId, $productId);
        $statement->execute();
        $inserted = $statement->affected_rows;
        $statement->close();
        if ($inserted !== 1) {
            libraryRespond(404, ['message' => 'Product not found.']);
        }
        libraryRespond(201, ['message' => 'Demo purchase recorded. No payment was taken.']);
    }

    libraryRespond(400, ['message' => 'Choose a valid collection action.']);
} catch (mysqli_sql_exception $error) {
    if ((int) $error->getCode() === 1062) {
        libraryRespond(409, ['message' => 'This product is already in your wishlist.']);
    }
    error_log($error->getMessage());
    libraryRespond(500, ['message' => 'Your collection could not be updated.']);
} catch (Throwable $error) {
    error_log($error->getMessage());
    libraryRespond(500, ['message' => 'Your collection could not be loaded or updated.']);
}