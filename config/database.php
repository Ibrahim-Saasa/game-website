<?php

declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'gaming_web';
const DB_USER = 'root';
const DB_PASSWORD = '';

function getDatabaseConnection(): mysqli
{
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    $connection->set_charset('utf8mb4');

    return $connection;
}