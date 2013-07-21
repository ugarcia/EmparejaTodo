<?php
	session_start();
	
	$mysqlConn = @mysql_connect('localhost','ac3jyz8c_root','')
					or die('No se pudo conectar a mySQL');
	$mysqlDB = @mysql_select_db('ac3jyz8c_emparejatodo')
					or die('No se pudo recuperar la BD');
	
	if (isSet($_POST['tipoPeticion'])) {
		switch ($_POST['tipoPeticion']){
			
			
			// PETICION LOGIN
			case 1: {
			
				$query = " select * from usuarios 
							where usuario='{$_POST['usuario']}' 
							&& password='{$_POST['password']}' ";
				$result =@mysql_query($query);
				if (!($entry=@mysql_fetch_array($result))) {
					echo '1';
					break;
				}
				if ($entry['estado']=='autorizado') {
					$_SESSION['usuario']=$_POST['usuario'];
					$_SESSION['idUsuario']=$entry['idUsuario'];
					$_SESSION['status']='autorizado';
					echo '2';	
				}
				else if ($entry['estado']=='administrador'){
					$_SESSION['usuario']=$_POST['usuario'];
					$_SESSION['idUsuario']=$entry['idUsuario'];
					$_SESSION['status']='administrador';
					echo '3';	
				}
				else
					echo '4';
				break;
			}
			
			// PETICION REGISTER
			case 2: {	
				
				$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
				$result =@mysql_query($query);
				if (@mysql_num_rows($result)) {
					echo '1';
					break;	
				}
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion')
						$$key = $value;
				$query = "
							insert into usuarios (nombre,apellidos,
							 edad,sexo,usuario,password,estado,
							fechaSolicitado) values
							('$nombre','$apellidos','$edad','$sexo',
							 '$usuario','$password','solicitado',
							 NOW())
						";
				if ($result =@mysql_query($query))
					echo '0';
				else
					echo '2';
					
				break;
			}
		}
	} else {
		echo '0';	
	}

	@mysql_free_result($result);
	@mysql_close($mysqlConn);
?>
