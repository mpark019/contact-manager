<?php

// path of the log file where errors need to be logged
$log_file = "./php-error.log";

// setting error logging to be active
ini_set("log_errors", TRUE); 

// setting the logging file in php.ini
ini_set('error_log', $log_file);

// returns the md5 hash of the password
function hash_string( $str ) 
{
    return md5($str);
}

// decodes the json from the input
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// send results as json object
function sendResultInfoAsJson( $obj )
{
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header('Content-type: application/json');
    echo $obj;
}

// return with error 
function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

// return with login information
function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

// return with login information
function returnWithSearch( $results )
{
    $retValue = '{"searchResults": [' . $results . ']}';
    sendResultInfoAsJson( $retValue );
}


?>
