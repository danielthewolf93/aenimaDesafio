$(document).ready(function() {

    let i = document.querySelector('#customRange')
    

    i.addEventListener('input', function () {
      let minim = i.min;
      $("#customRangeSpan").html('<span>$'+minim+' - $'+i.value+'</span>');
      clickFiltros();
  }, false);

    
    $.ajax({
    url: '../Controller/productApi.php?precios=true',
    type: 'GET',
    beforeSend: function() {
      
      $("#customRangeSpan").html('<div class="d-flex justify-content-center">'
        +'<div class="spinner-border text-primary" role="status">'
        +'<span class="visually-hidden">Loading...</span>'
        +'</div>'
        +'</div>');
      
    },
    success: function(data) {

      let productos = JSON.parse(data);
        $("#customRangeSpan").html("");
        for (let index = 0; index < productos.length; index++) {
          const maximo = productos[index].maximo;
          const minimo = productos[index].minimo;

          $("#customRangeSpan").append('<span>$'+minimo+' - $'+maximo+'</span>');
          $("#customRange").attr("max",maximo);
          $("#customRange").attr("min",minimo);
          $("#customRange").attr("value",maximo);


    }

    }
    
    });

    $.ajax({
    url: '../Controller/productApi.php?fabricante=true',
    type: 'GET',
    beforeSend: function() {
      
      $("#fabricanteLista").html('<div class="d-flex justify-content-center">'
        +'<div class="spinner-border text-primary" role="status">'
        +'<span class="visually-hidden">Loading...</span>'
        +'</div>'
        +'</div>');
      
    },
    success: function(data) {

      let productos = JSON.parse(data);
        $("#fabricanteLista").html("");
        for (let index = 0; index < productos.length; index++) {
          const element = productos[index].fabricante;
          $("#fabricanteLista").append('<li class="list-group-item"><label class="text-uppercase"><input type="checkbox"  class="product_check" onclick="clickFiltros()" value="'+element+'" id="fabricanteListaCheck" > '+element+'</label></li>');
    }

    }
    
    });
    

    $.ajax({
    url: '../Controller/productApi.php?marca=true',
    type: 'GET',
    beforeSend: function() {
      
      $("#marcaLista").html('<div class="d-flex justify-content-center">'
        +'<div class="spinner-border text-primary" role="status">'
        +'<span class="visually-hidden">Loading...</span>'
        +'</div>'
        +'</div>');
      
    },
    success: function(data) {

      let productos = JSON.parse(data);
        $("#marcaLista").html("");
        for (let index = 0; index < productos.length; index++) {
          const element = productos[index].marca;
          $("#marcaLista").append('<li class="list-group-item"><label class="text-uppercase"><input type="checkbox"  class="product_check" onclick="clickFiltros()" value="'+element+'" id="marcaListaCheck" > '+element+'</label></li>');
    }

    }
    
    });



    $.ajax({
    url: '../Controller/productApi.php?modelo=true',
    type: 'GET',
    beforeSend: function() {
      
      $("#modeloLista").html('<div class="d-flex justify-content-center">'
        +'<div class="spinner-border text-primary" role="status">'
        +'<span class="visually-hidden">Loading...</span>'
        +'</div>'
        +'</div>');
      
    },
    success: function(data) {

      let productos = JSON.parse(data);
        $("#modeloLista").html("");
        for (let index = 0; index < productos.length; index++) {
          const element = productos[index].modelo;
          $("#modeloLista").append('<li class="list-group-item"><label class="text-uppercase"><input type="checkbox"  class="product_check" onclick="clickFiltros()" value="'+element+'" id="modeloListaCheck"> '+element+'</label></li>');
    }

    }
    
    });



   $.ajax({
    url: '../Controller/productApi.php',
    type: 'GET',
    beforeSend: function() {
      
      $("#listarProductos").html('<div class="d-flex justify-content-center">'
        +'<div class="spinner-border text-primary" role="status">'
        +'<span class="visually-hidden">Loading...</span>'
        +'</div>'
        +'</div>');
      

    },
    success: function(data) {
        let productos = JSON.parse(data);
        $("#listarProductos").html("");
        $("#cantidadResultados").text(productos.length+" resultados");
        if(productos.length>0){
        for (let index = 0; index < productos.length; index++) {
          const element = productos[index].id_productos;
          
          $("#listarProductos").append('<div class="col"><div class="card h-100 shadow-sm p-1 bg-body rounded">'
          +'<img src="../Uploads/'+productos[index].imagen+'" class="card-img-top border-bottom img-tam p-4"  alt="...">'
          +'<div class="card-body">'
            +'<h5 class="card-title">$'+productos[index].precio+'</h5>'
            +'<h6 class="card-subtitle text-muted mt-2">'+productos[index].nombre+'</h6>'
            +'<p class="card-text">'
              +'<ul class="list-unstyled">'
                +'<li><span>Fabricante : '+productos[index].fabricante+'</span></li>'
                +'<li><span>Marca : '+productos[index].marca+'</span></li>'
                +'<li><span>Modelo : '+productos[index].modelo+'</span></li>'
                +'</ul>'
                +'</p>'
                +'</div>'
                +'</div>'
                +'</div>');

          
        }
        }
        else{

          $("#precioLista").hide(true);
          $("#listarProductos").append('<h6>*No se encontraron productos</h6>');
        }

     
        
        
    }
    });



  });


  function clickFiltros(){
      
      var action = 'data';
      var modelo = get_filter_text('modeloListaCheck');
      var fabricante = get_filter_text('fabricanteListaCheck');
      var marca = get_filter_text('marcaListaCheck');
      var valorMax = $('#customRange').val();


      $.ajax({
        url:'../Controller/productApi.php',
        method:'POST',
        data:{action:action,modelo:modelo,fabricante:fabricante,marca:marca,valorMax:valorMax},
        beforeSend:function(){
          $("#listarProductos").html("");
        },
        success:function(response){

        let productos = JSON.parse(response);
        $("#listarProductos").html("");
        $("#cantidadResultados").text(productos.length+" resultados");
        for (let index = 0; index < productos.length; index++) {
          const element = productos[index].id_productos;
          
          $("#listarProductos").append('<div class="col"><div class="card h-100 shadow-sm p-1 bg-body rounded">'
          +'<img src="../Uploads/'+productos[index].imagen+'" class="card-img-top border-bottom img-tam p-4"  alt="...">'
          +'<div class="card-body">'
            +'<h5 class="card-title">$'+productos[index].precio+'</h5>'
            +'<h6 class="card-subtitle text-muted mt-2">'+productos[index].nombre+'</h6>'
            +'<p class="card-text">'
              +'<ul class="list-unstyled">'
                +'<li><span>Fabricante : '+productos[index].fabricante+'</span></li>'
                +'<li><span>Marca : '+productos[index].marca+'</span></li>'
                +'<li><span>Modelo : '+productos[index].modelo+'</span></li>'
                +'</ul>'
                +'</p>'
                +'</div>'
                +'</div>'
                +'</div>');

          
        }
        if(productos.length==0){
          $("#listarProductos").append('<h6>*No se encontraron productos</h6>');
        }

        }
      });

    }

    function get_filter_text(text_id) {
        var filterData = [];
        $('#'+text_id+':checked').each(function(){
          filterData.push($(this).val());
        });

        return filterData;
    }