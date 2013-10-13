<?php
	session_start();
	
	$mysqlConn = @mysql_connect('localhost','root','')
					or die('No se pudo conectar a mySQL');
	$mysqlDB = @mysql_select_db('emparejatodo')
					or die('No se pudo recuperar la BD');
	
	
	// PETICIONES
	if (isSet($_POST['tipoPeticion'])) {
		switch ($_POST['tipoPeticion']){
		
			// COMPROBACION LOGIN
			case 0: {

				if (!isSet($_SESSION['usuario']) || $_SESSION['status']!='administrador') {
					echo '0';
					break;
				}
				echo $_SESSION['usuario'],",";
				if (isSet($_SESSION['vistaAdminActual'])) 
					echo "{$_SESSION['vistaAdminActual']}";
				else
					echo '99';
				
				break;
			}
		
			// Establecer Vista, por si hay recarga de página
			case 1: {
				$_SESSION['vistaAdminActual']=$_POST['vistaAdminActual'];
				break;
			}
			
			// Registrar usuario en BD, mostar resultado
			case 2: {	
			
				$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
				$result =@mysql_query($query);
				if (!@mysql_num_rows($result)) {
					foreach ($_POST as $key=>$value)
						if ($key!='tipoPeticion')
							$$key = $value;
					$query = "
								insert into usuarios (nombre,apellidos,
								 edad,sexo,usuario,password,estado,
								fechaAutorizado) values
								('$nombre','$apellidos','$edad','$sexo',
								 '$usuario','$password','autorizado',
								 NOW())
							";
					if ($result =@mysql_query($query))
						echo "0";
					else
						echo "2|${query}";
				} else
					echo "1";	
				break;
			}
			
			// Devuelve lista de Usuarios registrados
			case 3: {
				
				$query = "select * from usuarios
							where (estado='administrador' or 
									estado='autorizado' or 
									estado='denegado')";
				if ($_POST['sexo']!='ALL')	
					$query .= " and sexo='{$_POST['sexo']}' ";
				if ($_POST['estado']!='ALL')	
					$query .= " and estado='{$_POST['estado']}' ";
				$query .= " order by {$_POST['orden']} ";
				
				$result =@mysql_query($query);
				$cadRespuesta = '';
				while ($entry=@mysql_fetch_array($result)) {
					$cadRespuesta .= $entry['usuario'].",".$entry['fechaAutorizado'].",";
					$cadRespuesta .= $entry['nombre'].",".$entry['apellidos'].",".$entry['edad']."#";
				}
				echo rtrim($cadRespuesta,"#");			
				break;
			}
			
			// Devuelve detalle de un usuario
			case 4: {	
			
				$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
				$result =@mysql_query($query);
				$cadRespuesta = '';
				if ($entry = @mysql_fetch_array($result)) {
					$cadRespuesta .= "0|";
					foreach ($entry as $key=>$value)
						if ($key!='tipoPeticion' && !is_numeric($key))
							$cadRespuesta .= "${key}=${value},";
				} else {
					$cadRespuesta .= '1';
				}
				echo rtrim($cadRespuesta,",");
				break;
			}
			
			// Devuelve datos usuario para formulario de modificacion
			case 5: {

				$_SESSION['vistaAdminActual']=3;
				$_SESSION['usuarioModificar']=$_POST['usuario'];
				$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
				$result =@mysql_query($query);
				if ($entry = @mysql_fetch_array($result)) {
					echo "{$entry['nombre']},{$entry['apellidos']},{$entry['edad']},{$entry['sexo']},";
					echo "{$entry['usuario']},{$entry['password']},{$entry['estado']}";
				}
				break;
			}
			
			// Modifica datos de usuario en BD
			case 6: {
				
				$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
				$result =@mysql_query($query);
				if (@mysql_num_rows($result) && $_POST['usuario']!=$_SESSION['usuarioModificar']) {
					echo "1";	
					break;		
				}
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion')
						$$key = $value;
				$query = "
							update usuarios set
							 nombre = '$nombre',
							 apellidos = '$apellidos',
							 edad = '$edad',
							 sexo = '$sexo',
							 usuario = '$usuario',
							 password = '$password',
							 estado = '$estado' 
							 where usuario='{$_SESSION['usuarioModificar']}'
						";
				if ($result =@mysql_query($query)) {
					echo "0";
					$_SESSION['vistaAdminActual']=2;
					unset($_SESSION['usuarioModificar']);
					
				} else {
					echo "2|${query}";	
				}
				break;
			}
			
			// Elimina Usuario de la BD, muestra resultado
			case 7: {
				
				$query = " delete from usuarios where ";
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion')
						$query .= " usuario='".$value."' or";
				$query = rtrim($query,"or");
				if (!$result =@mysql_query($query)) 
					echo "<p class='errorP'> Error al intentar borrar el/los registro(s) </p>";
				else
					echo "Successful";
				break;
			}
			
			// Devuelve el Usuario que se estaba modificando antes de recargar
			case 8: {
				
				if (isSet($_SESSION['usuarioModificar']))
					echo $_SESSION['usuarioModificar'];

				break;
			}
			
			// Devuelve lista de Peticiones 
			case 9: {
				
				$query = "select * from usuarios
							where estado='solicitado' ";
				$query .= " order by {$_POST['orden']} ";
				
				$result =@mysql_query($query);
				$cadRespuesta = '';
				while ($entry=@mysql_fetch_array($result)) {
					$cadRespuesta .= $entry['usuario'].",".$entry['fechaSolicitado'].",";
					$cadRespuesta .= $entry['nombre'].",".$entry['apellidos'].",".$entry['edad']."#";
				}
				echo rtrim($cadRespuesta,"#");			
				break;
			}
			
			// Autoriza y Deniega Solicitudes
			case 10: {	
				
				if ($_POST['autorizados']!='') {
					$autorizados = explode(",",$_POST['autorizados']);
					$query = " update usuarios set estado='autorizado' 
								, fechaAutorizado=NOW() where ";
					foreach ($autorizados as $key=>$value)
						$query .= " usuario='${value}' or";
					$query = rtrim($query,"or");
					if (!$result =@mysql_query($query))
						echo '1';
					else
						echo '0';
				} else
					echo '2';
				if ($_POST['denegados']!='') {
					$denegados = explode(",",$_POST['denegados']);
					$query = " update usuarios set estado='denegado' where ";
					foreach ($denegados as $key=>$value)
						$query .= " usuario='${value}' or";
					if (!$result =@mysql_query(rtrim($query,"or")))
						echo '1';
					else
						echo '0';
				} else
					echo '2';
					
				break;
			}
			
		}
	} else {
		echo "Error en la peticion";
	}

	@mysql_free_result($result);
	mysql_close($mysqlConn);
?>
