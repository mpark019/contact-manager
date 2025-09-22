<?php

    require("./util.php");

    $env = parse_ini_file('.env');

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", $env["dbUser"], $env["dbPass"], $env["dbName"]);

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from Contacts where firstName like ? and userID=?");
		$personName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $personName, $inData["userID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["firstName"] .' '. $row["lastName"] .' '. $row["phoneNumber"] .' '. $row["email"] . '"';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithSearch( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

?>
