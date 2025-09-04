<?php

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function returnWithError( $err )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

?>
