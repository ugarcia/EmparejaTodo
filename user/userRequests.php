<?php
	session_start();
		
	$mysqlConn = @mysql_connect('localhost','ac3jyz8c_root','')
					or die('No se pudo conectar a mySQL');
	$mysqlDB = @mysql_select_db('ac3jyz8c_emparejatodo')
					or die('No se pudo recuperar la BD');
	
	// Guardar cartas subidas por usuario y actualizar BD
	if (isSet($_FILES['fileInput']) || isSet($_FILES['fileInputRev'])) {
		
		if (isSet($_FILES['fileInput'])) {

			echo "<center>";
			$count=0;
			foreach ($_FILES['fileInput']['name'] as $key=>$fileName) {
				$fileTemp=$_FILES['fileInput']['tmp_name'][$key];
				$auxName = explode('.',$fileName);
				$extName = $auxName[count($auxName)-1];
				$query ="insert into cartas (idUsuario,extCarta)
					values ('{$_SESSION['idUsuario']}','${extName}')";
				if (!($result =@mysql_query($query)))
					echo "<p class='errorP'>No se pudo guardar en DB: ${fileName}</p>";
				else {
					$query ="select MAX(idCarta) from cartas";
					$result =@mysql_query($query);
					$entry = @mysql_fetch_array($result);
					$newFileName = "img_".$entry[0];
					$fileDir = "../cards/".$newFileName.".".$extName;
					if (!move_uploaded_file($fileTemp, $fileDir)) {
						$query ="delete from cartas where idCarta={$entry[0]}";
						$result =@mysql_query($query);
						echo "<p class='errorP'>No se pudo subir: ${fileName}</p>";
					} else {
						$count++;
					}
				}	
			}	
			echo "<b>Subida de Cartas completada: {$count} ";
			echo " items</b>&nbsp;&nbsp;";
			echo "</center>";
			unset($_FILES['fileInput']);
		}
		
				
		
	} else if (isSet($_POST['tipoPeticion'])) {
		switch ($_POST['tipoPeticion']){
		
		
			// COMPROBACION LOGIN
			case 1: {
				
				if (!isSet($_SESSION['usuario']) || $_SESSION['status']!='autorizado') {
					echo '0';
					break;
				}
				echo $_SESSION['usuario'],",";
				if (isSet($_SESSION['vistaUserActual'])) 
					echo "{$_SESSION['vistaUserActual']}";
				else
					echo '99';
				
				break;
			}
			
			// ESTABLECER VISTA (por si se recarga la pagina)
			case 2: {	
				$_SESSION['vistaUserActual']=$_POST['vistaUserActual'];
				break;
			}
			
			
			// Mostrar cartas ya subidas por usuario
			case 3: {
					$query = "select idCarta,extCarta from cartas 
								where idUsuario='{$_SESSION['idUsuario']}'";
					$result = @mysql_query($query);
					while ($entry = @mysql_fetch_array($result)) {
						$nameCarta = "img_".$entry['idCarta'];
						$b=0;
						foreach ($_POST as $key=>$value)
							if ($nameCarta==$value)
								$b =1;
						echo "
								<img id='{$nameCarta}' name='{$nameCarta}' 
								 src='../cards/".$nameCarta.".".$entry['extCarta']."' 
								 onclick='seleccionarCarta(this)'  class='mediumSize
							";		
						
						if ($b)
							echo " desactivado ";
						echo "'>";
					}
					
				break;
			}
			
			// Definir Baraja
			case 4: {	
				$query = "select * from barajas
							where idUsuario='{$_SESSION['idUsuario']}'
								&& nombre='{$_POST['nombreBaraja']}'";
				$result = @mysql_query($query);
				if (@mysql_num_rows($result)) {
					echo "<p class='errorP'>Ya existe una baraja con ese nombre</p>";
					break;
				}

				$query = " insert into barajas (nombre,numCartas,idUsuario) 
							values ('{$_POST['nombreBaraja']}','{$_POST['numCartas']}'
								,'{$_SESSION['idUsuario']}')";			
		
				if (!$result = @mysql_query($query)) {
					echo "<p class='errorP'>No se pudo definir .....</p>";
					break;
				}
				
				$query = "select idBaraja from barajas
							where idUsuario='{$_SESSION['idUsuario']}' 
							&& nombre='{$_POST['nombreBaraja']}'";
				$result = @mysql_query($query);
				$entry = @mysql_fetch_array($result);
				
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion' && $key!='reverso' 
						&& $key!='nombreBaraja' && $key!='numCartas') {
						$aNameCard = explode("_",$value);
						$idCarta = $aNameCard[1];
						$query = " insert into relCartasBarajas (idCarta,idBaraja,rolCarta) 
							values ('{$idCarta}','{$entry[0]}','descubierta')";
						if (!$result = @mysql_query($query))
							echo "<p class='errorP'>Error SQL: &nbsp;".$query."</p>";
					}
				$aNameCard = explode("_",$_POST['reverso']);
				$idCarta = $aNameCard[1];
				$query = " insert into relCartasBarajas (idCarta,idBaraja,rolCarta) 
						values ('{$idCarta}','{$entry[0]}','reverso')";
				if (!$result = @mysql_query($query))
					echo "<p class='errorP'>Error SQL: &nbsp;".$query."</p>";
				echo "Baraja Definida";
				
				break;
			}
			
			// Devolver datos barajas de usuario
			case 5: {
			
				$query = "select nombre,numCartas from barajas
							where idUsuario='{$_SESSION['idUsuario']}'
								&& numCartas >= {$_POST['minCartas']} ";
				if ($_POST['maxCartas']!=0)
					$query .="		&& numCartas <= {$_POST['maxCartas']} ";
				$query .="	order by {$_POST['orden']} ";
				$result =@mysql_query($query);
				$cadRespuesta = "";
				while ($entry=@mysql_fetch_array($result))
					$cadRespuesta .= $entry['nombre'].",".$entry['numCartas']."#";
				$cadRespuesta = rtrim($cadRespuesta,"#");
				$query = "select barajaDefecto from usuarios
							where usuario='{$_SESSION['usuario']}'";
				$result =@mysql_query($query);	
				$bDefecto = @mysql_fetch_array($result);
				if ($bDefecto!='')
					$cadRespuesta .= "@".$bDefecto[0];
				else
					$cadRespuesta .= "@-default-";
				echo $cadRespuesta;
				break;
			}
			
			// Devolver cartas de baraja
			case 6: {
				
				$query = "select A.idCarta,B.extCarta from 
							(select * from relCartasBarajas
							where idBaraja in (
									select idBaraja from barajas
										where idUsuario='{$_SESSION['idUsuario']}'
										 && nombre='{$_POST['nombre']}')) as A
							 join cartas as B on A.idCArta=B.idCarta 
							  order by A.rolCarta desc 
						";
				if (!$result = @mysql_query($query)) {
					echo "Error: ".$query;
					break;
				}
				$cadRespuesta = "";
				while ($entry=@mysql_fetch_array($result))
					$cadRespuesta .= $entry['idCarta'].",".$entry['extCarta']."#";
				echo rtrim($cadRespuesta,"#");

				break;
			}
			
			// Borrar barajas
			case 7: {
			
				$query = "delete from barajas where idUsuario='{$_SESSION['idUsuario']}' and (";
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion') {
						$query .= " nombre='".$value."' or";
						
						$innerQuery = "select idBaraja from barajas where nombre='{$value}'";
						if (!$result = @mysql_query($innerQuery))
							echo 'Failed:'.$innerQuery."\n";
						$entry = @mysql_fetch_array($result);
						
						$innerQuery = "delete from relCartasBarajas where idBaraja='{$entry[0]}'";
						if (!$result =@mysql_query($innerQuery)) 
							echo 'Failed:'.$innerQuery."\n";
					}
				$query = rtrim($query,"or") . ")";
				if (!$result =@mysql_query($query)) {
					echo 'Failed:'.$query;
					break;	
				}
				echo 'Succesfull';
				break;	
			}
			
			// Seleccionar baraja por defecto
			case 8: {
				$query = "update usuarios set barajaDefecto='{$_POST['default']}' 
							 where idUsuario='{$_SESSION['idUsuario']}'";
				if ($result =@mysql_query($query))
					echo 'Baraja por defecto cambiada';
				else
					echo 'Fallo al intentar cambiar baraja por defecto';
				break;	
			}
			
			// Guardar partida
			case 9: {
				$query = "
							insert into resultados 
							 (idUsuario,fecha,baraja,numImages,numCartas,numFilas,
							  tiempoMax,endTime,finExito,score,turns) 
							values ('{$_SESSION['idUsuario']}',NOW(),
									'{$_POST['baraja']}','{$_POST['numImages']}',
									'{$_POST['numCartas']}','{$_POST['numFilas']}',
									'{$_POST['tiempoMax']}','{$_POST['endTime']}',
									'{$_POST['finExito']}','{$_POST['score']}',
									'{$_POST['turns']}')
						";
				if (!$result=@mysql_query($query))
					echo $query;
				else
					echo 'OK';
				break;
			}
			
			// Devolver puntuaciones de usuario
			case 10: {
			
				$query = " select fecha,score,numCartas,numImages from resultados 
							where idUsuario='{$_SESSION['idUsuario']}' 
								&& numImages >= {$_POST['minImages']} ";
				if ($_POST['maxImages']!=0)
					$query .="		&& numImages <= {$_POST['maxImages']} ";
				$query .="	order by {$_POST['orden']} ";
				$result =@mysql_query($query);
				$cadRespuesta = "";
				while ($entry=@mysql_fetch_array($result))
					$cadRespuesta .= $entry[0].",".$entry[1].","
									.$entry[2].",".$entry[3]."#";
				echo rtrim($cadRespuesta,"#");
				break;
			}
			
			// Devolver detalles de puntuacion
			case 11: {
				
				$query = " select endTime,tiempoMax,turns,finExito,
							numFilas,baraja from resultados 
							where idUsuario='{$_SESSION['idUsuario']}' 
								&& fecha = '{$_POST['fecha']}' ";
				$result =@mysql_query($query);
				$cadRespuesta = "";
				if ($entry=@mysql_fetch_array($result))
					$cadRespuesta .= $entry[0].",".$entry[1].",".$entry[2].","
									.$entry[3].",".$entry[4].",".$entry[5];
				echo $cadRespuesta;
				break;
			}
			
			// Borrar puntuaciones
			case 12: {
			
				$query = "delete from resultados 
							 where idUsuario='{$_SESSION['idUsuario']}' 
							 and (";
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion')
						$query .= " fecha='".$value."' or";
				$query = rtrim($query,"or") . ")";
				if (!$result =@mysql_query($query)) {
					echo 'Failed:'.$query;
					break;	
				}
				echo 'Succesfull';
				break;	
			}
			
			// Devolver datos del usuario
			case 13: {	
			
				$query = " select * from usuarios where idUsuario='{$_SESSION['idUsuario']}'";
				$result =@mysql_query($query);
				if ($entry = @mysql_fetch_array($result)) {
					echo "{$entry['nombre']},{$entry['apellidos']},{$entry['edad']}";
					echo ",{$entry['sexo']},{$entry['fechaAutorizado']},{$_SESSION['usuario']}";
				} else 
					echo '0';

				break;
			}
			
			// Modificar datos de registro de usuario
			case 14: {	
				
				if (isSet($_POST['usuario'])) {
					$query = " select * from usuarios where usuario='{$_POST['usuario']}'";
					$result =@mysql_query($query);
					if (@mysql_num_rows($result)) {
						echo '1';
						break;
					} else
						$_SESSION['usuario']=$_POST['usuario'];
				}					
				$query = "update usuarios set ";
				foreach ($_POST as $key=>$value)
					if ($key!='tipoPeticion')
						$query .= "${key}='${value}',";
				$query = rtrim($query,",");		
				$query .= " where idUsuario={$_SESSION['idUsuario']}";
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

