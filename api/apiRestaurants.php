<?php
// header('Access-Control-Allow-Origin: http://localhost/mapa/api/apiRestaurants.php');
// header('Access-Control-Allow-Origin: http://localhost:3000/bares');
// header('Access-Control-Allow-Origin: *'); access to all
header('Access-Control-Allow-Origin: https://my-json-server.typicode.com/bcnActivaRepositorio/leafletGps/bares');
include("_db.php");
// call to database
$db = ("mysql:host=localhost;dbname=restaurants");
$sql = "SELECT * FROM restaurants "; 
$result = $mysqli->query($sql);

$numrows = $result->num_rows;

$datos = array();

$datos = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($datos);

?>
		
