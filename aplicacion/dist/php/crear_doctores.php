<?php
header('Access-Control-Allow-Origin: *');
require_once 'Funciones.php';

//OBTENGO LOS VALORES
$nombre = $_REQUEST["nombreDoctor"];
$numcolegiado = $_REQUEST["numColegiado"];
$clinicas = $_REQUEST["clinicasSelect"];


//EJECUTO LA FUNCION
$resultado = Funciones::crearDoctor(null,$nombre,$numcolegiado,$clinicas);

echo json_encode($resultado);
?>