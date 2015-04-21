<?php


header('Access-Control-Allow-Origin: *');
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

// DB table to use
$table = 'datos';

// Table's primary key
$primaryKey = 'id_doctor';

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'id_doctor', 'dt' => 'id_doctor' ),
    array( 'db' => 'nombre_doctor',  'dt' => 'nombre_doctor' ),
    array( 'db' => 'numcolegiado',   'dt' => 'numcolegiado' ),
    array( 'db' => 'clinicas',   'dt' => 'clinicas' ),
);

$sql_details = array(
    'user' => 'root',
    'pass' => 'root',
    'db'   => 'clinica',
    'host' => 'localhost'
);


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */
require( 'ssp.class.php' );

echo $_GET['callback'].json_encode(
        SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
    );

