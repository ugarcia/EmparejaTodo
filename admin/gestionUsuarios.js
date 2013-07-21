
// VARIABLES GLOBALES
var filtroUsuarios = new Array('ALL','ALL');
var ordenUsuarios = new Array('fechaAutorizado','asc');
var aInterval = new Array();
var aNombresUsuarios = new Array();
var aSelectedUsuarios = new Array();


// actualiza los filtros y recarga vista
function updateFilters(filter,numFilter) {
	filtroUsuarios[numFilter] = filter.options[filter.selectedIndex].value;
	usuariosRegistrados();
}

// actualiza orden y recarga vista
function updateOrden(campo) {
	ordenUsuarios[0] = campo;
	ordenUsuarios[1] = (ordenUsuarios[1])=='asc' ? 'desc' : 'asc';
	usuariosRegistrados();
}

// actualiza en var. globales un usuario como seleccionado / deseleccionado
function selectUsuario(bCheck,numUsuario) {
	
	if (bCheck.checked)
		aSelectedUsuarios[numUsuario]=1;
	else
		aSelectedUsuarios[numUsuario]=0;
}

// selecciona / deselecciona todos los usuarios
function selTodosUsuarios() {
	for (var i=0; i < aNombresUsuarios.length ; i++) {
		if (document.getElementById('selAllUsuarios').checked) {
			document.getElementById('selUsuario'+i).checked=true;
			aSelectedUsuarios[i]=1;
		} else {
			document.getElementById('selUsuario'+i).checked=false;
			aSelectedUsuarios[i]=0;
		}
	}
}

//Muestra detalles de un usuario según datos de entrada
function mostrarUsuario(usuario,data,capa) {

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
	cadHTML += "	<tr>";
	cadHTML += "		<td>";
	cadHTML += "			<input type='button' value='Modificar'";
	cadHTML += "				onclick='Javascript:modificarUsuario("+'"'+usuario+'"'+")'>";
	cadHTML += "			<input type='button' value='Eliminar'";
	cadHTML += "				onclick='Javascript:eliminarUsuario("+'"'+usuario+'"'+")'>";
	cadHTML += "		</td>";
	cadHTML += "	</tr>";
	cadHTML += "</table>";
	cadHTML += "</form>";
	
	document.getElementById(capa).innerHTML = cadHTML;

}

/* envia petición al servidor para recuperar los datos
	del usuario para desplegar su detalle de la lista */
function desplegarUsuario(usuario,control) {
	// Desplegar fila oculta con imagen en movimiento (espera)
	var filaCapa = document.getElementById('filaDetalle'+control);
	capa = 'detalle'+control;
	var selImg = document.getElementById('imagenDesplegar'+control);
	if (filaCapa.style.display=='none') {
	
		selImg.src="../img/minusImg.jpg";
		filaCapa.style.display = (IE) ? 'block' : 'table-row';
		aInterval[control] = setInterval('girarImagenCarga(capa)',100);
		
		var myAjax = getMyAjax('adminRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
			  window.location.href.indexOf("http")==-1)) {
				clearInterval(aInterval[control]);
				var aRespuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"").split("|");
				switch (parseInt(aRespuesta[0])) {
					case 0: mostrarUsuario(usuario,aRespuesta[1],capa);
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

// elimina un usuario en concreto desde su detalle
function eliminarUsuario(usuario) {
	interval = setInterval('girarImagenCarga("eventosUsuarios")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		 if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			document.getElementById('eventosUsuarios').innerHTML=myAjax.responseText;
			if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='Successful')
						setTimeout('usuariosRegistrados()',2000);
		}
	};
	var cadPOST = "tipoPeticion=7";
	cadPOST += "&usuario="+usuario;
	myAjax.send(cadPOST);
}

// elimina usuarios seleccionados
function eliminarUsuarios() {
	var b=false;
	for (var i=0; i < aNombresUsuarios.length ; i++)
		if (aSelectedUsuarios[i]) b=true;
	if (b) {
		interval = setInterval('girarImagenCarga("eventosUsuarios")',200);
		var myAjax = getMyAjax('adminRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
					clearInterval(interval);
					document.getElementById('eventosUsuarios').innerHTML = myAjax.responseText;
					if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='Successful')
						setTimeout('usuariosRegistrados()',2000);		
			}
		};
		var cadPOST = "tipoPeticion=7";
		for (var i=0; i < aNombresUsuarios.length ; i++)
			if (aSelectedUsuarios[i])
			cadPOST += "&usuario"+i+"="+aNombresUsuarios[i];
		myAjax.send(cadPOST);
	}
}

// Muestra la lista de usuarios según datos de entrada
function mostrarUsuariosRegistrados(data) {
	
	var cadHTML = "<b>No se encontraron resultados</b>";
	if (data != '') {

		cadHTML = "	<table id='tablaUsuarios' name='tablaUsuarios'>";
		cadHTML += "	<tr>";
		cadHTML += "		<td>&nbsp;</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrden("+'"usuario"'+");'>";
		cadHTML += "				Usuario";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrden("+'"fechaAutorizado"'+");'>";
		cadHTML += "				Fecha Autorizado";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrden("+'"nombre"'+");'>";
		cadHTML += "				Nombre";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrden("+'"apellidos"'+");'>";
		cadHTML += "				Apellidos";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML += "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<a href='Javascript:updateOrden("+'"edad"'+");'>";
		cadHTML += "				Edad";
		cadHTML += "			</a>";
		cadHTML += "		</td>";
		cadHTML	+= "		<td class='cabeceraUsuariosTd'>";
		cadHTML += "			<input type='checkBox' id='selAllUsuarios' name='selAllUsuarios'";
		cadHTML += "				onClick='Javascript:selTodosUsuarios();'>";
		cadHTML += "		</td>";
		cadHTML += "	</tr>";
	
		var aData = data.split("#");
		
		aNombresUsuarios = new Array();
		aSelectedUsuarios = new Array();
		
		for (var i=0; i< aData.length ; i++) {
			
			var aUserData = aData[i].split(",");
			aNombresUsuarios[i] = aUserData[0];
			cadHTML += "	<tr>";
			cadHTML += "		<td>";
			cadHTML += "			<a href='Javascript:desplegarUsuario("+'"'+aUserData[0]+'"'+","+i+");'>";
			cadHTML += "				<img id='imagenDesplegar"+i+"' name='imagenDesplegar"+i+"'";
			cadHTML += "				 src="+'"../img/plusImg.jpg"'+"'>";
			cadHTML += "			</a>";
			cadHTML += "		</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[0]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[1]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[2]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData[3]+"</td>";
			cadHTML += "		<td class='entradaUsuariosTd'>"+aUserData [4]+"</td>";
			cadHTML	+= "		<td class='right'>";
			cadHTML += "			<input type='checkBox' id='selUsuario"+i+"' name='selUsuario"+i+"' ";
			cadHTML += "				onchange='selectUsuario(this,"+i+")'>";
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

/* Muestra titulo y filtros para la lista, tras ello envia
	petición al servidor para poblar dicha lista */
function usuariosRegistrados() {
	
	var cadHTML = "<p class='titleP'>LISTADO DE USUARIOS REGISTRADOS</p>";
	cadHTML += "<form id='usuariosRegistradosForm' name='usuariosRegistradosForm'";
	cadHTML +=  " 	 method='POST'>";
	cadHTML +=  " 	 <p class='eventsP' id='eventosUsuarios' name='eventosUsuarios'></p>";
	cadHTML +=  " 	 <p class='filtersP'>";
	cadHTML +=  " 	 Sexo &nbsp;";
	cadHTML +=  "		<select id='sexoUsuarioSelect' name='sexoUsuarioSelect'";
	cadHTML +=  "			onchange='Javascript:updateFilters(this,0);'>";
	cadHTML +=  "			<option value='ALL'";
	if (filtroUsuarios[0]=='ALL')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>ALL</option>";
	cadHTML +=  "			<option value='m'";
	if (filtroUsuarios[0]=='m')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>Mujer</option>";
	cadHTML +=  "			<option value='h'";
	if (filtroUsuarios[0]=='h')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>Hombre</option>";
	cadHTML +=  "		</select>  &nbsp; &nbsp;";
	
	cadHTML +=  " 	 Estado &nbsp;";
	cadHTML +=  "		<select id='estadoUsuarioSelect' name='estadoUsuarioSelect'";
	cadHTML +=  "			onchange='Javascript:updateFilters(this,1);'>";
	cadHTML +=  "			<option value='ALL'";
	if (filtroUsuarios[1]=='ALL')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>ALL</option>";
	cadHTML +=  "			<option value='administrador'";
	if (filtroUsuarios[1]=='administrador')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>Administrador</option>";
	cadHTML +=  "			<option value='autorizado'";
	if (filtroUsuarios[1]=='autorizado')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>Usuario</option>";
	cadHTML +=  "			<option value='denegado'";
	if (filtroUsuarios[1]=='denegado')
		cadHTML +=  "			 selected='selected'";
	cadHTML +=  "			>Denegado</option>";
	cadHTML +=  "		</select>&nbsp;&nbsp;";
	cadHTML += "		<input type='button' value='Borrar Seleccionados'";
	cadHTML += "			onClick='Javascript:eliminarUsuarios()'>";
	cadHTML += "	</p>";
	cadHTML += "	<hr>";
	cadHTML += "</form>";
	
	cadHTML +=  "		<div id='usuariosDiv' name='usuariosDiv'>&nbsp</div>";

	document.getElementById('adminContent').innerHTML = "" + cadHTML + "";
	
	interval = setInterval('girarImagenCarga("usuariosDiv")',200);
	var myAjax = getMyAjax('adminRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var respuesta = myAjax.responseText.replace(/^\s+|\s+$/g,"");
			mostrarUsuariosRegistrados(respuesta);
		}
	};
	var cadPOST = "tipoPeticion=3";
	cadPOST += "&sexo="+filtroUsuarios[0];
	cadPOST += "&estado="+filtroUsuarios[1];
	cadPOST += "&orden="+ordenUsuarios[0]+" "+ordenUsuarios[1];
	myAjax.send(cadPOST);
}
