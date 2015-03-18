

$(document).ready(function() {



    $('#example').dataTable( {

        ajax: "http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ_2/php.php",
        columns:[
            {data:"id_doctor"},
            {data:"nombre"},
            {data:"numcolegiado"},
            {
              data:null,
              defaultContent:'clinicas'
            },
            {
                data:null,
                className:'center',
                defaultContent:'<button id="editar" class="btn btn-primary btn-sm">Editar</button>'
            },
            {
                data:null,
                className:'center',
                defaultContent:'<button id="borrar" class="btn btn-warning btn-sm">Borrar</button>'
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

    $('table').on('click','tr td #editar',function(){
        $('#forEditar').modal('show');

    });

    $('table').on('click','tr td #borrar',function() {

        /*
        $('table tr').each(function(index){
        var nombre = $(this).find("td").eq(0).html();
        $('#idDoctor').html(nombre);
        });
        */
        $('table tbody tr').each(function(index){
        var nombre = $(this).closest('tr').find("td:nth-child(1)").html();
        $('#idDoctor').html(nombre);
        });     

        $('#forBorrar').modal('show');
    });
//////////////////////////CARGAR LISTA DE CLINICAS EN EL FORMULARIO/////////////
    
    $.ajax({
        url: 'http://localhost:8888/TAREA_DWEC_DATATABLES_AXAJ_2/clinicas.php',
        type: 'GET',
        dataType: 'json',
        data: {param1: 'value1'},
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
////////////////////////// METODO PARA OBTENER EL DOCTOR DE LA LISTA/////////////////
          
    
} );