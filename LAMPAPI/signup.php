<?php

# contains json function and return error function
require("./util.php");

$env = parse_ini_file('.env');

$inData = getRequestInfo();

$username = $inData["username"];  
$password = hash_string($inData["password"]);
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];

$conn = new mysqli("localhost", $env["dbUser"], $env["dbPass"], $env["dbName"]);

if ($conn->connect_error) 
{
    returnWithError("Internal Server Error, please try again.");
} 
else 
{

    // Verify the account doesnt already exist
    $query = "SELECT * FROM Users WHERE username=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($row = $result->fetch_assoc()) 
    {
        returnWithError("Username already exists.");
    }
    else 
    {
        // Create a new user
        $query = "INSERT INTO Users (username, firstName, lastName, password) VALUES (?, ?, ?, ?);";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssss", $username, $firstName, $lastName, $password);
        $stmt->execute();
        $stmt->close();

        returnWithError("Signup successful, please login.");
    }

}

$conn->close(); 

?>
