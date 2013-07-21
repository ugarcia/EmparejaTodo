
// VARIABLES GLOBALES
var IE = (navigator.appName.indexOf('Microsoft')>-1);

var interval=0;
var giroImagenCarga=1;

// ---------------------------------------------------------------------------------


// FUNCIONES COMUNES

// Devuelve Objeto 'XMLHttpRequest' para peticiones a cierto destino
function getMyAjax(destinoPeticiones) {
	var myAjax=false;
	if (window.XMLHttpRequest) {
		myAjax = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			myAjax = newActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				myAjax = newActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	}
	myAjax.open("POST",destinoPeticiones,true);
	myAjax.setRequestHeader('Content-Type',
	  'application/x-www-form-urlencoded; charset=ISO-8859-1');
	return myAjax;
}

// Efecto de giro de una imagen para la espera de carga de datos
function girarImagenCarga(capa) {
	document.getElementById(capa).innerHTML="<center><img src='../img/waitImg_0"+giroImagenCarga+".png'></center>";
	giroImagenCarga = (giroImagenCarga==8) ? 1 : giroImagenCarga + 1;
}

// Redimensiona la altura del contenido (llamado al redimensionar ventana)
function resizeHeightToWin(element) {
	var winAlto;
	winAlto = window.innerHeight;
	document.getElementById(element).style.height=(winAlto-20)+"px";
	
}