

/* Manda petición al servidor para que establezca la vista de la sesión
	y llama a la función que implementa dicha vista */
function mostrarVistaAdmin(numVista) {
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange = function() {};
	var cadPOST = "tipoPeticion=1";
	cadPOST += "&vistaAdminActual="+numVista;
	myAjax.send(cadPOST);
	switch (numVista) {
		case 1: altaUsuario();
				break;
		case 2: usuariosRegistrados();
				break;
		case 3: modificarUser();
				break;
		case 4: solicitudesAlta();
				break;
	}
}

/* Comprueba que se ha establecdo sesion de usuario como
	administrador. En caso contrario se redirecciona a pagina de login*/
function comprobarAdmin() {
	interval = setInterval('girarImagenCarga("adminContent")',200);
	var myAjax = getMyAjax('adminRequests.php');
	
	myAjax.onreadystatechange = function() {
	
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
		  
			clearInterval(interval);
			var respuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"").split(",");
			if (respuesta=='0') {
				document.location.href="../common/login.html";
				return;
			}		
			document.getElementById('headerTd').innerHTML='Empareja Todo - Administrador &nbsp '+respuesta[0];
			document.getElementById('bigContentP').innerHTML='WELCOME &nbsp '+respuesta[0];
			mostrarVistaAdmin(parseInt(respuesta[1]));
		}	
	}

	var cadPOST = "tipoPeticion=0";
	myAjax.send(cadPOST);	
}

// redimensiona contenido al redimensionar ventana
function doAdminResize() {
	resizeHeightToWin("adminWinDiv");
}