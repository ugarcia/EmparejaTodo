
/* Manda petición al servidor para que establezca la vista de la sesión
	y llama a la función que implementa dicha vista */
function mostrarVistaUser(vista) {
	var myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange = function() {};
	var cadPOST = "tipoPeticion=2";
	cadPOST += "&vistaUserActual="+vista;
	myAjax.send(cadPOST);	
	switch (vista) {
		case 1: definirBaraja();
				break;
		case 2: elegirBaraja();
				break;
		case 3: jugar();
				break;
		case 4: verPuntuaciones();
				break;
		case 5: modificarRegistro();
				break;
	}
}

/* Comprueba que se ha establecdo sesion de usuario como
	jugador. En caso contrario se redirecciona a pagina de login*/
function comprobarUser() {
	interval = setInterval('girarImagenCarga("userContent")',200);
	var myAjax = getMyAjax('userRequests.php');
	
	myAjax.onreadystatechange = function() {
	
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
		  
			clearInterval(interval);
			var respuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"").split(",");
			if (respuesta[0]=='0') {
				document.location.href="../common/login.html";
				return;
			}		
			document.getElementById('headerTd').innerHTML='Empareja Todo - Jugador &nbsp '+respuesta[0];
			document.getElementById('bigContentP').innerHTML='WELCOME &nbsp '+respuesta[0];
			mostrarVistaUser(parseInt(respuesta[1]));
		}	
	}

	var cadPOST = "tipoPeticion=1";
	myAjax.send(cadPOST);	
}

// redimensiona contenido al redimensionar ventana
function doUserResize() {
	resizeHeightToWin("userWinDiv");

	if (document.getElementById('gameFrame'))
		doFrameResize();

}