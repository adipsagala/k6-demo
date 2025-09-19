<?php
header('Content-Type: application/json');

// Database config
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

// Ambil query string dari parameter ?q=
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

try {
    if ($searchQuery !== '') {
        // Pencarian dengan LIKE
        $stmt = $pdo->prepare("SELECT id, name FROM products WHERE name LIKE :name limit 10");
        $stmt->execute(['name' => '%' . $searchQuery . '%']);
        $message = "Filtered products retrieved successfully";
    } else {
        // Ambil semua data jika tidak ada parameter q
        $stmt = $pdo->prepare("SELECT id, name FROM products");
        $stmt->execute();
        $message = "All products retrieved successfully";
    }

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "status" => "SUCCESS",
        "message" => $message,
        "data" => $products
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "ERROR",
        "message" => "Database error: " . $e->getMessage(),
        "data" => (object)[]
    ]);
}
?>
