//VAR: GLOBALES

var aSelectedCards = new Array();
var selectedReverso ='';


//Muestra las cartas seleccionadas desde var. globales
function cargarCartasSeleccionadas() {
	
	var cadHTML = "";
	if (!(selectedReverso =='')) {
		var srcReverso = document.getElementById(selectedReverso).src;
		cadHTML += "<img id='s-"+selectedReverso+"' name='r-";
		cadHTML += selectedReverso+"' src="+srcReverso;
		cadHTML += " onclick='deSeleccionarCarta(this)' class='mediumSize'>";
	}
	document.getElementById('reversoTd').innerHTML=cadHTML;
	cadHTML="";
	var srcCarta;
	for (var i = 0; i < aSelectedCards.length;i++) {
		srcCarta = document.getElementById(aSelectedCards[i]).src;
		cadHTML += "<img id='s-"+aSelectedCards[i]+"' name='s-";
		cadHTML += aSelectedCards[i]+"' src="+srcCarta;
		cadHTML += " onclick='deSeleccionarCarta(this)' class='mediumSize'>";
	}
	document.getElementById('cartasTd').innerHTML=cadHTML;
}

// Peticion al servidor para mostrar las cartas subidas por el usuario
function cargarCartasSubidas() {

	interval = setInterval('girarImagenCarga("userCartasTd")',100);
	var myAjax = getMyAjax('userRequests.php');
	
	myAjax.onreadystatechange = function() {
	
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			document.getElementById('userCartasTd').innerHTML = myAjax.responseText;
		}	
	}

	var cadPOST = "tipoPeticion=3";
	for (var i = 0; i < aSelectedCards.length;i++)
		cadPOST += "&carta"+i+"="+aSelectedCards[i];
	if (selectedReverso!="")
		cadPOST += "&reverso="+selectedReverso;
	myAjax.send(cadPOST);
}

// Selecciona una carta (de las subidas)
function seleccionarCarta(carta) {
	if (document.getElementById('checkReverso').checked)
		selectedReverso = carta.name;
	else
		aSelectedCards[aSelectedCards.length]=carta.name;
	cargarCartasSubidas();
	cargarCartasSeleccionadas();
	
}

// De-Selecciona una carta (de las seleccionadas)
function deSeleccionarCarta(carta) {
	var aNameCarta = carta.name.split("-");
	if (aNameCarta[0]=='r')
		selectedReverso="";
	else {
		var posCarta=-1;
		for (var i = 0; i < aSelectedCards.length ; i++)
			if (aSelectedCards[i]==aNameCarta[1])
				posCarta=i;
		if (posCarta!=-1)
			aSelectedCards.splice(posCarta,1);	
	}
	cargarCartasSubidas();
	cargarCartasSeleccionadas();
	
}

// Define una baraja nueva
function guardarBaraja() {
	
	var barajaResultP = document.getElementById('barajaResultP');
	var nombreBaraja = 	document.getElementById('nombreBarajaNueva').value;
	if (!nombreBaraja) {
		barajaResultP.innerHTML = "<p class='errorP'>Debe definir un nombre para la Baraja</p>";
		return;
	}
	
	if (aSelectedCards.length<3 || selectedReverso=='') {
		barajaResultP.innerHTML = "<p class='errorP'>Debe definir un reverso y al menos 3 cartas</p>";
		return;
	}
	
	interval = setInterval('girarImagenCarga("barajaResultP")',100);
	var myAjax = getMyAjax('userRequests.php');
	
	myAjax.onreadystatechange = function() {
	
		if (myAjax.readyState==4 && (myAjax.status==200||
		  window.location.href.indexOf("http")==-1)) {	  
			clearInterval(interval);
			barajaResultP.innerHTML = myAjax.responseText;
			loadBarajaSelect();
		}	
	}
	
	var cadPOST = "tipoPeticion=4";
	cadPOST += "&nombreBaraja="+nombreBaraja;
	for (var i = 0; i < aSelectedCards.length;i++)
		cadPOST += "&carta"+i+"="+aSelectedCards[i];
	cadPOST += "&reverso="+selectedReverso;
	cadPOST += "&numCartas="+aSelectedCards.length;
	myAjax.send(cadPOST);
}

// Activa el iFrame donde se carga el resultado de la subida de archivos
function validarSubirCarta() {

	var resultFrame = document.getElementById('resultUpload');
	resultFrame.style.display='block';
	return true;
	
}

// Carga el select con las barajas definidas por el usuario
function loadBarajaSelect() {
	var inputBar=document.getElementById('barajaSelect');
	for (var i=inputBar.options.length-1; i>=0 ;i--)
		inputBar.options[i]=null;
	inputBar.options[0]=new Option('','');
	myAjax = getMyAjax('userRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
					window.location.href.indexOf("http")==-1)) {
				var aData = myAjax.responseText.split("@");
				aData[0] = aData[0].replace(/^\s+|\s+$/g,"");
				if (aData[0]!='') {
					var aBarajas = aData[0].split("#");
					var aDatosBaraja;
					for (i = 0; i < aBarajas.length ; i++) {
						aDatosBaraja = aBarajas[i].split(",");
						inputBar.options[inputBar.length]=new Option(aDatosBaraja[1]+
									"."+aDatosBaraja[0],aDatosBaraja[1]+"."+aDatosBaraja[0]);
					}
				}	
			}
		};
		var cadPOST = "tipoPeticion=5";
		cadPOST += "&minCartas=3";
		cadPOST += "&maxCartas=0";
		cadPOST += "&orden=numCartas desc";
		myAjax.send(cadPOST);
}

// valida modificacion y envia peticiones de borrar + insertar baraja al servidor
function modificarBaraja() {
	
	var barajaResultP = document.getElementById('barajaResultP');
	
	if (document.getElementById('barajaSelect').value=='') {
		barajaResultP.innerHTML = "<p class='errorP'>Debe elegir una baraja</p>";
		return;
	}

	if (aSelectedCards.length<3 || selectedReverso=='') {
		barajaResultP.innerHTML = "<p class='errorP'>Debe definir un reverso y al menos 3 cartas</p>";
		return;
	}
	
	var aBaraja = document.getElementById('barajaSelect').value.split(".");	
	interval = setInterval('girarImagenCarga("barajaResultP")',100);
	var myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
		if (myAjax.readyState==4 && (myAjax.status==200||
			window.location.href.indexOf("http")==-1)) {
				clearInterval(interval);
				document.getElementById('barajaResultP').innerHTML = myAjax.responseText;
				if (myAjax.responseText.replace(/^\s+|\s+$/g,"")=='Succesfull') {
				
					interval = setInterval('girarImagenCarga("barajaResultP")',100);
					var myInnerAjax = getMyAjax('userRequests.php');
					myInnerAjax.onreadystatechange = function() {
					
						if (myInnerAjax.readyState==4 && (myInnerAjax.status==200||
						  window.location.href.indexOf("http")==-1)) {	  
							clearInterval(interval);
							barajaResultP.innerHTML = myInnerAjax.responseText;
							loadBarajaSelect();
						}
						
					}
					var cadPOST = "tipoPeticion=4";
					cadPOST += "&nombreBaraja="+aBaraja[1];
					for (var i = 0; i < aSelectedCards.length;i++)
						cadPOST += "&carta"+i+"="+aSelectedCards[i];
					cadPOST += "&reverso="+selectedReverso;
					cadPOST += "&numCartas="+aSelectedCards.length;
					myInnerAjax.send(cadPOST);

				}	
		}
	};
	var cadPOST = "tipoPeticion=7";
	cadPOST += "&baraja="+aBaraja[1];
	myAjax.send(cadPOST);
	
}

// Carga la baraja seleccionada
function changeBaraja(element) {

	if (element.value=='') {
		definirBaraja();
		return;
	}
	var aBaraja = element.value.split(".");
	interval = setInterval('girarImagenCarga("barajaResultP")',200);
	myAjax = getMyAjax('userRequests.php');
	myAjax.onreadystatechange=function() {
	if (myAjax.readyState==4 && (myAjax.status==200||
		window.location.href.indexOf("http")==-1)) {
			clearInterval(interval);
			var data = myAjax.responseText.replace(/^\s+|\s+$/g,"").split("#");
			var reversoData=data[0].split(",");
			selectedReverso="img_"+reversoData[0];
			aSelectedCards = new Array();
			for (var i=1; i< data.length; i++) {
				var cardData = data[i].split(",");
				aSelectedCards[i-1]="img_"+cardData[0];
			}
			cargarCartasSubidas();
			cargarCartasSeleccionadas();
		}
	};
	var cadPOST = "tipoPeticion=6";
	cadPOST += "&nombre="+aBaraja[1];
	myAjax.send(cadPOST);

}

// Muestra el formulario y vacio y llama a funciones para cargar los datos
function definirBaraja() {
	
	aSelectedCards = new Array();
	selectedReverso = '';
		
	var cadHTML = "	<p class='titleP'>DEFINIR BARAJA</p>";
	cadHTML += "	<form id ='formDefinirBaraja' name ='formDefinirBaraja' target='resultUpload'";
	cadHTML += "	 method='POST' enctype='multipart/form-data' action='userRequests.php' ";
	cadHTML += "	 onSubmit='Javascript:return validarSubirCarta();'>";
	cadHTML += "		<p><b>Selecciona una baraja:&nbsp;</b>";
	cadHTML += "		<select name='barajaSelect' id='barajaSelect' onChange='changeBaraja(this)'></select>";
	cadHTML += "		<input type='button' onclick='modificarBaraja()' value='Modificar'></p>";
	cadHTML += "		<p><b>...o define una nueva:&nbsp;</b>";
	cadHTML += "		<input type='text' name='nombreBarajaNueva' id='nombreBarajaNueva'>&nbsp;";
	cadHTML += "		<input type='button' onclick='guardarBaraja()' value='Definir'></p>";
	cadHTML += "		<p id='barajaResultP' name='barajaResultP'>";
	cadHTML += "		<b>SUBIR CARTA(S)...</b>&nbsp;</p><input type='file' multiple='true' id='fileInput[]' ";
	cadHTML += "		 name='fileInput[]' size='50'> &nbsp;";
	cadHTML += "	<input type='submit' value='Subir Carta(s)'><br/>";
	cadHTML += "	<center><iframe id='resultUpload' name='resultUpload' ";
	cadHTML += "	 class='desactivado' onload='cargarCartasSubidas()'></iframe><br/>";
	cadHTML += "	<table id='cartasTable' name='cartasTable' class='tablaCartas'>";
	cadHTML += "		<tr><td colspan='2'><p class='titleP'>";

	cadHTML += "		&nbsp; &nbsp; CARTAS SELECCIONADAS &nbsp; &nbsp;</p></td></tr>";
	cadHTML += "		<tr><td><b>Reverso</b></td>";
	cadHTML += "			<td><b>Cartas</b></td>";
	cadHTML += "		</tr><tr>";
	cadHTML += "			<td id='reversoTd' name='reversoTd'></td>";
	cadHTML += "			<td  id='cartasTd' name='cartasTd'></td>";
	cadHTML += "	</tr></table><br/>";
	
	cadHTML += "	<table id='userCartasTable' name='userCartasTable' class='tablaCartas'>";
	
	cadHTML += "		<tr><td><p class='titleP'>Seleccionar Reverso ";
	cadHTML += "			<input type='checkBox' name='checkReverso' id='checkReverso'>";
	
	cadHTML += "			&nbsp; &nbsp; &nbsp; CARTAS SUBIDAS</p></td></tr>";
	cadHTML += "		<tr><td  id='userCartasTd' name='userCartasTd'></td>";
	cadHTML += "		</tr></table> </center></form>";

	document.getElementById('userContent').innerHTML=cadHTML;
	
	loadBarajaSelect();
	
}

