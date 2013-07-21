
/* Valida datos del formulario y envia petición
	al servidor para actualizar los datos */
function validarModificarUsuario(formModificar) {

	var nombre = formModificar.nombreModificarInput.value;
	if (nombre=="") {
		alert("Se debe introducir el nombre de la persona");
		return false;
	}
	var apellidos = formModificar.apellidosModificarInput.value;
	if (apellidos=="") {
		alert("Se debe introducir los apellidos de la persona");
		return false;
	}
	var edad = parseInt(formModificar.edadModificarInput.value);
	if (isNaN(edad) || edad<5 || edad > 120) {
		alert("Se debe introducir una edad correcta");
		return false;
	}
	var sexo ="";
	if (formModificar.sexoModificarInput[0].checked)
		sexo="h";
	else if (formModificar.sexoModificarInput[1].checked)
		sexo="m";
	var usuario = formModificar.usuarioModificarInput.value;
	if (usuario=="") {
		alert("Se debe introducir un nombre de usuario");
		return false;
	}
	var password = formModificar.passwordModificarInput.value;
	if (password=="" || password.length<6) {
		alert("Se debe introducir un password de al menos 6 caracteres");
		return false;
	}
	var cPassword = formModificar.cPasswordModificarInput.value;
	if (cPassword!=password) {
		alert("Confirmacion de password erronea");
		return false;
	}
	var status = document.getElementById('estadoModificarInput');
	var estado = status.options[status.selectedIndex].value;
	
	interval = setInterval('girarImagenCarga("adminContent")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var aRespuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"").split("|");
				var cadHTML ='';
				switch (parseInt(aRespuesta[0])) {
					case 0: {
						cadHTML = "<p class='titleP'> Usuario modificado con exito: </p><br/>";
						cadHTML += "<form><input type='button' onclick='mostrarVistaAdmin(2)' ";
						cadHTML += " value='Continuar'></form>";
						break;
					}
					case 1:	{
						cadHTML = "<p class='errorP'> Ya existe un usuario con ese nombre </p><br/>";
						cadHTML += "<form><input type='button' onclick='modificarUsuarioData()' ";
						cadHTML += "  value='Volver'></form>";
						break;
					}
					case 2:	{
						cadHTML = "<p class='errorP'> Error al modificar: "+aRespuesta[1]+"</p><br/>";
						cadHTML += "<form><input type='button' onclick='modificarUsuarioData()' ";
						cadHTML += "  value='Volver'></form>";
						break;
					}
				}
			document.getElementById('adminContent').innerHTML = cadHTML;
		}
	};
	var cadPOST = "tipoPeticion=6";
	cadPOST += "&nombre="+nombre;
	cadPOST += "&apellidos="+apellidos;
	cadPOST += "&edad="+edad;
	cadPOST += "&sexo="+sexo;
	cadPOST += "&usuario="+usuario;
	cadPOST += "&password="+password;
	cadPOST += "&estado="+estado;
	myAjax.send(cadPOST);
	return false;
}

// Pide los datos del usuario al servidor y llama a funcion que los muestra
function modificarUsuario(usuario) {

	interval = setInterval('girarImagenCarga("adminContent")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
		 window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var datosUsuario=myAjax.responseText.split(",");
			modificarUsuarioData(datosUsuario);
		}
	};
	var cadPOST = "tipoPeticion=5";
	cadPOST += "&usuario="+usuario;
	myAjax.send(cadPOST);
}

/* Pide al servidor el usuario que estaba pendiente de modificar
	(para acceso por recarga de página) */
function modificarUser() {
	interval = setInterval('girarImagenCarga("adminContent")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
		 window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var userToModify = myAjax.responseText;
			if (userToModify!='') 
				modificarUsuario(userToModify);
			else 
				mostrarVistaAdmin(2);
		}
	};
	var cadPOST = "tipoPeticion=8";
	myAjax.send(cadPOST);
}

// Construye formulario con datos de entrada
function modificarUsuarioData(datosUsuario) {

	var cadHTML = "<p class='titleP'>MODIFICACION DATOS USUARIO</p>";
	cadHTML += "	<form id='formModificar' name='formModificar'";
	cadHTML +=  " 	 method='POST' onsubmit='return validarModificarUsuario(this)'>";
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Nombre: &nbsp &nbsp; &nbsp;";
	cadHTML +=  "			<input type='text' id='nombreModificarInput'";
	cadHTML +=  "			 name='nombreModificarInput' value='"+datosUsuario[0]+"'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Apellidos: &nbsp; &nbsp;";
	cadHTML +=  "			<input type='text' id='apellidosModificarInput'";
	cadHTML +=  "			 name='apellidosModificarInput' value='"+datosUsuario[1]+"'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Edad: &nbsp;";
	cadHTML +=  "			<input type='text' id='edadModificarInput'";
	cadHTML +=  "			 name='edadModificarInput' size='2px' value='"+datosUsuario[2]+"'> &nbsp";
	cadHTML +=  "			<input type='radio' id='sexoModificarInput'";
	cadHTML +=  "			 name='sexoModificarInput' value='h'>Hombre";
	cadHTML +=  "			<input type='radio' id='sexoModificarInput'";
	cadHTML +=  "			 name='sexoModificarInput' value='m'>Mujer";
	cadHTML +=  "		</p>";

	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Usuario: &nbsp; &nbsp &nbsp;";
	cadHTML +=  "			<input type='text' id='usuarioModificarInput'";
	cadHTML +=  "			 name='usuarioModificarInput' value='"+datosUsuario[4]+"'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Password: &nbsp; &nbsp;";
	cadHTML +=  "			<input type='password' id='passwordModificarInput'";
	cadHTML +=  "			 name='passwordModificarInput' value='"+datosUsuario[5]+"'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Conf. pass: &nbsp;";
	cadHTML +=  "			<input type='password' id='cPasswordModificarInput'";
	cadHTML +=  "			 name='cPasswordModificarInput' value='"+datosUsuario[5]+"'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Status: &nbsp; &nbsp; &nbsp;";
	cadHTML +=  "			<select id='estadoModificarInput' name='estadoModificarInput'>";
	cadHTML +=  "				<option value='administrador'>Administrador</option>" 
	cadHTML +=  "				<option value='autorizado'>Usuario</option>" 
	cadHTML +=  "				<option value='denagado'>Denegado</option>" 
	cadHTML +=  "			 </select>";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "			<input type='submit' id='modificarUsuarioSubmit'";
	cadHTML +=  "			 name='modificarUsuarioSubmit' value='Modificar'>";
	cadHTML +=  "	</form>";
	
	document.getElementById('adminContent').innerHTML = "" + cadHTML + "";
	
	var sexData =  (datosUsuario[3]=='h') ? 0 : 1;
	document.formModificar.sexoModificarInput[sexData].click();
	
	var statusData =  (datosUsuario[6]=='administrador') ? 0 : 
						((datosUsuario[6]=='autorizado') ? 1 : 2);
	document.formModificar.estadoModificarInput.options[statusData].selected=true;

}
