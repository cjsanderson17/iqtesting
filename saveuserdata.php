<?php
# database details
$servername = "localhost";
$username = "id18747360_username";
$password = "2-wpk-JV64+D#sqM";
$dbname = "id18747360_userdata";

# opens a new mysql connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

# defining data field values
$score = mysqli_real_escape_string($conn, $_POST['score']);
$iq = mysqli_real_escape_string($conn, $_POST['iq']);
$answers = mysqli_real_escape_string($conn, $_POST['answers']);
$timeremaining = mysqli_real_escape_string($conn, $_POST['timeremaining']);

# inserting data fields into database
$sql = "INSERT INTO iqResults (DateTime, Score, IQ, Answers, TimeRemaining)
VALUES (NOW(), '$score', '$iq', '$answers', '$timeremaining')";

if ($conn->query($sql) === TRUE) {
    echo "Results recorded"; # displayed if data recording was successful
} else {
    echo "Error: " . $sql . "<br>" . $conn->error; # displayed if data recording was unsuccessful
}

# closes connection
$conn->close()
?>