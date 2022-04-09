<?php

$servername = "localhost";
$username = "id18747360_username";
$password = "2-wpk-JV64+D#sqM";
$dbname = "id18747360_userdata";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$score = mysqli_real_escape_string($conn, $_POST['score']);
$iq = mysqli_real_escape_string($conn, $_POST['iq']);
$answers = mysqli_real_escape_string($conn, $_POST['answers']);
$timeremaining = mysqli_real_escape_string($conn, $_POST['timeremaining']);

$sql = "INSERT INTO iqResults (DateTime, Score, IQ, Answers, TimeRemaining)
VALUES (NOW(), '$score', '$iq', '$answers', '$timeremaining')";

if ($conn->query($sql) === TRUE) {
    echo "Results recorded";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close()
?>