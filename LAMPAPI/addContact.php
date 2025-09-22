<?php

require("./util.php");

$env = parse_ini_file('.env');

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$email = $inData["email"];
$userId = $inData["userID"];

$conn = new mysqli("localhost", $env["dbUser"], $env["dbPass"], $env["dbName"]);
if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $stmt = $conn->prepare("INSERT into Contacts (userId,firstName,lastName,phoneNumber,email) VALUES(?,?,?,?,?)");
    $stmt->bind_param("sssss", $userId, $firstName, $lastName, $phoneNumber, $email);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");
}

?>
