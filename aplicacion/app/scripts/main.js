$.ajaxSetup({cache:false});

$(document).ready(function() {


    var miTabla;

//////////////////////////CARGAR LISTA DE CLINICAS EN EL FORMULARIO/////////////

    var clinicas = $.ajax({
        //url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/clinicas.php',
        url: 'php/clinicas.php',
        type: 'GET',
        dataType: 'json'

    })
        .done(function(data) {
            $.each(data, function(index) {
                $('.listaClinicas').append('<option class="option" value="'+data[index].id_clinica+'" >' + data[index].nombre + '</option>');
            });
        })
        .fail(function() {
            console.log("error al cargar la lista de clinicas");
        })
        .always(function() {
            console.log("complete");
        });

///////////////////////////////CARGO LA TABLA///////////////////////////////////////

     miTabla = $('#example').DataTable( {

        //ajax:"http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/datos.php",
         ajax:"php/datos.php",
        columns:[
            {data:"id_doctor"},
            {data:"nombre_doctor",
                render:function(data){
                    return'<a class="editar">'+data+'</a>'
                }
            },
            {data:"numcolegiado"},
            {
              data:"clinicas",
              render:function(data){
                  return '<ul><li>'+data+'</li></ul>'
              }
            },
            {
                data: 'id_doctor',
                render: function (data) {
                    return '<button class="editar btn btn-primary btn-sm" value="' + data + '">Editar</button>'
                }
            },
            {
                data: 'id_doctor',
                render: function (data) {
                    return '<button class="borrar btn btn-warning btn-sm" value="' + data + '">Borrar</button>'
                }
            }
        ],
        language:{
            url:"//cdn.datatables.net/plug-ins/f2c75b7247b/i18n/Spanish.json"
        },
        columnDefs:[{
            targets:[0],
            visible:false
        }]
    });

//////////////////////////VENTANAS EMERGENTES///////////////////////////////

//////////////////////////EDITAR DOCTOR/////////////////////////////////////////////////////////

    $('table').on('click','.editar',function(){

        //limpio los selected de la lista de clinicas
        $('.listaClinicas option').removeAttr("selected");

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();

        //saco los datos de la tabla
        var id_doctor = $(this).prop('value');
        $('#inputNombre').val(aData.nombre_doctor);
        $('#inputColegiado').val(aData.numcolegiado);
        var clinicas = aData.clinicas;

        //paso el id_doctor a un imput timpo hidden para recuperarlo despues
        $('#id_doc').prop('value',id_doctor);

        // clin es un array con el nombre de las clinicas del doctor
        var clin = clinicas.split('</li><li>');

        // esto hace selected de la lista de clinicas.
        $.each(clin,function(index, value){

            $('.listaClinicas option').each(function(){
                var texto = $(this).text();

                if(value == texto){
                    $(this).prop('selected',true);
                }
            });
        });

        //ahora se muestra el formulario
        $('#forEditar').modal('show');

        //al pulsar el boton de confirmar modificacion
        $('#ConfirmaGuardar').off('click').on('click',function(event){
            event.preventDefault();

            //validamos el formulario
            var validar = $('#formularioEditar').validate({
                rules: {
                    nombre: {
                        required: true
                    },
                    numColegiado: {
                        digits: true
                    },
                    clinicas: {
                        required: true,
                        minlength: "1"
                    }
                },
                messages:{
                    nombre:{
                        required:"Debes introducir el nombre"
                    },
                    numColegiado:{
                        required: false,
                        digits:"Este campo es numerico"
                    },
                    clinicas:{
                        required:"Debes seleccionar almenos una clinica"
                    }
                }
            }).form();
                var clinicasSelect = $('#inputClinicas').val();
                var nombreDoctor = $('#inputNombre').val();
                var numColegiado = $('#inputColegiado').val();
                //el id_doctor sale del input type hidden
                var id_doctor = $('#id_doc').val();

            if(validar==true) {
                var modificar = $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    //url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/modificar_doctores.php',
                    url: 'php/modificar_doctores.php',
                    data: {
                        idDoctor: id_doctor,
                        nombreDoctor: nombreDoctor,
                        numColegiado: numColegiado,
                        clinicasSelect: clinicasSelect
                    },
                    error: function () {

                        $.growl.error({ message: "No se ha podido modificar el doctor" });
                    },
                    success: function () {
                        miTabla.ajax.reload();
                        $.growl.notice({ message: "El doctor ha sido modificado" });

                        $('#forEditar').modal('hide');
                    }
                })

            }
        })
    });

// BORRAR DOCTOR /////////////////////////////////////////////////////////////

    $('table').on('click','.borrar',function() {

        var id_doc = $(this).prop('value');
        $('#id_docBorrar').val(id_doc);
        $('#forBorrar').modal('show');

        $('#ConfirmaBorrar').off('click').on('click',function(){
            var id_doctor = $('#id_docBorrar').val();
            $.ajax({

                type: 'POST',
                dataType: 'json',
                //url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/borrar_doctor.php',
                url: 'php/borrar_doctor.php',
                //estos son los datos que queremos actualizar, en json:
                data: {
                    id_doctor: id_doctor
                },

                error: function () {

                    $.growl.error({ message: "No se ha podido borrar el doctor" });
                },
                success: function () {

                    $.growl.notice({ message: "El doctor ha sido borrado" });
                    miTabla.ajax.reload();

                    $('#forBorrar').modal('hide');
                }
            });
        });
    });

// CREAR NUEVO DOCTOR /////////////////////////////////////////////////////////////

    $('#nuevoDoctor').on('click',function(){

        $('.listaClinicas option').removeAttr("selected");

        $('#forCrear').modal('show');

        $('#ConfirmaCrear').off('click').on('click',function(event){
           event.preventDefault();
            var validar =  $('#formularioCrear').validate({
                rules: {
                    nombre: {
                        required: true
                    },
                    numColegiado: {
                        required:false,
                        digits: true
                    },
                    clinicas: {
                        required: true,
                        minlength: "1"
                    }
                },
                messages:{
                    nombre:{
                        required:"Debes introducir el nombre"
                    },
                    numColegiado:{

                        digits:"Este campo es numerico"
                    },
                    clinicas:{
                        required:"Debes seleccionar almenos una clinica"
                    }
                }

            }).form();
            var clinicasSelect = $('#inputCrearClinicas').val();
            var nombreDoctor = $('#inputCrearNombre').val();
            var numColegiado = $('#inputCrearColegiado').val();

            if(numColegiado == ""){
                numColegiado = null;
            }


            if(validar==true) {
               $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    //url: "http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/crear_doctores.php",
                   url: "php/crear_doctores.php",
                    data: {
                        nombreDoctor: nombreDoctor,
                        numColegiado: numColegiado,
                        clinicasSelect: clinicasSelect
                    },
                    error: function () {

                        $.growl.error({ message: "No se ha podido crear el doctor" });
                    },
                    success: function (data) {

                        miTabla.ajax.reload();
                        $.growl.notice({ message: "El doctor ha sido creado" });

                        $('#forCrear').modal('hide');
                        $('#inputCrearClinicas').val('');
                        $('#inputCrearNombre').val('');
                        $('#inputCrearColegiado').val('');
                    }
                });
            }
        });
    });
});