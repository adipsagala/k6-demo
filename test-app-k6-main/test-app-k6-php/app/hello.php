<?php
// Set the content type to application/json
header('Content-Type: application/json');

// Create a simple JSON response
$response = [
    "status" => "SUCCESS",
    "message" => "Hello World!",
    "data" => (object)[]
];

// Output the JSON response
echo json_encode($response);
?>
