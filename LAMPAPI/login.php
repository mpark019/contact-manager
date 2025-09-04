<?php

# contains json function and return error function
require("./util.php");

$env = parse_ini_file('.env');

$inData = getRequestInfo();

$username = $inData["username"];  
$password = $inData["password"];

$conn = new mysqli("localhost", $env["dbUser"], $env["dbPass"], $env["dbName"]);

if ($conn->connect_error) 
{
  returnWithError($conn->connect_error);
} 
else 
{
  $query = "select * from Users where username"
  $conn->prepare($query) 
}

$conn->close(); 


?>
