
// VARIABLES GLOBALES

var ordenSolicitudes = new Array('fechaSolicitado','asc');
var aInterval = new Array();
var aNombresSolicitudes = new Array();
var autorizados = new Array();
var denegados = new Array();


// actualiza orden y recarga vista
function updateOrdenSolicitudes(campo) {
	ordenSolicitudes[0] = campo;
	ordenSolicitudes[1] = (ordenSolicitudes[1])=='asc' ? 'desc' : 'asc';
	solicitudesAlta();
}

//Muestra detalles de una solicitud según datos de entrada
function mostrarSolicitud(usuario,data,capa) {
	var aData = data.split(",");
	var cadHTML = "	<form>";
	cadHTML += "	<table>";
	cadHTML += "		<tr>";
	cadHTML += "			<td class='userInfoTd'>";
	for (var i=0; i< aData.length ; i++) {
		var aValues = aData[i].split("=");
		cadHTML += "<b>"+aValues[0]+"</b> : "+aValues[1]+"<br/>";
	}
	cadHTML += "		</td>";
	cadHTML += "	</tr>";
	cadHTML += "</table>";
	cadHTML += "</form>";
	
	document.getElementById(capa).innerHTML = cadHTML;

}

/* envia petición al servidor para recuperar los datos
	del usuario para desplegar su detalle de la lista */
function desplegarSolicitud(usuario,control) {
	// Desplegar fila oculta con imagen en movimiento (espera)
	var filaCapa = document.getElementById('filaDetalle'+control);
	capa = 'detalle'+control;
	var selImg = document.getElementById('imagenDesplegar'+control);
	if (filaCapa.style.display=='none') {
	
		selImg.src="../img/minusImg.jpg";
		filaCapa.style.display = (IE) ? 'block' : 'table-row';
		aInterval[control] = setInterval('girarImagenCarga(capa)',100);
		
		// Petición resto de detalles al servidor
		var myAjax = getMyAjax('adminRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
			  window.location.href.indexOf("http")==-1)) {
				clearInterval(aInterval[control]);
				var aRespuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"").split("|");
				switch (parseInt(aRespuesta[0])) {
					case 0: mostrarSolicitud(usuario,aRespuesta[1],capa);
							break;
					case 1:	var cadHTML = "<p class = errorP>Error al recuperar datos</p>";
							document.getElementById(capa).innerHTML = cadHTML;
							break;
				}
			}
		};
		var cadPOST = "tipoPeticion=4";
		cadPOST += "&usuario="+usuario;
		myAjax.send(cadPOST);
		
	} else {
		selImg.src="../img/plusImg.jpg";
		filaCapa.style.display ='none';
	}
}

// actualiza var. globales al seleccionar una accion sobre una solicitud
function accionSolicitud (value,control) {
	autorizados[control] = value ? 0 : 1;
	denegados[control] = value;
}

/* aplica las acciones seleccionadas para las solicitudes, llamando al
	servidor para actualizar y mostrando el resultado de la petición */
function aplicarDecisiones() {

	var b=false;
	for (var i=0; i < aNombresSolicitudes.length ; i++)	
		if (autorizados[i] || denegados[i])
			b=true;
	if (b) {
		interval = setInterval('girarImagenCarga("eventosSolicitudes")',200);
		var myAjax = getMyAjax('adminRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
					clearInterval(interval);
					var cadResult = '';
					var numResult = parseInt(myAjax.responseText.replace(/^\s+|\s+$/g,""));
					switch (numResult) {
						
						case 0:
						case 2:
						case 20: cadResult = "<p><b>Operaciones realizadas con exito</b></p>";
								break;
						case 10:
						case 12: cadResult = "<p class='errorP'>Error: Fallo en la operacion de autorizar</p>";
								break;
						case 1:
						case 21: cadResult = "<p class='errorP'>Error: Fallo en la operacion de denegar</p>";
								break;
						case 11: cadResult = "<p class='errorP'>Error: Fallo en las operaciones</p>";
								break;
					
					}
					document.getElementById('eventosSolicitudes').innerHTML = cadResult;
					setTimeout('solicitudesAlta()',2000);		
			}
		};
		var cadPOST = "tipoPeticion=10&autorizados=";
		for (i=0; i < aNombresSolicitudes.length ; i++)
			if (autorizados[i])
				cadPOST += aNombresSolicitudes[i] + ",";
		if (cadPOST.charAt(cadPOST.length-1)==",")
			cadPOST = cadPOST.substr(0,cadPOST.length-1);
		cadPOST += "&denegados=";
		for (i=0; i < aNombresSolicitudes.length; i++)
			if (denegados[i])
				cadPOST += aNombresSolicitudes[i] + ",";
		if (cadPOST.charAt(cadPOST.length-1)==",")
			cadPOST = cadPOST.substr(0,cadPOST.length-1);
		myAjax.send(cadPOST);
	}
}

// Construye la lista de solicitudes con los datos de entrada
function mostrarSolicitudes(data) {
	
	var cadHTML = "<b>No se encontraron resultados</b>";
	if (data != '') {

		cadHTML = "	<table id='tablaUsuarios' name='tablaUsuarios'>";
		cadHTML += "	<tr>";
		cadHTML += "		<td>&nbsp;</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrdenSolicitudes("+'"usuario"'+");'>";
		cadHTML += "				Usuario";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrdenSolicitudes("+'"fechaSolicitado"'+");'>";
		cadHTML += "				Fecha Solicitado";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrdenSolicitudes("+'"nombre"'+");'>";
		cadHTML += "				Nombre";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrdenSolicitudes("+'"apellidos"'+");'>";
		cadHTML += "				Apellidos";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrdenSolicitudes("+'"edad"'+");'>";
		cadHTML += "				Edad";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML	+= "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "		<input type='button' value='Aplicar Decisiones'";
		cadHTML += "			onClick='Javascript:aplicarDecisiones()'>";
		cadHTML += "		</td>";
		cadHTML += "	</tr>";
	
		var aData = data.split("#");
		
		aNombresSolicitudes = new Array();
		autorizados = new Array();
		denegados = new Array();
		
		for (var i=0; i< aData.length ; i++) {
			
			var aUserData = aData[i].split(",");
			aNombresSolicitudes[i] = aUserData[0];
			autorizados[i] = 0;
			denegados[i] = 0;
			cadHTML += "	<tr>";
			cadHTML += "		<td>";
			cadHTML += "			<a href='Javascript:desplegarSolicitud("+'"'+aUserData[0]+'"'+","+i+");'>";
			cadHTML += "				<img id='imagenDesplegar"+i+"' name='imagenDesplegar"+i+"'";
			cadHTML += "				 src="+'"../img/plusImg.jpg"'+"'>";
			cadHTML += "			</a>";
			cadHTML += "		</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[0]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[1]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[2]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[3]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData [4]+"</td>";
			cadHTML	+= "		<td class='entradaUsuariosTd'>";
			cadHTML	+= "		Autorizar";
			cadHTML += "			<input type='radio' id='accionSolicitud"+i+"' name='accionSolicitud"+i+"' ";
			cadHTML += "				value = 'autorizar' onclick='accionSolicitud(0,"+i+")'>";
			cadHTML	+= "		Denegar";
			cadHTML += "			<input type='radio' id='accionSolicitud"+i+"' name='accionSolicitud"+i+"' ";
			cadHTML += "				value = 'denegar' onclick='accionSolicitud(1,"+i+")'>";
			cadHTML += "		</td>";
			cadHTML += "	</tr>";
			cadHTML += "	<tr id='filaDetalle"+i+"' name ='filaDetalle"+i+"' class='desactivado'";
			cadHTML += "	  style='display:none'>";
			cadHTML += "		<td>&nbsp;</td>";
			cadHTML += "		<td colspan=5 id='detalle"+i+"' name='detalle"+i+"' class='detalleTd'>";
			cadHTML += "			<span class='espera'>Espere ...</span>";
			cadHTML += "		</td>";
			cadHTML += "	</tr>";
		}
	}
		
	document.getElementById('usuariosDiv').innerHTML=cadHTML;

}

// Envia peticion al servidor para poblar la lista de solicitudes
function solicitudesAlta() {
	
	// FILTROS DE LISTADO USUARIOS
	var cadHTML = "<p class='titleP'>LISTADO DE SOLICITUDES REGISTRADAS</p>";
	cadHTML += "<form id='solicitudesForm' name='solicitudesForm'";
	cadHTML +=  " 	 method='POST'>";
	cadHTML +=  " 	 <p class='eventsP' id='eventosSolicitudes' name='eventosSolicitudes'></p>";
	cadHTML += "	<hr>";
	cadHTML += "</form>";
	cadHTML += "<div id='usuariosDiv' name='usuariosDiv'>&nbsp</div>";

	document.getElementById('adminContent').innerHTML = "" + cadHTML + "";
	
	// CARGA DE CONTENIDO DEL SERVIDOR - TABLA USUARIOS
	interval = setInterval('girarImagenCarga("usuariosDiv")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var respuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"");
			mostrarSolicitudes(respuesta);
		}
	};
	var cadPOST = "tipoPeticion=9";
	cadPOST += "&orden="+ordenSolicitudes[0]+" "+ordenSolicitudes[1];
	myAjax.send(cadPOST);
}
