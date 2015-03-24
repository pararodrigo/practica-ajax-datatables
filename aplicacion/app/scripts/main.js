
var miTabla;
$(document).ready(function() {

//////////////////////////CARGAR LISTA DE CLINICAS EN EL FORMULARIO/////////////

    var clinicas = $.ajax({
        url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/clinicas.php',
        type: 'GET',
        dataType: 'json'

    })
        .done(function(data) {
            $.each(data, function(index) {
                $('#inputClinicas').append('<option value="'+data[index].id_clinica+'">' + data[index].nombre + '</option>');
            });
        })

        .fail(function() {
            console.log("error al cargar la lista de clinicas");
        })
        .always(function() {
            console.log("complete");
        });

///////////////////////////////CARGO LA TABLA///////////////////////////////////////

     miTabla = $('#example').dataTable( {


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

    $('table').on('click','.editar',function(){

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        //var fila = nRow.rowIndex;
        //var aData = miTabla.row(fila).data();

        //var colegiado = 'num colegiado'

        $('#inputNombre').val(aData.nombre_doctor);
        $('#inputColegiado').val(aData.numcolegiado);

        $('#forEditar').modal('show');

        $('#ConfirmaGuardar').on('click',function(){
                var doc_id = $('#inputID').val();
                var clinicasSelect = $('#inputClinicas').val();
                var nombreDocotor = $('#inputNombre').val();
                var numColegiado = $('#inputColegiado').val();

            $.ajax({
                type: 'POST',
                dataType:'json',
                url:'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/modificar_doctores.php',
                data:{
                    idDoctor: doc_id,
                    nombreDoctor: nombreDocotor,
                    numColegiado: numColegiado,
                    clinicasSelect: clinicasSelect
                },
                error: function (xhr, status, error) {
                    //mostraríamos alguna ventana de alerta con el error
                    alert("Ha entrado en error");
                },
                success: function (data) {
                    //obtenemos el mensaje del servidor, es un array!!!
                    //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                    //actualizamos datatables:
                    /*para volver a pedir vía ajax los datos de la tabla*/
                    //miTabla.fnDraw();
                    miTabla.fnReloadAjax("http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/datos.php");

                    $('#forEditar').modal('hide');
                }
            })

        })


    });

    $('table').on('click','.borrar',function() {


        var id_doctor = $(this).prop('value');
        $('#idDoctor').html(id_doctor);
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
                error: function (xhr, status, error) {
                    //mostraríamos alguna ventana de alerta con el error
                    alert("Ha entrado en error");
                },
                success: function (data) {
                    //obtenemos el mensaje del servidor, es un array!!!
                    //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                    //actualizamos datatables:
                    /*para volver a pedir vía ajax los datos de la tabla*/
                    //miTabla.fnDraw();
                      miTabla.fnReloadAjax("http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ/datos.php");

                    $('#forBorrar').modal('hide');
                }
            })
        });
    });


          
    
} );