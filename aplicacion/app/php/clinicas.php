<?php
header('Access-Control-Allow-Origin: *');
header('content-type: application/json; charset=utf-8');


//Cadena de conexión:
$connect = mysql_connect("localhost", "root", "root")
or die('Could not connect: ' . mysql_error());


//seleccionamos bbdd:
$bool = mysql_select_db("clinica", $connect);
if ($bool === False){
    print "No puedo encontrar la bbdd: $database";
}

//inicializamos el cliente en utf-8:
mysql_query('SET names utf8');


$query = "SELECT * FROM clinicas";

$result = mysql_query($query) or die("SQL Error: " . mysql_error());
$data = array();
// obtenemos los datos:
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    $data[] = array(
        'id_clinica' => $row['id_clinica'],
        'nombre' => $row['nombre'],
        'razonsocial' => $row['razonsocial'],
        'cif' => $row['cif'],
        'localidad' => $row['localidad'],
        'provincia' => $row['provincia'],
        'direccion' => $row['direccion'],
        'cp' => $row['cp'],
        'numclinica' => $row['numclinica'],
        'id_tarifa' => $row['id_tarifa']

    );
}



//codificamos en json:
$json = json_encode($data);

//enviamos datos en json, tal y como espera la petición ajax:
echo $json;


?>
