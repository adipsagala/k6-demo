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

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $response = [
        "status" => "ERROR",
        "message" => "Method not allowed",
        "data" => (object)[]
    ];
    echo json_encode($response);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');

// Decode the JSON data
$data = json_decode($input, true);

// Validate the input
if (json_last_error() !== JSON_ERROR_NONE || !isset($data['name']) || !is_string($data['name'])) {
    http_response_code(400);
    $response = [
        "status" => "ERROR",
        "message" => "Invalid input",
        "data" => (object)[]
    ];
    echo json_encode($response);
    exit;
}

// Prepare and execute the SQL statement to insert the product
try {
    $stmt = $pdo->prepare("INSERT INTO products (name) VALUES (:name)");
    $stmt->bindParam(':name', $data['name']);
    $stmt->execute();

    // Get the last inserted ID
    $id = $pdo->lastInsertId();

    // Return the response with the product ID and name
    http_response_code(200);

    // Create a simple JSON response
    $response = [
        "status" => "SUCCESS",
        "message" => "New product created!",
        "data" => (object)['id' => $id, 'name' => $data['name']]
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
