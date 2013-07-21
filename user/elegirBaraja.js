
// VARIABLES GLOBALES
var filtroBarajas = new Array(3,0);
var ordenBarajas = new Array('numCartas','desc');
var aInterval = new Array();
var aNombresBarajas = new Array();
var aSelectedBarajas = new Array();

// actualiza los filtros y recarga vista
function updateFilters(filter,numFilter) {
	filtroBarajas[numFilter] = filter.options[filter.selectedIndex].value;
	elegirBaraja();
}

// actualiza orden y recarga vista
function updateOrden(campo) {
	ordenBarajas[0] = campo;
	ordenBarajas[1] = (ordenBarajas[1])=='asc' ? 'desc' : 'asc';
	elegirBaraja();
}

// actualiza en var. globales una baraja como seleccionada / deseleccionada
function selectBaraja(bCheck,numBaraja) {
	
	if (bCheck.checked)
		aSelectedBarajas[numBaraja]=1;
	else
		aSelectedBarajas[numBaraja]=0;
}

// selecciona / deselecciona todas las barajas
function selTodasBarajas() {
	for (var i=0; i < aNombresBarajas.length ; i++) {
		if (document.getElementById('selAllBarajas').checked) {
			document.getElementById('selBaraja'+i).checked=true;
			aSelectedBarajas[i]=1;
		} else {
			document.getElementById('selBaraja'+i).checked=false;
			aSelectedBarajas[i]=0;
		}
	}
}

// selecciona la baraja por defecto
function selDefault(rButton) {
	var selected = rButton.value;
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			document.getElementById('eventosBarajas').innerHTML =myAjax.responseText; 
		}
	};
	var cadPOST = "tipoPeticion=8";
	cadPOST += "&default="+aNombresBarajas[selected];
	myAjax.send(cadPOST);
}

// elimina barajas seleccionadas
function borrarBarajas() {
	var b=false;
	for (var i=0; i < aNombresBarajas.length ; i++)
		if (aSelectedBarajas[i]) b=true;
	if (b) {
		interval = setInterval('girarImagenCarga("eventosBarajas")',200);
		myAjax = getMyAjax('userRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
					clearInterval(interval);
					document.getElementById('eventosBarajas').innerHTML = myAjax.responseText;
					if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='Succesfull')
						setTimeout('elegirBaraja()',2000);		
			}
		};
		var cadPOST = "tipoPeticion=7";
		for (var i=0; i < aNombresBarajas.length ; i++)
			if (aSelectedBarajas[i])
			cadPOST += "&baraja"+i+"="+aNombresBarajas[i];
		myAjax.send(cadPOST);
	}
}

//Muestra detalles de una baraja según datos de entrada
function mostrarCartasBaraja(capa,datos) {
	var aData = datos.replace(/^\s+|\s+$/g,"").split("#");
	var count=0;
	var aDatosCarta,nameCarta;
	var cadHTML = "";
	for (var i=0; i < aData.length ; i++) {
		aDatosCarta = aData[i].split(",");
		nameCarta = "img_"+aDatosCarta[0];
		cadHTML += " <img class='mediumSize ";
		if (!count++)
			cadHTML += "reverso";
		else
			cadHTML += "descubierta";
		cadHTML += "' src='../cards/"+nameCarta+"."+aDatosCarta[1]+"'> "; 
	}
	document.getElementById(capa).innerHTML = cadHTML;
	
	
}

/* envia petición al servidor para recuperar las cartas y 
	después desplegar su detalle de la lista */
function desplegarBaraja(baraja,control) {
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
					mostrarCartasBaraja(capa,myAjax.responseText);
			}
		};
		var cadPOST = "tipoPeticion=6";
		cadPOST += "&nombre="+baraja;
		myAjax.send(cadPOST);
		
	} else {
		selImg.src="../img/plusImg.jpg";
		filaCapa.style.display ='none';
	}
}

// Muestra la lista de barajas según datos de entrada
function mostrarBarajas(datosBarajas) {

	var aData = datosBarajas.split("@");
	aData[0] = aData[0].replace(/^\s+|\s+$/g,"");
	aData[1] = aData[1].replace(/^\s+|\s+$/g,"");
	
	var cadHTML = "<b>No se encontraron resultados</b>";
	if (aData[0]!='') {
	
		cadHTML = "<table id='tablaBarajas' name='tablaBarajas'>";
		cadHTML	+= "		<tr><td>&nbsp;</td>";
		cadHTML	+= "			<td class='cabeceraBarajasTd left'>";
		cadHTML	+= "				<a href='Javascript:updateOrden("+'"nombre"'+");'>";
		cadHTML	+= "					Nombre";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraBarajasTd'>";
		cadHTML	+= "				<a href='Javascript:updateOrden("+'"numCartas"'+");'>";
		cadHTML	+= "					Num.Cartas";
		cadHTML	+= "				</a>";
		cadHTML	+= "			</td>";
		cadHTML	+= "			<td class='cabeceraBarajasTd'>";
		cadHTML += "				<input type='checkBox' id='selAllBarajas' name='selAllBarajas'";
		cadHTML += "					onClick='Javascript:selTodasBarajas();'>";
		cadHTML += "			</td>";
		cadHTML	+= "			<td class='cabeceraBarajasTd'>";
		cadHTML	+= "				Elegida";
		cadHTML += "			</td>";
		cadHTML	+= "			<td class='cabeceraBarajasTd left'>";
		cadHTML += "				<input type='button' value='Borrar Seleccionadas'";
		cadHTML += "					onClick='Javascript:borrarBarajas()'>";
		cadHTML	+= "			</td>";
		cadHTML	+= "		</tr>";	
	
		var aBarajas = aData[0].split("#");
		
		var aDatosBaraja;
		aNombresBarajas = new Array();
		aSelectedBarajas = new Array();
		for (i = 0; i < aBarajas.length ; i++) {
			aDatosBaraja = aBarajas[i].split(",");
			aNombresBarajas[i] = aDatosBaraja[0];
			aSelectedBarajas[i]=0;
			cadHTML += "	<tr>";
			cadHTML += "		<td class='entradaBarajasTd'>";
			cadHTML += "			<a href='Javascript:desplegarBaraja("+'"'+aDatosBaraja[0]+'"'+","+i+");'>";
			cadHTML += "				<img id='imagenDesplegar"+i+"' name='imagenDesplegar"+i+"'";
			cadHTML += "					 src="+'"../img/plusImg.jpg"'+"'>";
			cadHTML += "			</a>";
			cadHTML += "		</td>";
			cadHTML += "		<td class='entradaBarajasTd left'>"+aDatosBaraja[0]+"</td>";
			cadHTML += "		<td class='entradaBarajasTd centred'>"+aDatosBaraja[1]+"</td>";
			cadHTML	+= "		<td class='right'>";
			cadHTML += "			<input type='checkBox' id='selBaraja"+i+"' name='selBaraja"+i+"' ";
			cadHTML += "				onchange='selectBaraja(this,"+i+")'>";
			cadHTML += "		</td>";
			cadHTML	+= "		<td class='centred'>";
			cadHTML += "			<input type='radio' id='defaultBaraja' name='defaultBaraja'";
			if (aNombresBarajas[i]==aData[1])
				cadHTML += "		checked ";
			cadHTML += "				value="+i+"	onClick='Javascript:selDefault(this);'>";
			cadHTML += "		<td class='emptyWideTd'> &nbsp </td>";
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
	cadHTML += " </table></div></form>";
	
	document.getElementById('barajasDiv').innerHTML = cadHTML;
	
}

/* Muestra titulo y filtros para la lista, tras ello envia
	petición al servidor para poblar dicha lista */
function elegirBaraja() {
	
	var cadHTML = "<p class='titleP'>LISTADO DE BARAJAS DEFINIDAS</p>";
	cadHTML += "<form id='elegirBarajaForm' name='elegirBarajaForm'";
	cadHTML +=  " 	 method='POST'> ";
	cadHTML +=  " 	 <p class='eventsP' id='eventosBarajas' name='eventosBarajas'></p>";
	cadHTML +=  " 	 <p class='filtersP'>";
	cadHTML +=  " 	 Barajas con minimo &nbsp;";
	cadHTML +=  "		<select id='minCartasSelect' name='minCartasSelect'";
	cadHTML +=  "			onchange='Javascript:updateFilters(this,0);'>";
	for (var i=3; i<17 ; i++) {
		cadHTML +=  "			<option value="+i;
		if (filtroBarajas[0]==i)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>"+i+"</option>";
	}
	cadHTML +=  " 	 	</select> &nbsp; y maximo &nbsp;";
	cadHTML +=  "		<select id='maxCartasSelect' name='maxCartasSelect'";
	cadHTML +=  "			onchange='Javascript:updateFilters(this,1);'>";
	cadHTML +=  "			<option value=0";
		if (filtroBarajas[1]==0)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>MAX</option>";
	
	for (i=3; i<17 ; i++) {
		cadHTML +=  "			<option value="+i;
		if (filtroBarajas[1]==i)
			cadHTML +=  "			 selected='selected'";
		cadHTML +=  "			>"+i+"</option>";
	}
	cadHTML +=  "		</select> cartas &nbsp; ";
	cadHTML += "</p> <hr>";
	
	cadHTML +=  "		<div id='barajasDiv' name='barajasDiv'>&nbsp</div>";
	
	document.getElementById('userContent').innerHTML = "" + cadHTML + "";
	interval = setInterval('girarImagenCarga("barajasDiv")',200);
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
				window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			mostrarBarajas(myAjax.responseText);
	}
		
	};
	var cadPOST = "tipoPeticion=5";
	cadPOST += "&minCartas="+filtroBarajas[0];
	cadPOST += "&maxCartas="+filtroBarajas[1];
	cadPOST += "&orden="+ordenBarajas[0]+" "+ordenBarajas[1];
	myAjax.send(cadPOST);

}
