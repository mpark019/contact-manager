<?php
require_once("../util.php");

$env = parse_ini_file(".env");
$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = isset($inData["phone"]) ? $inData["phone"] : "";
$email = isset($inData["email"]) ? $inData["email"] : "";
$userID = $inData["userID"];
$contactID = $inData["contactID"];

$conn = new mysqli("localhost", $env["dbuser"], $env["dbPass"], $env["dbName"]);

if ($conn->connect_error) {
    returnWithError("Database connection failed");
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?, phoneNumber = ?, email = ? WHERE userID = ? AND contactID = ?");
    $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $userID, $contactID);

    if ($stmt->execute()) {
        returnWithError(""); // Empty error means success
    } else {
        returnWithError("Failed to edit contact");
    }

    $stmt->close();
}

$conn->close();
?>
