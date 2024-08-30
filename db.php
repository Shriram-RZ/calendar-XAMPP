<?php
$host = 'localhost';
$db = 'event_calendar';
$user = 'root'; // Change this if your XAMPP uses another user
$pass = ''; // Change this if your XAMPP uses another password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
