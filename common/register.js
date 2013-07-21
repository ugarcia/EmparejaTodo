
/* Valida datos de registro, realiza petición al servidor y 
	muestra el error o exito de la operacion */
function validarRegister() {
	
	var form = document.getElementById('registerForm');
	var resultDiv = document.getElementById('eventosRegister');
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
	if (sexo!="h" && sexo!="m") {
		cadHTML = "<p class='errorP'>Se debe indicar el sexo de la persona</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var usuario = form.usuarioInput.value;
	if (usuario=="") {
		cadHTML = "<p class='errorP'>Se debe introducir un nombre de usuario</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var password = form.passwordInput.value;
	if (password=="" || password.length<6) {
		cadHTML = "<p class='errorP'>Se debe introducir un password de al menos 6 caracteres</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	var cPassword = form.cPasswordInput.value;
	if (cPassword!=password) {
		cadHTML = "<p class='errorP'>Confirmacion de password erronea</p>";
		resultDiv.innerHTML=cadHTML;
		return false;
	}
	
	interval = setInterval('girarImagenCarga("eventosRegister")',200);
	myAjax = getMyAjax('commonRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var signResult = myAjax.responseText.replace(/^\s+|\s+$/g,"");
			cadHTML='';
			switch (parseInt(signResult)) {
				case 0: {
					document.getElementById('registerSubmit').style.visibility='hidden';
					cadHTML = "<p><b>Peticion de registro realizada</b></p>";
					cadHTML += "<p>Deberá esperar a ser autorizado para poder entrar al sitio</p>";
					cadHTML += "<input type='button' value='Continuar' ";
					cadHTML += " onClick='Javascript:document.location.href="+'"'+"login.html"+'"'+"'>";
					break;
				}
				case 1: {
					cadHTML = "<p class='errorP'>Error: ";
					cadHTML += "Usuario ya existente, elija otro</p>";
					break;
				}
				case 2: {
					cadHTML = "<p class='errorP'>Error: ";
					cadHTML += "No se pudo registrar la peticion</p>";
					break;
				}
			}
			resultDiv.innerHTML=cadHTML;
		}
	}
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

