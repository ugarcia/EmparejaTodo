
/* Valida el formulario de alta y envia petición a servidor
	para insertar el nuevo usuario */
function validarAltaUsuario(formAlta) {

	var eventPanel = document.getElementById('eventDiv');

	var nombre = formAlta.nombreAltaInput.value;
	if (nombre=="") {
		eventPanel.innerHTML="<p class='errorP'>Se debe introducir el nombre de la persona</p>";
		return false;
	}
	var apellidos = formAlta.apellidosAltaInput.value;
	if (apellidos=="") {
		eventPanel.innerHTML="<p class='errorP'>Se debe introducir los apellidos de la persona</p>";
		return false;
	}
	var edad = parseInt(formAlta.edadAltaInput.value);
	if (isNaN(edad) || edad<5 || edad > 120) {
		eventPanel.innerHTML="<p class='errorP'>Se debe introducir una edad correcta</p>";
		return false;
	}
	var sexo ="";
	if (formAlta.sexoAltaInput[0].checked)
		sexo="h";
	else if (formAlta.sexoAltaInput[1].checked)
		sexo="m";
	if (sexo!="h" && sexo!="m") {
		eventPanel.innerHTML="<p class='errorP'>Se debe indicar el sexo de la persona</p>";
		return false;
	}
	var usuario = formAlta.usuarioAltaInput.value;
	if (usuario=="") {
		eventPanel.innerHTML="<p class='errorP'>Se debe introducir un nombre de usuario</p>";
		return false;
	}
	var password = formAlta.passwordAltaInput.value;
	if (password=="" || password.length<6) {
		eventPanel.innerHTML="<p class='errorP'>Se debe introducir un password de al menos 6 caracteres</p>";
		return false;
	}
	var cPassword = formAlta.cPasswordAltaInput.value;
	if (cPassword!=password) {
		eventPanel.innerHTML="<p class='errorP'>Confirmacion de password erronea</p>";
		return false;
	}
	
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
					cadHTML = "<p class='titleP'> Usuario dado de alta con exito: </p><br/>";
					break;
				}
				case 1:	{
					cadHTML = "<p class='errorP'> Ya existe un usuario con ese nombre </p><br/>";
					break;
				}
				case 2:	{
					cadHTML = "<p class='errorP'> Error al dar de alta: "+aRespuesta[1]+"</p><br/>";
					break;
				}
			}
			eventPanel.innerHTML = cadHTML;

		}
	};
	var cadPOST = "tipoPeticion=2";
	cadPOST += "&nombre="+nombre;
	cadPOST += "&apellidos="+apellidos;
	cadPOST += "&edad="+edad;
	cadPOST += "&sexo="+sexo;
	cadPOST += "&usuario="+usuario;
	cadPOST += "&password="+password;
	myAjax.send(cadPOST);
	return false;
}

// Muestra e formulario de Alta
function altaUsuario() {

	var cadHTML = "<p class='titleP'>ALTA DE NUEVO USUARIO</p>";
	cadHTML += "	<form id='altaUsuarioForm' name='altaUsuarioForm'";
	cadHTML +=  " 	 method='POST' onsubmit='return validarAltaUsuario(this)'>";
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Nombre: &nbsp &nbsp; &nbsp;";
	cadHTML +=  "			<input type='text' id='nombreAltaInput'";
	cadHTML +=  "			 name='nombreAltaInput'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Apellidos: &nbsp; &nbsp;";
	cadHTML +=  "			<input type='text' id='apellidosAltaInput'";
	cadHTML +=  "			 name='apellidosAltaInput'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Edad: &nbsp;";
	cadHTML +=  "			<input type='text' id='edadAltaInput'";
	cadHTML +=  "			 name='edadAltaInput' size='2px'> &nbsp";
	cadHTML +=  "			<input type='radio' id='sexoAltaInput'";
	cadHTML +=  "			 name='sexoAltaInput' value='h'>Hombre";
	cadHTML +=  "			<input type='radio' id='sexoAltaInput'";
	cadHTML +=  "			 name='sexoAltaInput' value='m'>Mujer";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Usuario: &nbsp; &nbsp &nbsp;";
	cadHTML +=  "			<input type='text' id='usuarioAltaInput'";
	cadHTML +=  "			 name='usuarioAltaInput'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Password: &nbsp; &nbsp;";
	cadHTML +=  "			<input type='password' id='passwordAltaInput'";
	cadHTML +=  "			 name='passwordAltaInput'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "		<p class='lineaForm'>";
	cadHTML +=  "			Conf. pass: &nbsp;";
	cadHTML +=  "			<input type='password' id='cPasswordAltaInput'";
	cadHTML +=  "			 name='cPasswordAltaInput'> &nbsp; &nbsp;";
	cadHTML +=  "		</p>";
	
	cadHTML +=  "			<input type='submit' id='altaUsuarioSubmit'";
	cadHTML +=  "			 name='altaUsuarioSubmit' value='Registrar'>";
	cadHTML +=  "	</form><br/>";
	cadHTML +=  "	<div id='eventDiv' name='eventDiv'></div>";
	
	document.getElementById('adminContent').innerHTML = "" + cadHTML + "";
	
}