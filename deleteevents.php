<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$ids = json_decode($_POST['ids']);

if (is_array($ids) && !empty($ids)) {
    $idsString = implode(',', array_map('intval', $ids));
    $sql = "DELETE FROM events WHERE id IN ($idsString)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No events selected for deletion"]);
}

$conn->close();
?>
