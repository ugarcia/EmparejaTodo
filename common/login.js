

/* Valida datos de login, realiza petición al servidor y 
	muestra el error o redirecciona a la pagina correspondiente */
function validarLogin() {

	var myForm = document.getElementById('loginForm');
	var myEvent = document.getElementById('eventosLogin');
	var usuario = myForm.loginInput.value;
	if (usuario=="") {
		myEvent.innerHTML="<p class='errorP'>Se debe introducir un nombre de usuario</p>";				
		return false;
	}
	var password = myForm.passwordInput.value;
	interval = setInterval('girarImagenCarga("eventosLogin")',200);
	var myAjax = getMyAjax('commonRequests.php');
	
	myAjax.onreadystatechange = function() {
	
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
		  
			clearInterval(interval);
			
			var respuesta = parseInt(myAjax.responseText);
			switch (respuesta) {
				case 0: {
					myEvent.innerHTML="<p class='errorP'>Error en la peticion</p>";
					break;
				}
				case 1: {
					myEvent.innerHTML="<p class='errorP'>Error de Autenticacion</p>";
					break;
				}
				case 2: {
					document.location.href='../user/userIndex.html';
					break;
				}
				case 3: {
					document.location.href='../admin/adminIndex.html';
					break;
				}
				case 4: {
					myEvent.innerHTML="<p class='errorP'>Usuario pendiente de Autorizacion</p>";
					break;
				}
			}
		}	 
	};
	
	var cadPOST = "tipoPeticion=1";
	cadPOST += "&usuario="+usuario;
	cadPOST += "&password="+password;
	myAjax.send(cadPOST);
	
	return false;
}
