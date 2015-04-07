

$(document).ready(function() {
var miTabla;
//////////////////////////CARGAR LISTA DE CLINICAS EN EL FORMULARIO/////////////

    var clinicas = $.ajax({
        url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/clinicas.php',
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

        ajax:"http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/datos.php",

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

    } );
//////////////////////////VENTANAS EMERGENTES///////////////////////////////

    //EDITAR DOCTOR/////////////////////////////////////////////////////////

    $('table').on('click','.editar',function(){

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();

        $('#inputNombre').val(aData.nombre_doctor);
        $('#inputColegiado').val(aData.numcolegiado);

        $('#forEditar').modal('show');
        var validar = $('#formularioEditar').validate({
            rules: {
                nombre: {
                    required: true
                },
                numColegiado: {
                    required: true,
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
                    required:"Este campo es obligatorio",
                    digits:"Este campo es numerico"
                },
                clinicas:{
                    required:"Debes seleccionar almenos una clinica"
                }
            }
        });

        $('#ConfirmaGuardar').on('click',function(){


                var clinicasSelect = $('#inputClinicas').val();
                var nombreDoctor = $('#inputNombre').val();
                var numColegiado = $('#inputColegiado').val();
                var doc_id = aData.id_doctor;
                var clinicas = aData.clinicas;

                var clin = clinicas.split('</li><li>');

            $.each(clin,function(ind,value){

                if(value == $('.option').html()){
                    this.prop("selected");
                }
            });


            //alert(clinicasSelect+'-'+nombreDoctor+'-'+numColegiado+'-'+doc_id+'-'+clin+'--'+$('.option').html());

            if(validar==true) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/modificar_doctores.php',
                    data: {
                        idDoctor: doc_id,
                        nombreDoctor: nombreDoctor,
                        numColegiado: numColegiado,
                        clinicasSelect: clinicasSelect
                    },
                    error: function (xhr, status, error) {
                        //mostraríamos alguna ventana de alerta con el error
                        $.growl.error({ message: "No se ha podido modificar el doctor" });
                    },
                    success: function (data) {
                        //obtenemos el mensaje del servidor, es un array!!!
                        //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                        //actualizamos datatables:
                        /*para volver a pedir vía ajax los datos de la tabla*/
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


        var id_doctor = $(this).prop('value');
        $('#forBorrar').modal('show');

        $('#ConfirmaBorrar').on('click',function(){

            $.ajax({
                /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
                type: 'POST',
                dataType: 'json',
                url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/borrar_doctor.php',
                //estos son los datos que queremos actualizar, en json:
                data: {
                    id_doctor: id_doctor
                },

                error: function () {

                    $.growl.error({ message: "No se ha podido borrar el doctor" });
                },
                success: function (data) {
                    //obtenemos el mensaje del servidor, es un array!!!
                    //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                    //actualizamos datatables:
                    /*para volver a pedir vía ajax los datos de la tabla*/

                    $.growl.notice({ message: "El doctor ha sido borrado" });
                    miTabla.ajax.reload();


                    $('#forBorrar').modal('hide');
                }
            })
        });
    });

// CREAR NUEVO DOCTOR /////////////////////////////////////////////////////////////

    $('#nuevoDoctor').on('click',function(){

        $('#forCrear').modal('show');

        var validar =  $('#formularioCrear').validate({
            rules: {
                nombre: {
                    required: true
                },
                numColegiado: {
                    required: true,
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
                        required:"Este campo es obligatorio",
                        digits:"Este campo es numerico"
                    },
                    clinicas:{
                        required:"Debes seleccionar almenos una clinica"
                    }
                }

        });


        $('#ConfirmaCrear').on('click',function(){

            var clinicasSelect = $('#inputCrearClinicas').val();
            var nombreDoctor = $('#inputCrearNombre').val();
            var numColegiado = $('#inputCrearColegiado').val();

            if(validar==true) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: "http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/crear_doctores.php",
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



} );