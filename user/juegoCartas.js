
	// VARIABLES GLOBALES
	
	var minCartas=8;
	var maxCartas=32;
	var minFilas=2;
	var maxFilas=4;
	
	var defaultNumCartas=24;
	var defaultNumFilas=3;
	
	var numCartas=24;
	var numFilas=3;
	
	var baraja='-default-';
	var numImages=8;
	
	var aCartas=new Array(maxCartas);
	var aPathCartas;
	var pathReverso='../cards/orig/reverso.jpg';
	var aVolteadas = new Array(maxCartas);
	
	var tiempoMax=0;
	var tiempoReal=0;
	var timerInterval;
	
	var finExito=0;
	var finalizado=1;
	var esperando=0;
	var primeraVolteada=-1;
	
	
	// FUNCION REDIMENSION DEL IFRAME
	function doFrameResize() {
		var myFrame = document.getElementById('gameFrame');
		var myContainer = document.getElementById('userContent');
		//alert (myFrame.style.height+"--"+myContainer.offsetHeight);
		myFrame.style.height = (myContainer.offsetHeight-10)+"px";
	}
	
	// FUNCION CARGA DE IFRAME CON EL HTML DEL JUEGO
	function jugar() {
		var cadHTML = "<iframe id='gameFrame' name='gameFrame' src='juegoCartas.html' ";
		cadHTML += "	></iframe>";
		document.getElementById('userContent').innerHTML=cadHTML;
	}
	
	// FUNCION PARA MOSTRAR LAS CARTAS - LLAMADA AL PULSAR 'JUGAR'
	function loadCartas() {
		aPathCartas = new Array();
		if (document.getElementById('inputBaraja').value=='8.-default-') {
		
			baraja='-default-';
			pathReverso='../cards/orig/reverso.jpg';
			numImages=8;
			for (var i = 0 ; i < numImages ; i++)
				aPathCartas[i]='../cards/orig/img'+i+'.jpg'; 
			asignarCartas();
			colocarCartas();	
	
		} else {
		
			var aSelectedBaraja = document.getElementById('inputBaraja').value.split(".");
			baraja = aSelectedBaraja[1];
			numImages = aSelectedBaraja[0];
			myAjax = getMyAjax('userRequests.php');
			myAjax.onreadystatechange=function() {
				if (myAjax.readyState==4 && (myAjax.status==200||
						window.location.href.indexOf("http")==-1)) {
					var aData = myAjax.responseText.replace(/^\s+|\s+$/g,"").split("#");
					aReversoData = aData[0].split(",");
					pathReverso='../cards/img_'+aReversoData[0]+'.'+aReversoData[1];
					for (var i = 1 ; i < aData.length ; i++) {
						aCartaData = aData[i].split(",");
						aPathCartas[i-1]='../cards/img_'+aCartaData[0]+'.'+aCartaData[1]; 
					}
					asignarCartas();
					colocarCartas();
				}
			};
			var cadPOST = "tipoPeticion=6";
			cadPOST += "&nombre="+baraja;
			myAjax.send(cadPOST);
		}
	}
	
	
	// FUNCION PARA ASIGNAR IMAGENES ALEATORIAS A LAS CARTAS
	function asignarCartas() {
		numCartas=document.getElementById('inputCartas').value;
		for (var i = 0 ; i < numCartas ; i++) {
			aCartas[i]=0; 	
			aVolteadas[i]=0;
		}
		
		var sinColocar=numCartas;

		while (sinColocar) {
			var aImages=new Array(numImages);
			for (var i=0 ; i < numImages ; i++)
				aImages[i]=0;
			for (var i=0; i< numImages ; i++) {
				do 
					var aleat = Math.floor(Math.random()*(numImages));
				while (aImages[aleat]);
				aImages[aleat]=1;
				for (var j=0; j < 2 ; j++) {
					do
						var aleat2 = Math.floor(Math.random()*(numCartas));
					while (aCartas[aleat2]);
					aCartas[aleat2]=aleat;
					sinColocar--;
				}
				if (!sinColocar)
					break;
			}		
		}
	}
	
	
	// FUNCION QUE CALCULA Y REALIZA LA DISPOSICION DE LAS CARTAS EN LA PANTALLA
	function colocarCartas() {
	
		numCartas=document.getElementById('inputCartas').value;
		numFilas=document.getElementById('inputFilas').value;
		var numCartasFila= parseInt(numCartas / numFilas);
		var cartasExceso= numCartas % numFilas;
		var anchoDiv, altoDiv;
	
		if (document.all) {
			anchoDiv = document.body.clientWidth;
			altoDiv = document.body.clientHeight;
		} else {
			anchoDiv = window.innerWidth;
			altoDiv = window.innerHeight;
		} 
		anchoDiv=parseInt(anchoDiv*0.7);
		altoDiv=parseInt(altoDiv*0.95);

		var maxCartasFila = (cartasExceso==0) ? numCartasFila : numCartasFila+1;
		if (maxCartasFila*0.6/anchoDiv > numFilas/altoDiv) {
			anchuraCarta=parseInt(anchoDiv/maxCartasFila);
			alturaCarta=parseInt(anchuraCarta/0.6);
		} else {
			alturaCarta=parseInt(altoDiv/numFilas);
			anchuraCarta=parseInt(alturaCarta*0.6);
		}
	
		document.getElementById('gameCell').style.verticalAlign='middle';
		var htmlString='<hr><div>';
		
		var restoCartas=numCartas;

		for (var i=0 ; i < numFilas ; i++) {
		
			var restoFilas=numFilas-i;
			var exceso = (cartasExceso > restoFilas/2) ? 1 : 0;
			
			for (var j=0 ; j < numCartasFila + exceso; j++) {
				nCarta= numCartas-restoCartas;
				htmlString+='<img id="carta'+nCarta+'" class="classImg" src="'+pathReverso+'" height='+alturaCarta+
							' width='+anchuraCarta+' onclick="voltearCarta('+nCarta+')">';
				restoCartas--;
			}
			if (exceso) cartasExceso--;
			htmlString+='<br/>';
		}	
	
		htmlString+='</div><hr>';
		var gameDiv= document.getElementById('gameDiv');
		gameDiv.innerHTML=""+htmlString+"";
	}
	
	
	//FUNCION QUE GESTIONA EL VOLTEADO DE LAS CARTAS
	function voltearCarta(nCarta) {
		if (!finalizado && !esperando && !aVolteadas[nCarta]) {	
			var img=aCartas[nCarta];
			document.getElementById("carta"+nCarta).src=aPathCartas[img];
			aVolteadas[nCarta]=1;
			if (primeraVolteada!=-1) {
				if (aCartas[primeraVolteada]!=img) {
					esperando=1;
					setTimeout("taparCartas("+primeraVolteada+","+nCarta+")",1000);
				}
				else {
					primeraVolteada=-1;
					variarPuntuacion(10);
					if (todasVolteadas()) {
						finExito=1;
						finalizar("Enhorabuena, has descubierto todas");
					}
				}
			} else 
			primeraVolteada=nCarta;
		}
	}
	
	//FUNCION QUE OCULTA DOS CARTAS NO COINCIDENTES
	function taparCartas(nCarta1,nCarta2) {
		aVolteadas[nCarta1]=0;
		document.getElementById("carta"+nCarta1).src=pathReverso;
		aVolteadas[nCarta2]=0;
		document.getElementById("carta"+nCarta2).src=pathReverso;
		primeraVolteada=-1;
		esperando=0;
		variarPuntuacion(-5);
	}
	
	//FUNCION QUE DEVUELVE SI SE HAN VOLTEADO TODAS LAS CARTAS O NO
	function todasVolteadas() {
		for (var i=0 ; i < numCartas ; i++)
			if (!aVolteadas[i])
				return false;
		return true;
	}
	
	//FUNCION QUE VARIA Y REPRESENTA LA PUNTUACION TRAS CADA MOVIMIENTO
	function variarPuntuacion(dif) {
		var turnActual=document.getElementById("turnos");
		turnActual.value=parseInt(turnActual.value)+1;
		var puntActual=document.getElementById("puntuacion");
		var valActual=parseInt(puntActual.value)+dif;
		puntActual.value=valActual;
		if (valActual>0)
			puntActual.style.color='green';
		else if (valActual=0)
			puntActual.style.color='black';
		else
			puntActual.style.color='red';
	}
	
	//FUNCION QUE CARGA INICIALMENTE EL INPUT DE SELECCION DE BARAJA
	function fillInputBaraja(datosBarajas) {

		var aData = datosBarajas.split("@");
		aData[0] = aData[0].replace(/^\s+|\s+$/g,"");
		aData[1] = aData[1].replace(/^\s+|\s+$/g,"");
		baraja = aData[1];
		var inputBar=document.getElementById('inputBaraja');
		inputBar.options[0]=new Option('8.-default-','8.-default-');
		
		if (aData[0]!='') {
			
			var aBarajas = aData[0].split("#");
			var aDatosBaraja;
			for (var i = 0; i < aBarajas.length ; i++) {
				aDatosBaraja = aBarajas[i].split(",");
				if (aData[1]==aDatosBaraja[0])
					numImages = aDatosBaraja[1];
				inputBar.options[inputBar.length]=new Option(aDatosBaraja[1]+
							"."+aDatosBaraja[0],aDatosBaraja[1]+"."+aDatosBaraja[0]);
			}
			
		} else {
			baraja='-default-';
			numImages=8
		}
		inputBar.value=numImages+"."+baraja;

	}
	
	//FUNCION QUE CARGA INICIALMENTE EL FORMULARIO CON LOS VALORES POR DEFECTO
	function loadInputs() {
	
		myAjax = getMyAjax('userRequests.php');
		myAjax.onreadystatechange=function() {
			if (myAjax.readyState==4 && (myAjax.status==200||
					window.location.href.indexOf("http")==-1)) {
				fillInputBaraja(myAjax.responseText);
			}
		};
		var cadPOST = "tipoPeticion=5";
		cadPOST += "&minCartas=3";
		cadPOST += "&maxCartas=0";
		cadPOST += "&orden=numCartas desc";
		myAjax.send(cadPOST);
	
		var inputCard=document.getElementById('inputCartas');
		for (var i=minCartas; i<=maxCartas; i+=2) 
			inputCard.options[inputCard.length]=new Option(i,i);
		inputCard.value=defaultNumCartas;
		var inputFilas=document.getElementById('inputFilas');
		for (var i=minFilas; i<=maxFilas; i++)
			inputFilas.options[inputFilas.length]=new Option(i,i);
		inputFilas.value=defaultNumFilas;
		document.getElementById('startButton').disabled=false;
				
	}
	
	
	//FUNCION QUE CONTROLA LA CUENTA ATRÁS DEL TIEMPO ESTALECIDO, LLAMADA A INTERVALOS DE 1seg
	function countDown() {
		var auxTimer = parseInt(document.getElementById('maxTime').value);
		document.getElementById('maxTime').value=--auxTimer;
		tiempoReal++;
		if (auxTimer<=0) {
			finExito=0;
			finalizar("Tiempo Agotado");
		}
	}
	
	
	//FUNCION QUE CONTROLA SÓLO EL TIEMPO INVERTIDO A INTERVALOS DE 1seg
	function countTime() {
		tiempoReal++;
	}
	
	//FUNCION QUE INICIA EL JUEGO Y LA CUENTA ATRÁS (SI PROCEDE)
	function startGame() {
		var auxTimer = document.getElementById('maxTime').value;
		document.getElementById('startButton').disabled=true;
		document.getElementById('maxTime').readOnly=true;
		document.getElementById('puntuacion').value=0;
		document.getElementById("puntuacion").style.color='black';
		document.getElementById('turnos').value=0;
		document.getElementById("turnos").style.color='black';
		finalizado=0;	
		tiempoReal=0;
		if (auxTimer!="" && !isNaN(auxTimer))  {
			tiempoMax = auxTimer;
			timerInterval=setInterval('countDown()',1000);
		}
		else 
			timerInterval=setInterval('countTime()',1000);
	}
	
	//FUNCION QUE FINALIZA EL JUEGO, RESTABLECIENDO LOS CONTROLES
	// Y GUARDANDO LA PARTIDA SI PROCEDE
	function finalizar(resultado) {
		if (timerInterval)
			clearInterval(timerInterval);	
		document.getElementById('maxTime').value = '';
		document.getElementById('startButton').disabled=false;
		document.getElementById('maxTime').readOnly=false;
		finalizado=1;
		if (confirm(resultado+"\nPulse 'Ok' para guardar\ndatos de la partida")) {
			var score = document.getElementById('puntuacion').value;
			var turns = document.getElementById('turnos').value;
			myAjax = getMyAjax('userRequests.php');
			myAjax.onreadystatechange=function() {
				if (myAjax.readyState==4 && (myAjax.status==200||
						window.location.href.indexOf("http")==-1)) {
					if (myAjax.responseText.replace(/^\s+|\s+$/g,"")!='OK')
						alert('Error al guardar la partida:\n'+myAjax.responseText);
				}
			};
			var cadPOST = "tipoPeticion=9";
			cadPOST += "&baraja="+baraja;
			cadPOST += "&numImages="+numImages;
			cadPOST += "&numCartas="+numCartas;
			cadPOST += "&numFilas="+numFilas;
			cadPOST += "&tiempoMax="+tiempoMax;
			cadPOST += "&endTime="+tiempoReal;
			cadPOST += "&finExito="+finExito;
			cadPOST += "&score="+score;
			cadPOST += "&turns="+turns;
			myAjax.send(cadPOST);		
		}
		
		var cadHTML = "<hr class='topHr'>";
		cadHTML += "	<p class='topTitles'>Juego de Imágenes por parejas</p>";
		cadHTML += "<hr>";
		document.getElementById('gameDiv').innerHTML=cadHTML;
		document.getElementById('gameCell').style.verticalAlign='top';	
	}