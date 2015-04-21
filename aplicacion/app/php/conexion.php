<?php

class conexion {

    public  static function conectar(){

        $con = new PDO("mysql:host=localhost;charset=utf8;dbname=clinica", "root", "root");

        return $con;
    }
};
?>
