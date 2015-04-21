<?php
require_once 'conexion.php';

$con = conexion::conectar();

$query = 'SELECT max(id_doctor)as numero FROM doctores';
$result = $con->query($query);
$fila = $result->fetch();
$id_doctor= $fila['numero']+1;
echo $id_doctor;