<?php
// Set the content type to application/json
header('Content-Type: application/json');

// Database configuration
$host = 'host.docker.internal'; // Database host
$dbname = 'test-app-k6'; // Database name
$username = 'root'; // Database username
$password = 'secret'; // Database password

// Create a connection to the MariaDB database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Handle database connection error
    http_response_code(500);
    $response = [
        "status" => "ERROR",
        "message" => "Database connection failed: " . $e->getMessage(),
        "data" => (object)[]
    ];
    echo json_encode($response);
    exit;
}

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    $response = [
        "status" => "ERROR",
        "message" => "Method not allowed",
        "data" => (object)[]
    ];
    echo json_encode($response);
    exit;
}

try {
    // Prepare and execute the SQL statement to retrieve all products
    $stmt = $pdo->prepare("SELECT id, name FROM products limit 10");
    $stmt->execute();

    // Fetch all products as an associative array
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the response with the list of products
    http_response_code(200);
    $response = [
        "status" => "SUCCESS",
        "message" => "Products retrieved successfully",
        "data" => $products
    ];
    echo json_encode($response);
} catch (PDOException $e) {
    // Handle database error
    http_response_code(500);
    $response = [
        "status" => "ERROR",
        "message" => "Database error: " . $e->getMessage(),
        "data" => (object)[]
    ];
    echo json_encode($response);
}
?>
