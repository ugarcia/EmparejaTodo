
// VARIABLES GLOBALES
var filtroPuntuaciones = new Array(3,0);
var ordenPuntuaciones = new Array('score','desc');

var aInterval = new Array();
var aFechasPuntuaciones = new Array();
var aSelectedPuntuaciones = new Array();

// actualiza los filtros y recarga vista
function updateFiltersPuntuaciones(filter,numFilter) {
	filtroPuntuaciones[numFilter] = filter.options[filter.selectedIndex].value;
	verPuntuaciones();
}

// actualiza orden y recarga vista
function updateOrdenPuntuaciones(campo) {
	ordenPuntuaciones[0] = campo;
	ordenPuntuaciones[1] = (ordenPuntuaciones[1])=='asc' ? 'desc' : 'asc';
	verPuntuaciones();
}

// actualiza en var. globales una puntuacion como seleccionada / deseleccionada
function selectPuntuacion(bCheck,numPuntuacion) {
	
	if (bCheck.checked)
		aSelectedPuntuaciones[numPuntuacion]=1;
	else
		aSelectedPuntuaciones[numPuntuacion]=0;
}

// selecciona / deselecciona todas las puntuaciones
function selTodasPuntuaciones() {
	for (var i=0; i < aFechasPuntuaciones.length ; i++) {
		if (document.getElementById('selAllPuntuaciones').checked)
			document.getElementById('selPuntuacion'+i).checked=true;
		else
			document.getElementById('selPuntuacion'+i).checked=false;
	}
}

// elimina puntuaciones seleccionadas
function borrarPuntuaciones() {
	var b=false;
	for (var i=0; i < aFechasPuntuaciones.length ; i++)
		if (aSelectedPuntuaciones[i]) b=true;
	if (b) {
		interval = setInterval('girarImagenCarga("eventosPuntuaciones")',200);
		myAjax = getMyAjax('userRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
					clearInterval(interval);
					document.getElementById('eventosPuntuaciones').innerHTML = myAjax.responseText;
					if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='Succesfull')
						setTimeout('verPuntuaciones()',2000);		
			}
		};
		var cadPOST = "tipoPeticion=12";
		for (var i=0; i < aFechasPuntuaciones.length ; i++)
			if (aSelectedPuntuaciones[i])
			cadPOST += "&fecha"+i+"="+aFechasPuntuaciones[i];
		myAjax.send(cadPOST);
	}
}

//Muestra cartas de la abaraja utilizada según datos de entrada
function mostrarCartasBarajaSmall(baraja,capa,datos) {
	var cadHTML = "";
	if (baraja=='-default-') {
	
		cadHTML += " <img class='smallSize reverso' ";
		cadHTML += " src='../cards/orig/reverso.jpg'> "; 
		for (var i=0; i < 8 ; i++) {
			cadHTML += " <img class='smallSize descubierta' ";
			cadHTML += " src='../cards/orig/img"+i+".jpg'> "; 
		}
		
	} else {

		var aData = datos.replace(/^\s+|\s+$/g,"").split("#");
		var count=0;
		var aDatosCarta,nameCarta;
		
		for (var i=0; i < aData.length ; i++) {
			aDatosCarta = aData[i].split(",");
			nameCarta = "img_"+aDatosCarta[0];
			cadHTML += " <img class='smallSize ";
			if (!count++)
				cadHTML += "reverso";
			else
				cadHTML += "descubierta";
			cadHTML += "' src='../cards/"+nameCarta+"."+aDatosCarta[1]+"'> "; 
		}
	}
	document.getElementById(capa).innerHTML = cadHTML;
	
	
}

/* envia petición al servidor para recuperar las cartas y 
	después desplegar el detalle de la baraja utilizada
		en la partida desplegada */
function desplegarBarajaSmall(baraja,control) {
	var filaCapa = document.getElementById('filaDetalleBaraja'+control);
	capa = 'detalleBaraja'+control;
	var selImg = document.getElementById('imagenDesplegarBaraja'+control);
	if (filaCapa.style.display=='none') {
	
		selImg.src="../img/minusImg.jpg";
		filaCapa.style.display = (IE) ? 'block' : 'table-row';
		
		if (baraja!='-default-') {
		
			aInterval[control] = setInterval('girarImagenCarga(capa)',100);

			myAjax = getMyAjax('userRequests.php');
			myAjax.onreadystatechange=function() {
				if (myAjax.readyState==4 && (myAjax.status==200||
					window.location.href.indexOf("http")==-1)) {
						clearInterval(aInterval[control]);
						mostrarCartasBarajaSmall(baraja,capa,myAjax.responseText);
				}
			};
			var cadPOST = "tipoPeticion=6";
			cadPOST += "&nombre="+baraja;
			myAjax.send(cadPOST);
		
		} else {
			mostrarCartasBarajaSmall('-default-',capa,'')
		}
		
	} else {
		selImg.src="../img/plusImg.jpg";
		filaCapa.style.display ='none';
	}
}

//Muestra detalles de una puntuacion según datos de entrada
function mostrarDetallePuntuacion(capa,datos,control) {
	var aDatosPuntuacion = datos.split(",");
	
	var cadHTML = "<table id='tablaDetallePuntuaciones' name='tablaDetallePuntuaciones'>";
	
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Tiempo empleado:</td>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'>"+aDatosPuntuacion[0]+"</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Tiempo maximo establecido:</td>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'>"+aDatosPuntuacion[1]+"</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Turnos empleados:</td>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'>"+aDatosPuntuacion[2]+"</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Finalizado con exito:</td>";
	var bExito = (aDatosPuntuacion[3]!=0) ? 'Si' : 'No';
	cadHTML += "		<td class='entradaPuntuacionesTd left'>"+bExito+"</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Numero de filas:</td>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'>"+aDatosPuntuacion[4]+"</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	cadHTML += "	<tr>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'><b>Baraja:</td>";
	cadHTML += "		<td class='entradaPuntuacionesTd left'>";
	cadHTML += "		"+aDatosPuntuacion[5];
	cadHTML += "			<a href='Javascript:desplegarBarajaSmall(";
	cadHTML += '			"'+aDatosPuntuacion[5]+'"'+","+control+");'>";
	cadHTML += "				<img id='imagenDesplegarBaraja"+control+"'";
	cadHTML += "				 name='imagenDesplegarBaraja"+control+"'";
	cadHTML += "					 src="+'"../img/plusImg.jpg"'+"'>";
	cadHTML += "			</a>";
	cadHTML += "		</td>";
	cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
	cadHTML += "	</tr>";
	
	cadHTML += "	<tr id='filaDetalleBaraja"+control+"' name ='filaDetalleBaraja";
	cadHTML +=		 control+"' class='desactivado'";
	cadHTML += "	  style='display:none'>";
	cadHTML += "		<td>&nbsp;</td>";
	cadHTML += "		<td colspan=2 id='detalleBaraja"+control+"' name='detalleBaraja";
	cadHTML += 		 	 control+"' class='detallePuntuacionesTd'>";
	cadHTML += "			<span class='espera'>Espere ...</span>";
	cadHTML += "		</td>";
	cadHTML += "	</tr>";
	cadHTML += "</table>";
		
	document.getElementById(capa).innerHTML = cadHTML;
}

/* envia petición al servidor para recuperar los datos y 
	después desplegar su detalle de la lista */
function desplegarPuntuacion(puntuacion,control) {
	var filaCapa = document.getElementById('filaDetalle'+control);
	capa = 'detalle'+control;
	var selImg = document.getElementById('imagenDesplegar'+control);
	if (filaCapa.style.display=='none') {
	
		selImg.src="../img/minusImg.jpg";
		filaCapa.style.display = (IE) ? 'block' : 'table-row';
		aInterval[control] = setInterval('girarImagenCarga(capa)',100);
		
		myAjax = getMyAjax('userRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
					clearInterval(aInterval[control]);
					mostrarDetallePuntuacion(capa,myAjax.responseText,control);
			}
		};
		var cadPOST = "tipoPeticion=11";
		cadPOST += "&fecha="+puntuacion;
		myAjax.send(cadPOST);
		
	} else {
		selImg.src="../img/plusImg.jpg";
		filaCapa.style.display ='none';
	}
}

// Muestra la lista de puntuaciones según datos de entrada
function mostrarPuntuaciones(datosPuntuaciones) {
	
	var aData = datosPuntuaciones.replace(/^\s+|\s+$/g,"");

	var cadHTML = "<b>No se encontraron resultados</b>";
	
	if (aData!='') {
	
		cadHTML = "<table id='tablaPuntuaciones' name='tablaPuntuaciones'>";
		cadHTML	+= "		<tr><td>&nbsp;</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd left'>";
		cadHTML	+= "				<a href='Javascript:updateOrdenPuntuaciones("+'"fecha"'+");'>";
		cadHTML	+= "					Fecha";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd'>";
		cadHTML	+= "				<a href='Javascript:updateOrdenPuntuaciones("+'"score"'+");'>";
		cadHTML	+= "					Puntos";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd left'>";
		cadHTML	+= "				<a href='Javascript:updateOrdenPuntuaciones("+'"numCartas"'+");'>";
		cadHTML	+= "					Num.Cartas";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd'>";
		cadHTML	+= "				<a href='Javascript:updateOrdenPuntuaciones("+'"numImages"'+");'>";
		cadHTML	+= "					Num.Imagenes";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd'>";
		cadHTML += "				<input type='checkBox' id='selAllPuntuaciones' name='selAllPuntuaciones'";
		cadHTML += "					onClick='Javascript:selTodasPuntuaciones();'>";
		cadHTML += "			</td>";
		cadHTML	+= "			<td class='cabeceraPuntuacionesTd left'>";
		cadHTML += "				<input type='button' value='Borrar Seleccionadas'";
		cadHTML += "					onClick='Javascript:borrarPuntuaciones()'>";
		cadHTML	+= "			</td>";
		cadHTML	+= "		</tr>";	
	
		var aPuntuaciones = aData.split("#");
		var aDatosPuntuacion;
		aFechasPuntuaciones = new Array();
		aSelectedPuntuaciones = new Array();
		for (i = 0; i < aPuntuaciones.length ; i++) {
			aDatosPuntuacion = aPuntuaciones[i].split(",");
			aFechasPuntuaciones[i] = aDatosPuntuacion[0];
			aSelectedPuntuaciones[i]=0;
			cadHTML += "	<tr>";
			cadHTML += "		<td class='entradaPuntuacionesTd'>";
			cadHTML += "			<a href='Javascript:desplegarPuntuacion("+'"'+aDatosPuntuacion[0]+'"'+","+i+");'>";
			cadHTML += "				<img id='imagenDesplegar"+i+"' name='imagenDesplegar"+i+"'";
			cadHTML += "					 src="+'"../img/plusImg.jpg"'+"'>";
			cadHTML += "			</a>";
			cadHTML += "		</td>";
			cadHTML += "		<td class='entradaPuntuacionesTd left'>"+aDatosPuntuacion[0]+"</td>";
			cadHTML += "		<td class='entradaPuntuacionesTd centred'>"+aDatosPuntuacion[1]+"</td>";
			cadHTML += "		<td class='entradaPuntuacionesTd centred'>"+aDatosPuntuacion[2]+"</td>";
			cadHTML += "		<td class='entradaPuntuacionesTd centred'>"+aDatosPuntuacion[3]+"</td>";
			cadHTML	+= "		<td class='right'>";
			cadHTML += "			<input type='checkBox' id='selPuntuacion"+i+"' name='selPuntuacion"+i+"' ";
			cadHTML += "				onchange='selectPuntuacion(this,"+i+")'>";
			cadHTML += "		</td>";
			cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
			cadHTML += "	</tr>";
			cadHTML += "	<tr id='filaDetalle"+i+"' name ='filaDetalle"+i+"' class='desactivado'";
			cadHTML += "	  style='display:none'>";
			cadHTML += "		<td>&nbsp;</td>";
			cadHTML += "		<td colspan=6 id='detalle"+i+"' name='detalle"+i+"' class='detallePuntuacionesTd'>";
			cadHTML += "			<span class='espera'>Espere ...</span>";
			cadHTML += "		</td>";
			cadHTML += "	</tr>";
		}
	}
	cadHTML += " </table></div></form>";
	
	document.getElementById('puntuacionesDiv').innerHTML = cadHTML;
	
}

/* Muestra titulo y filtros para la lista, tras ello envia
	petición al servidor para poblar dicha lista */
function verPuntuaciones() {
	
	var cadHTML = "<p class='titleP'>LISTADO DE PUNTUACIONES</p>";
	cadHTML += "<form id='verPuntuacionesForm' name='verPuntuacionesForm'";
	cadHTML +=  " 	 method='POST'> ";
	cadHTML +=  " 	 <p class='eventsPuntuacionesP' id='eventosPuntuaciones'";
	cadHTML += "		name='eventosPuntuaciones'></p>";
	cadHTML +=  " 	 <p class='filtersPuntuacionesP'>";
	cadHTML +=  " 	 Puntuaciones con minimo &nbsp;";
	cadHTML +=  "		<select id='minImagesSelect' name='minImagesSelect'";
	cadHTML +=  "			onchange='Javascript:updateFiltersPuntuaciones(this,0);'>";
	for (var i=3; i<16 ; i++) {
		cadHTML +=  "			<option value="+i;
		if (filtroPuntuaciones[0]==i)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>"+i+"</option>";
	}
	cadHTML +=  " 	 	</select> &nbsp; y maximo &nbsp;";
	cadHTML +=  "		<select id='maxImagesSelect' name='maxImagesSelect'";
	cadHTML +=  "			onchange='Javascript:updateFiltersPuntuaciones(this,1);'>";
	cadHTML +=  "			<option value=0";
		if (filtroPuntuaciones[1]==0)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>MAX</option>";
	
	for (i=3; i<16 ; i++) {
		cadHTML +=  "			<option value="+i;
		if (filtroPuntuaciones[1]==i)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>"+i+"</option>";
	}
	cadHTML +=  "		</select> &nbsp; imagenes distintas &nbsp; ";
	cadHTML += "</p> <hr>";
	
	cadHTML +=  "		<div id='puntuacionesDiv' name='puntuacionesDiv'>&nbsp</div>";

	document.getElementById('userContent').innerHTML = "" + cadHTML + "";
	interval = setInterval('girarImagenCarga("puntuacionesDiv")',200);
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			mostrarPuntuaciones(myAjax.responseText);
	}
		
	};
	var cadPOST = "tipoPeticion=10";
	cadPOST += "&minImages="+filtroPuntuaciones[0];
	cadPOST += "&maxImages="+filtroPuntuaciones[1];
	cadPOST += "&orden="+ordenPuntuaciones[0]+" "+ordenPuntuaciones[1];
	myAjax.send(cadPOST);

}
