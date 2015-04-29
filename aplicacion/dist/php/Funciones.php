<?php
header('Access-Control-Allow-Origin: *');
require_once 'conexion.php';


class Funciones {

/////////////////////FUNCION PARA BORRAR DOCTOR///////////////////////////////////////////////

    public static function borrarDoctor($id_doctor){


        $con = conexion::conectar();
        $query = "delete from clinica_doctor where id_doctor=" . $id_doctor;
        $resultado1 = $con->query($query);


        $query = "delete from doctores where id_doctor=" . $id_doctor;
        $resultado2 = $con->query($query);

        if($resultado1->rowCount()!= 0 and $resultado2->rowCount()!= 0){
            $mensaje = "Actualización correcta";
            $estado = 0;
        }else{
            $mensaje = "Imposible borrar el doctor";
            $estado = mysql_errno();
        }
        $resultado = array();
        $resultado[] = array(
            'mensaje' => $mensaje,
            'estado' => $estado
        );
        return $resultado;

    }
/////////////////////////FUNCION PARA CREAR DOCTOR////////////////////////////////////////////////
    /*
     *Si se trata de un nuevo docotor el id_doctor sera null ya que no lo conozco, si por el contrario se modifica un doctor
     * primero lo borro completamente y luego lo creo con el id que ya tenia.
     */
    public static function crearDoctor($id_doctor = null, $nombre, $numcolegiado, $clinicas){
        $con = conexion::conectar();

        if($id_doctor == null) {
            $query = 'SELECT max(id_doctor)as numero FROM doctores';
            $result = $con->query($query);
            $fila = $result->fetch();
            $id_doctor = $fila['numero'] + 1;
        }

        $query="INSERT INTO doctores (id_doctor, nombre,numcolegiado)VALUES ($id_doctor,'".$nombre."','".$numcolegiado."');";


        foreach($clinicas as $clinica){

            $query .="INSERT INTO clinica_doctor (id_doctor, id_clinica, numdoctor) VALUES (".$id_doctor.",".$clinica.",'".$numcolegiado."');";
        }

        $result = $con->prepare($query);
        $respuesta = $result->execute();


        if($respuesta != 0){
            $mensaje = "Creacion correcta";
            $estado = 0;
        }else{
            $mensaje = "Imposible crear el doctor";
            $estado = mysql_errno();
        }
        $resultado = array();
        $resultado[] = array(
            'mensaje' => $mensaje,
            'estado' => $estado
        );
        return $resultado;
        }

    ////////////////////////////ESTE MEDOTO NO SE UTILIZA ///////////////////////////
    /*
     * Al crear un metodo crearDoctor al que le puedo o no pasar el id_doctor no es necesario el metodo modificar
     * ya que lo que hago es borrartodo el doctor y crear un nuevo doctor con el mismo id.
     */

    public static function modificarDoctor($id_doctor, $nombre, $numColegiado, $clinicas){
        $con = conexion::conectar();
        $query  ="UPDATE doctores SET nombre= '".$nombre."', numcolegiado= ".$numColegiado."WHERE id_doctor =".$id_doctor.";";
        $query .= "delete from clinica_doctor where id_doctor=" . $id_doctor.";";
        foreach($clinicas as $clinica){

            $query .="INSERT INTO clinica_doctor (id_doctor, id_clinica, numdoctor) VALUES (".$id_doctor.",".$clinica.",'".$numColegiado."');";
        }
        $result = $con->prepare($query);
        $respuesta = $result->execute();

        if($respuesta != 0){
            $mensaje = "Modificacion correcta";
            $estado = 0;
        }else{
            $mensaje = "Imposible modificar el doctor";
            $estado = mysql_errno();
        }
        $resultado = array();
        $resultado[] = array(
            'mensaje' => $mensaje,
            'estado' => $estado
        );
        return $resultado;
    }

}
