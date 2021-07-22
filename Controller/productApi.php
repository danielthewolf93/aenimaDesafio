<?php
include "config.php";
include "utils.php";
$dbConn = connect($db);
/*
  listar todos los productos o solo uno
 */

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{   

   

    if (isset($_GET['precios'])&&$_GET['precios']==true)
    {
      //Mostrar fabricante
      $sql = $dbConn->prepare("SELECT MAX(precio) as maximo,MIN(precio) as minimo FROM productos ORDER BY precio");
      $sql->execute();
      header("HTTP/1.1 200 OK");
      echo json_encode(  $sql->fetchAll(PDO::FETCH_ASSOC)  );
      exit();
	  }

    if (isset($_GET['fabricante'])&&$_GET['fabricante']==true)
    {
      //Mostrar fabricante
      $sql = $dbConn->prepare("SELECT DISTINCT fabricante FROM productos  ORDER BY fabricante");
      $sql->execute();
      header("HTTP/1.1 200 OK");
      echo json_encode(  $sql->fetchAll(PDO::FETCH_ASSOC)  );
      exit();
	  }

      if (isset($_GET['marca'])&&$_GET['marca']==true)
    {
      //Mostrar marcas
      $sql = $dbConn->prepare("SELECT DISTINCT marca FROM productos  ORDER BY marca");
      $sql->execute();
      header("HTTP/1.1 200 OK");
      echo json_encode(  $sql->fetchAll(PDO::FETCH_ASSOC)  );
      exit();
	  }

      if (isset($_GET['modelo'])&&$_GET['modelo']==true)
      {
        //Mostrar modelos
        $sql = $dbConn->prepare("SELECT DISTINCT modelo FROM productos  ORDER BY modelo");
        $sql->execute();
        header("HTTP/1.1 200 OK");
        echo json_encode(  $sql->fetchAll(PDO::FETCH_ASSOC)  );
        exit();
        }

    if (isset($_GET['id']))
    {
      //Mostrar un producto
      $sql = $dbConn->prepare("SELECT * FROM productos where id_productos=:id");
      $sql->bindValue(':id', $_GET['id']);
      $sql->execute();
      header("HTTP/1.1 200 OK");
      echo json_encode(  $sql->fetch(PDO::FETCH_ASSOC)  );
      exit();
	  }
    else {
      //Mostrar lista de productos
      $sql = $dbConn->prepare("SELECT * FROM productos");
      $sql->execute();
      $sql->setFetchMode(PDO::FETCH_ASSOC);
      header("HTTP/1.1 200 OK");
      echo json_encode( $sql->fetchAll()  );
      exit();
	}
}
// Crear un nuevo producto
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{   


    if(isset($_POST['action']))
    {
        //Mostrar lista de productos con filtros

        $sql_form = "SELECT * FROM productos WHERE fabricante !=''";

        if(isset($_POST['fabricante'])){
            $fabricante = implode("','",$_POST['fabricante']);
            $sql_form .="AND fabricante IN('".$fabricante."')";
        }

        if(isset($_POST['marca'])){
            $marca = implode("','",$_POST['marca']);
            $sql_form .="AND marca IN('".$marca."')";
        }

        if(isset($_POST['modelo'])){
            $modelo = implode("','",$_POST['modelo']);
            $sql_form .="AND modelo IN('".$modelo."')";
        }

        if(isset($_POST['valorMax'])){
            $valorMax = $_POST['valorMax'];
            $sql_form .="AND precio <=".$valorMax;
        }


        


      $sql = $dbConn->prepare($sql_form);
      $sql->execute();
      $sql->setFetchMode(PDO::FETCH_ASSOC);
      header("HTTP/1.1 200 OK");
      echo json_encode( $sql->fetchAll()  );
      exit();

    }
    
    if(isset($_GET['dataTable']))
    {

        ## Read value
        $draw = $_POST['draw'];
        $row = $_POST['start'];
        $rowperpage = $_POST['length']; // Rows display per page
        $columnIndex = $_POST['order'][0]['column']; // Column index
        $columnName = $_POST['columns'][$columnIndex]['data']; // Column name
        $columnSortOrder = $_POST['order'][0]['dir']; // asc or desc
        $searchValue = $_POST['search']['value']; // Search value

        $searchArray = array();

        ## Search 
        $searchQuery = " ";
        if($searchValue != ''){
        $searchQuery = " AND (nombre LIKE :nombre or 
                precio LIKE :precio OR 
                fabricante LIKE :fabricante OR 
                marca LIKE :marca OR 
                modelo LIKE :modelo OR 
                fecha_carga LIKE :fecha_carga OR 
                estado LIKE :estado ) ";
        $searchArray = array( 
                'nombre'=>"%$searchValue%", 
                'precio'=>"%$searchValue%", 
                'fabricante'=>"%$searchValue%",
                'marca'=>"%$searchValue%",
                'modelo'=>"%$searchValue%",
                'fecha_carga'=>"%$searchValue%",
                'estado'=>"%$searchValue%"
        );
        }

        ## Total number of records without filtering
        $stmt = $dbConn->prepare("SELECT COUNT(*) AS allcount FROM productos ");
        $stmt->execute();
        $records = $stmt->fetch();
        $totalRecords = $records['allcount'];

        ## Total number of records with filtering
        $stmt = $dbConn->prepare("SELECT COUNT(*) AS allcount FROM productos WHERE 1 ".$searchQuery);
        $stmt->execute($searchArray);
        $records = $stmt->fetch();
        $totalRecordwithFilter = $records['allcount'];

        ## Fetch records
        $stmt = $dbConn->prepare("SELECT * FROM productos WHERE 1 ".$searchQuery." ORDER BY ".$columnName." ".$columnSortOrder." LIMIT :limit,:offset");

        // Bind values
        foreach($searchArray as $key=>$search){
        $stmt->bindValue(':'.$key, $search,PDO::PARAM_STR);
        }

        $stmt->bindValue(':limit', (int)$row, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$rowperpage, PDO::PARAM_INT);
        $stmt->execute();
        $empRecords = $stmt->fetchAll();

        $data = array();

        foreach($empRecords as $row){
        $data[] = array(
            "id_productos"=>$row['id_productos'],
            "nombre"=>$row['nombre'],
            "precio"=>$row['precio'],
            "fabricante"=>$row['fabricante'],
            "marca"=>$row['marca'],
            "modelo"=>$row['modelo'],
            "fecha_carga"=>$row['fecha_carga'],
            "estado"=>$row['estado']
        );
        }

        ## Response
        $response = array(
        "draw" => intval($draw),
        "iTotalRecords" => $totalRecords,
        "iTotalDisplayRecords" => $totalRecordwithFilter,
        "aaData" => $data
        );

        header("HTTP/1.1 200 OK");
        echo json_encode($response);
        exit();

    }else{
        
        $input = $_POST;
        $sql = "INSERT INTO productos
              (nombre, precio, fabricante, marca, modelo, estado, imagen)
              VALUES
              (:nombre, :precio, :fabricante, :marca, :modelo, :estado, :imagen)";
        $statement = $dbConn->prepare($sql);
        bindAllValues($statement, $input);
        $statement->execute();
        $postId = $dbConn->lastInsertId();
        if($postId)
        {
          $input['id'] = $postId;
          header("HTTP/1.1 200 OK");
          echo json_encode($input);
          exit();
         }
    }

}
//Borrar producto
if ($_SERVER['REQUEST_METHOD'] == 'DELETE')
{
	$id = $_GET['id'];
    $statement = $dbConn->prepare("DELETE FROM productos where id_productos=:id");
    $statement->bindValue(':id', $id);
    $statement->execute();
	header("HTTP/1.1 200 OK");
	exit();
}
//Actualizar
if ($_SERVER['REQUEST_METHOD'] == 'PUT')
{
    $input = $_GET;
    $postId = $input['id_productos'];
    $fields = getParams($input);
    $sql = "
          UPDATE productos
          SET $fields
          WHERE id_productos='$postId'
           ";
    $statement = $dbConn->prepare($sql);
    bindAllValues($statement, $input);
    $statement->execute();
    header("HTTP/1.1 200 OK");
    exit();
}
//En caso de que ninguna de las opciones anteriores se haya ejecutado
header("HTTP/1.1 400 Bad Request");
?>