function verDetalle(params) {
    $.ajax({
    url: '../Controller/productApi.php?id='+params,
    type: 'GET',
    success: function(data) {
        let info = JSON.parse(data);
        let estado = "";
        let imag = "../Uploads/"+info.imagen;
        $("#idProductospan").text(info.id_productos);
        $("#nombreProductospan").text(info.nombre);
        $("#precioProductospan").text(info.precio);
        $("#fabricanteProductospan").text(info.fabricante);
        $("#marcaProductospan").text(info.marca);
        $("#modeloProductospan").text(info.modelo);
        $("#fechaProductospan").text(info.fecha_carga);

        if(info.estado=="0"){
            estado = '<span class="badge bg-success p-2">activo</span>';
        }else{
            estado = '<span class="badge bg-secondary p-2">borrador</span>';
        }
        $("#estadoProductospan").html(estado);
        if(info.imagen!=""){
            $("#imgDetalleProducto").attr('src',imag);
        }else{
            imag='../Asset/img/defaultImgProduct.png'
            $("#imgDetalleProducto").attr('src',imag);
        }

    }
    });

}

function limpiarModal() {
document.getElementById('form-producto').reset();
}

function limpiarModal2() {
document.getElementById('form-productoEditar').reset();
}

function actualizarDatatable() {
$('#tablaProducto').DataTable().ajax.reload();
}

function actualizarDatatable2() {
$('#tablaProducto').DataTable().ajax.reload();
}

function ocultarModal() {
$("#productoModal").modal("hide");
}

function ocultarModal2() {
$("#productoModalEditar").modal("hide");
}

$(document).ready(function() {

$("#form-producto").on("submit", function(e){

e.preventDefault();

let valid = true;

let nombre = $("#nombreProducto").val();
if(nombre==""||nombre.length==0){
valid= false;
}

let precio = $("#precioProducto").val();
if(precio==""){
valid= false;
}

let fabricante = $("#fabricanteProducto").val();
if(fabricante==""||fabricante.length==0){
valid= false;
}

let marca = $("#marcaProducto").val();
if(marca==""||marca.length==0){
valid= false;
}

let modelo = $("#modeloProducto").val();
if(modelo==""||modelo.length==0){
valid= false;
}

let estado = $("#estadoProducto").val();
if(estado==""||estado==null){
valid= false;
}

let imagenProducto = $("#image").val();
if(imagenProducto==""||imagenProducto==null){
valid= false;
}

if(valid==true){

var formData = new FormData(this);

$.ajax({
url  : "../Controller/upload.php",
type : "POST",
cache:false,
data :formData,
contentType : false, 
processData: false,
success:function(response){
    
    let info = JSON.parse(response);
    let valor = info[0];
    let respuesta = info[1];

    if(valor==true){

        let nombreFinal=respuesta;
        let datos = {
        'nombre':nombre,
        'precio':precio,
        'fabricante':fabricante,
        'marca':marca,
        'modelo':modelo,
        'estado':estado,
        'imagen':nombreFinal
        };

        $.ajax({
        data: datos,
        url: '../Controller/productApi.php',
        type: 'POST',
        success: function(data) {

            actualizarDatatable();
            limpiarModal();
            ocultarModal();

            Swal.fire(
            'Cargado!',
            'Producto cargado correctamente.',
            'success'
            )

        }
        });
        
    }else{

        Swal.fire(
        'Error!',
        respuesta,
        'error'
        )

    }

}
});

return false;



}

});



$("#form-productoEditar").on("submit", function(e){

e.preventDefault();

let valid = true;
let cambiaImag = true;

let nombre = $("#nombreProductoEditar").val();
if(nombre==""||nombre.length==0){
valid= false;
}

let precio = $("#precioProductoEditar").val();
if(precio==""){
valid= false;
}

let fabricante = $("#fabricanteProductoEditar").val();
if(fabricante==""||fabricante.length==0){
valid= false;
}

let marca = $("#marcaProductoEditar").val();
if(marca==""||marca.length==0){
valid= false;
}

let modelo = $("#modeloProductoEditar").val();
if(modelo==""||modelo.length==0){
valid= false;
}

let estado = $("#estadoProductoEditar").val();
if(estado==""||estado==null){
valid= false;
}

let imagenProducto = $("#imageEditar").val();
if(imagenProducto==""||imagenProducto==null){
cambiaImag= false;
}

let idProducto = $("#idProductoEdit").val();

if(valid==true){

if(cambiaImag==true){

var formData = new FormData(this);

$.ajax({
url  : "../Controller/upload.php",
type : "POST",
cache:false,
data :formData,
contentType : false, 
processData: false,
success:function(response){


   let info = JSON.parse(response);
   let valor = info[0];
   let respuesta = info[1];

   if(valor==true){

       let nombreFinal=respuesta;

       $.ajax({
       url: '../Controller/productApi.php?id_productos='+idProducto+'&nombre='+nombre+'&precio='+precio+'&fabricante='+fabricante+'&marca='+marca+'&modelo='+modelo+'&estado='+estado+'&imagen='+nombreFinal,
       type: 'PUT',
       success: function(data) {

           actualizarDatatable();
           limpiarModal2();
           ocultarModal2();

           Swal.fire(
           'Editado!',
           'Producto editado correctamente.',
           'success'
           )

       }
       });
       
   }else{

       Swal.fire(
       'Error!',
       respuesta,
       'error'
       )

   }

}
});
}
else{

       $.ajax({
       url: '../Controller/productApi.php?id_productos='+idProducto+'&nombre='+nombre+'&precio='+precio+'&fabricante='+fabricante+'&marca='+marca+'&modelo='+modelo+'&estado='+estado,
       type: 'PUT',
       success: function(data) {

           actualizarDatatable();
           limpiarModal2();
           ocultarModal2();

           Swal.fire(
           'Editado!',
           'Producto editado correctamente.',
           'success'
           )

       }
       });

        }


return false;



}

});


 



$('#tablaProducto').DataTable({
    'processing': true,
    'serverSide': true,
    'serverMethod': 'post',
    'ajax': {
        'url':'../Controller/productApi.php?dataTable=true'
    },
    language: {
    url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
    },
    columns: [
    { data:'id_productos',name:"id_productos" },
    { data: 'nombre',name:'nombre' },
    { data: 'precio',name:'precio' },
    { data: 'fabricante',name:'fabricante' },
    { data: 'marca',name:'marca' },
    { data: 'modelo',name:'modelo' },
    { data: 'fecha_carga',name:'fecha_carga' },
    { data: 'estado',name:'estado',"render":function(data, type,row){
        const estado = row.estado;
        let c ;
        if(estado==0){
            c='<span class="badge bg-success p-2">activo</span>';
        }else{
            c='<span class="badge bg-secondary p-2">borrador</span>';
        }

        return c;

        } 
    },
    { data: null,name:'accion',orderable:false,searchable:false,"render":function(data, type,row){
        
        const id = row.id_productos;
        let c = '<button class="btn btn-sm p-1" title="ver detalle" data-bs-toggle="modal" data-bs-target="#productoModalDetalle" onclick="verDetalle('+id+')"><i class="fas fa-info-circle"></i></button><button class="btn btn-sm p-1" title="editar" data-bs-toggle="modal" data-bs-target="#productoModalEditar" onclick="editar('+id+')"><i class="far fa-edit"></i></button><button class="btn btn-sm p-1" title="eliminar" onclick="eliminar('+id+')"><i class="fas fa-trash "></i></button>'
        return c;
        
        }

    }

    ]
});








$('#precioProducto').inputmask( 'currency',{"autoUnmask": true,
radixPoint:",",
groupSeparator: ".",
allowMinus: false,
prefix: '$ ',            
digits: 2,
digitsOptional: false,
rightAlign: true,
unmaskAsNumber: true
});

$('#precioProductoEditar').inputmask( 'currency',{"autoUnmask": true,
radixPoint:",",
groupSeparator: ".",
allowMinus: false,
prefix: '$ ',            
digits: 2,
digitsOptional: false,
rightAlign: true,
unmaskAsNumber: true
});



} );

function eliminarApi(params) {
$.ajax({
url: '../Controller/productApi.php?id='+params,
type: 'DELETE',
success: function(data) {
actualizarDatatable();
}
});
}

function editar(params) {


$.ajax({
    url: '../Controller/productApi.php?id='+params,
    type: 'GET',
    success: function(data) {
        let info = JSON.parse(data);
        let estado = "";
        let imag = "../Uploads/"+info.imagen;

        
        $("#idProductoEdit").val(info.id_productos);
        $("#nombreProductoEditar").val(info.nombre);
        $("#precioProductoEditar").val(info.precio);
        $("#fabricanteProductoEditar").val(info.fabricante);
        $("#marcaProductoEditar").val(info.marca);
        $("#modeloProductoEditar").val(info.modelo);
        $('#estadoProductoEditar').val(info.estado);


        if(info.imagen!=""){
            $("#imageEditarPreview").attr('src',imag);
        }else{
            imag='../Asset/img/defaultImgProduct.png'
            $("#imageEditarPreview").attr('src',imag);
        }

    }
    });


}


function eliminar(param) {
Swal.fire({
title: 'Estas seguro?',
text: 'Registro #'+param+" se borrará de forma permanente!",
icon: 'warning',
showCancelButton: true,
cancelButtonColor: '#6c757d',
cancelButtonText: 'Cancelar',
confirmButtonColor: '#3085d6',
confirmButtonText: 'Si, bórralo!'

}).then((result) => {
if (result.isConfirmed) {
eliminarApi(param)
Swal.fire(
'Eliminado!',
'Producto eliminado correctamente.',
'success'
)

}
})

}