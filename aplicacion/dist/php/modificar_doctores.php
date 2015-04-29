<?php
header('Access-Control-Allow-Origin: *');
require_once 'Funciones.php';


$id_doctor = $_POST['idDoctor'];
$nombre = $_REQUEST["nombreDoctor"];
$numcolegiado = $_REQUEST["numColegiado"];
$clinicas = $_REQUEST["clinicasSelect"];

$resultado = Funciones::borrarDoctor($id_doctor);
$resultado2 = Funciones::crearDoctor($id_doctor,$nombre,$numcolegiado,$clinicas);
//$resultado = Funciones::modificarDoctor($id_doctor,$nombre,$numcolegiado,$clinicas);
echo json_encode($resultado);
?>
