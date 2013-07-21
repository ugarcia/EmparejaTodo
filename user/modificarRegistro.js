
/* Valida el formulario de modificacion y envia petición a servidor
	para modificar el usuario */
function validarFormUsuario(form) {

	var resultDiv = document.getElementById('modifyResultDiv');
	var nombre = form.nombreInput.value;
	var cadHTML = '';
	if (nombre=="") {
		cadHTML = "<p class='errorP'>Se debe introducir el nombre de la persona</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var apellidos = form.apellidosInput.value;
	if (apellidos=="") {
		cadHTML = "<p class='errorP'>Se debe introducir los apellidos de la persona</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var edad = parseInt(form.edadInput.value);
	if (isNaN(edad) || edad<5 || edad > 120) {
		cadHTML = "<p class='errorP'>Se debe introducir una edad correcta</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var sexo ="";
	if (form.sexoInput[0].checked)
		sexo="h";
	else if (form.sexoInput[1].checked)
		sexo="m";
	
	var cadAlert=' ATENCION: \n';
	var usuario = form.usuarioInput.value;
	if (usuario!="") 
		cadAlert += ("Va a cambiar el nombre de usuario \n");

	var password = form.passwordInput.value;
	if (password!="") {
		if (password.length<6) {
			cadHTML = "<p class='errorP'>Se debe introducir un ";
			cadHTML += "password de al menos 6 caracteres</p>";
			resultDiv.innerHTML=cadHTML;
			return false;
		}
		var cPassword = form.cPasswordInput.value;
		if (cPassword!=password) {
			cadHTML = "<p class='errorP'>Confirmacion de password erronea</p>";
			resultDiv.innerHTML=cadHTML;
			return false;
		}
		cadAlert += ("Va a cambiar el Password \n");
	}
	if (usuario!="" || password!="") {
		cadAlert += ("Pulse OK para proceder");
		if (!confirm(cadAlert))
			return;
	}
	
	interval = setInterval('girarImagenCarga("modifyResultDiv")',200);
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var modifyResult = myAjax.responseText.replace(/^\s+|\s+$/g,"");
			cadHTML='';
			switch (parseInt(modifyResult)) {
				case 0: {
					cadHTML = "<p><b>Datos modificados con exito</b></p>";
					setTimeout('modificarRegistro()',1500);
					break;
				}
				case 1: {
					cadHTML = "<p class='errorP'>Error: ";
					cadHTML += "Usuario ya existe</p>";
					break;
				}
				case 2: {
					cadHTML = "<p class='errorP'>Error: ";
					cadHTML += "No se pudieron modificar los datos</p>";
					break;
				}
			}
			resultDiv.innerHTML=cadHTML;
		}
	}
	var cadPOST = "tipoPeticion=14";
	cadPOST += "&nombre="+nombre;
	cadPOST += "&apellidos="+apellidos;
	cadPOST += "&edad="+edad;
	cadPOST += "&sexo="+sexo;
	if (usuario!="") 
		cadPOST += "&usuario="+usuario;
	if (password!="")
		cadPOST += "&password="+password;
	myAjax.send(cadPOST);
	return false;
}

// Muestra e formulario de Modificacion con los datos de entrada
function modificarRegistroForm(data) {

	var aData = data.split(",");
	
	var cadHTML = "	<p class='titleP'>MODIFICAR DATOS DE USUARIO</p>";
	cadHTML +=  "	<center><form id='userDataForm' name='userDataForm' method='POST' ";
	cadHTML +=  " 	 onsubmit='return validarFormUsuario(this)'>";
	cadHTML +=  "	<table class='modifyRegistryTable'>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Usuario:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left modifyRegistryDchaTd'>";
	cadHTML +=  "			"+aData[5];
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Fecha Autorizado:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left modifyRegistryDchaTd'>";
	cadHTML +=  "			"+aData[4];
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Nombre:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left'>";
	cadHTML +=  "				<input type='text' id='nombreInput'";
	cadHTML +=  "			 	 name='nombreInput' value="+aData[0]+">";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Apellidos:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left'>";
	cadHTML +=  "				<input type='text' id='apellidosInput'";
	cadHTML +=  "				 name='apellidosInput' value="+aData[1]+">";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	

	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Edad:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left'>";
	cadHTML +=  "				<input type='text' id='edadInput'";
	cadHTML +=  "				 name='edadInput' size='2px' value="+aData[2]+">";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Sexo:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left modifyRegistryDchaTd'>";
	cadHTML +=  "				<input type='radio' id='sexoInput'";
	cadHTML +=  "				 name='sexoInput' value='h' ";
	if (aData[3]=='h')
		cadHTML += " 			 checked ='checked'";
	cadHTML += "				 >Hombre";
	cadHTML +=  "				<input type='radio' id='sexoInput'";
	cadHTML +=  "				 name='sexoInput' value='m' ";
	if (aData[3]=='m')
		cadHTML += " 			 checked='checked' ";
	cadHTML += "				 >Mujer";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Nuevo Usuario:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left'>";
	cadHTML +=  "				<input type='text' id='usuarioInput'";
	cadHTML +=  "				 name='usuarioInput'>";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Nuevo Password:";
	cadHTML +=  "			</td class='left'>";
	cadHTML +=  "			<td>";
	cadHTML +=  "				<input type='password' id='passwordInput'";
	cadHTML +=  "				 name='passwordInput'>";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	
	cadHTML +=  "		<tr>";
	cadHTML +=  "			<td class='left modifyRegistryIzdaTd'>";
	cadHTML +=  "				Confirm password:";
	cadHTML +=  "			</td>";
	cadHTML +=  "			<td class='left'>";
	cadHTML +=  "				<input type='password' id='cPasswordInput'";
	cadHTML +=  "				 name='cPasswordInput'>";
	cadHTML +=  "			</td>";
	cadHTML +=  "		</tr>";
	cadHTML +=  "	</table><br/>";
	
	cadHTML +=  "			<input type='submit' id='modificarUsuarioSubmit'";
	cadHTML +=  "			 name='modificarUsuarioSubmit' value='Modificar'>";
	cadHTML +=  "	</form></center><br/>";
	
	cadHTML +=  "	<div id='modifyResultDiv' name ='modifyResultDiv'></div>";
	
	document.getElementById('userContent').innerHTML = "" + cadHTML + "";
}

/* Pide los datos del usuario al servidor y llama a funcion
	que los construye el formulario con ellos */
function modificarRegistro() {
	
	interval = setInterval('girarImagenCarga("userContent")',200);
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='0') {
				var cadHTML = "<p class=errorP><b>Error al recuperar los datos</b></p>";
				document.getElementById('userContent').innerHTML=cadHTML;
			} else 
				modificarRegistroForm(myAjax.responseText.replace(/^\s+|\s+$/g,""));
		}	
	};
	var cadPOST = "tipoPeticion=13";
	myAjax.send(cadPOST);
	
}


