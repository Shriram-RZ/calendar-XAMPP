<?php
// Include the BST class
include 'binary_search_tree.php';

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Fetch search query and date range from URL parameters
$query = $_GET['query'] ?? '';
$startDate = $_GET['start_date'] ?? '1970-01-01'; // Default to a far past date if not provided
$endDate = $_GET['end_date'] ?? '2100-01-01'; // Default to a far future date if not provided

$searchTerm = '%' . $conn->real_escape_string($query) . '%';

// Prepare and execute SQL query
$sql = "SELECT id, title, start_date FROM events WHERE title LIKE ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

// Initialize the binary search tree
$bst = new BinarySearchTree();

// Insert events into the BST
while ($row = $result->fetch_assoc()) {
    $bst->insert($row);
}

// Search for events in the specified date range
$events = $bst->searchEvents($startDate, $endDate);

// Output the events as JSON
header('Content-Type: application/json');
echo json_encode($events);

// Close the connection
$conn->close();
?>
