<?php

# contains json function and return error function
require("./util.php");

$env = parse_ini_file('.env');

$inData = getRequestInfo();

$username = $inData["username"];  
$password = $inData["password"];
$hash_password = hash_string($password);

$conn = new mysqli("localhost", $env["dbUser"], $env["dbPass"], $env["dbName"]);

if ($conn->connect_error) 
{
    returnWithError("Internal Server Error, please try again.");
} 
else 
{
    $query = "SELECT * FROM Users WHERE username=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) 
    {
        if ($row["password"] == $hash_password) {
            returnWithInfo($row["firstName"], $row["lastName"], $row["userID"]);
        }
        else 
        {
            returnWithError("Password Incorrect.");
        }
    } 
    else 
    {
        returnWithError("No records found, please re-enter or signup.");
    }

    $stmt->close();

}

$conn->close(); 

?>
