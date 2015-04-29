<?php

class conexion {

    public  static function conectar(){

        $con = new PDO("mysql:host=localhost;charset=utf8;dbname=rodrigobenido_cl", "rodrigobenido_cl", "rodrigobenido_cl");

        return $con;
    }
};
?>
