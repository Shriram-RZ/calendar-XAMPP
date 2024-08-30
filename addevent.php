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

// Validate and insert event data
$title = $_POST['title'];
$description = $_POST['description'];
$start_date = $_POST['start_date'];
$end_date = $_POST['end_date'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];

$sql = "INSERT INTO events (title, description, start_date, end_date, start_time, end_time) 
        VALUES ('$title', '$description', '$start_date', '$end_date', '$start_time', '$end_time')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>
