<?php
header('Content-Type: application/json');

// Redis configuration
$redisHost = 'host.docker.internal'; // sesuai dengan nama service di Docker Compose kalau ada
$redisPort = 6379;

// Connect to Redis
try {
    $redis = new Redis();
    $redis->connect($redisHost, $redisPort);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "ERROR",
        "message" => "Redis connection failed: " . $e->getMessage(),
        "data" => (object)[]
    ]);
    exit;
}

// Database configuration
$host = 'host.docker.internal';
$dbname = 'test-app-k6';
$username = 'root';
$password = 'secret';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "ERROR",
        "message" => "Database connection failed: " . $e->getMessage(),
        "data" => (object)[]
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => "ERROR",
        "message" => "Method not allowed",
        "data" => (object)[]
    ]);
    exit;
}

// Try to get data from Redis
$cacheKey = "test-app-k6:php:products_all";
$cachedData = $redis->get($cacheKey);

if ($cachedData) {
    $products = json_decode($cachedData, true);
    $message = "Products retrieved from cache";
} else {
    try {
        $stmt = $pdo->prepare("SELECT id, name FROM products limit 10");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Store in Redis (set TTL e.g., 60 seconds)
        $redis->set($cacheKey, json_encode($products), 60);
        $message = "Products retrieved from database";
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "ERROR",
            "message" => "Database error: " . $e->getMessage(),
            "data" => (object)[]
        ]);
        exit;
    }
}

http_response_code(200);
echo json_encode([
    "status" => "SUCCESS",
    "message" => $message,
    "data" => $products
]);
