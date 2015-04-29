<?php
header('Access-Control-Allow-Origin: *');
require_once 'Funciones.php';

//saco los datos
$id_doctor = $_POST['id_doctor'];

//se ejecuta la funcion
    $resultado = Funciones::borrarDoctor($id_doctor);

echo json_encode($resultado);
?>