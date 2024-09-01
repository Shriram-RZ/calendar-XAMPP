<?php
include 'binary_search_tree.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([]);
    exit();
}

// Fetch search query
$query = $_GET['query'] ?? '';
$searchTerm = '%' . $conn->real_escape_string($query) . '%';

$sql = "SELECT id, title, start_date FROM events WHERE title LIKE ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);

$conn->close();
?>
