<?php

	
	if (!empty($_FILES['file']['name'])) {

		$fileName = $_FILES['file']['name'];
		
		$fileExt = explode('.', $fileName);
		$fileActExt = strtolower(end($fileExt));
		$allowImg = array('png','jpeg','jpg');
		$fileNew = rand() . "." . $fileActExt;  // rand function create the rand number 
		$filePath = '../Uploads/'.$fileNew; 

		if (in_array($fileActExt, $allowImg)) {
		    if ($_FILES['file']['size'] > 0  && $_FILES['file']['error']==0) {  
			if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
                    echo json_encode([true,$fileNew]);
			}else{
                echo json_encode([false,"El archivo no se ha cargado inténtelo de nuevo"]);
			}	
		    }else{
                echo json_encode([false,"No se pudo cargar el archivo físico"]);

		    }
		}else{	
            echo json_encode([false,"Este tipo de imagen no está permitido."]);

		}
	}

?>