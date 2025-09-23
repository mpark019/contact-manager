<?php
require_once("../util.php");

$env = parse_ini_file(".env");
$inData = getRequestInfo();

$userID = $inData["userID"];
$contactID = $inData["contactID"];

$conn = new mysqli("localhost", $env["dbuser"], $env["dbPass"], $env["dbName"]);

if ($conn->connect_error) {
    returnWithError("Database connection failed");
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE userID = ? AND contactID = ?");
    $stmt->bind_param("ii", $userID, $contactID);

    if ($stmt->execute()) {
        returnWithError(""); // Empty error means success
    } else {
        returnWithError("Failed to delete contact");
    }

    $stmt->close();
}

$conn->close();
?>
