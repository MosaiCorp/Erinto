/*
			   ▄████████    ▄████████  ▄█  ███▄▄▄▄       ███      ▄██████▄  
			  ███    ███   ███    ███ ███  ███▀▀▀██▄ ▀█████████▄ ███    ███ 
			  ███    █▀    ███    ███ ███▌ ███   ███    ▀███▀▀██ ███    ███ 
			 ▄███▄▄▄      ▄███▄▄▄▄██▀ ███▌ ███   ███     ███   ▀ ███    ███ 
			▀▀███▀▀▀     ▀▀███▀▀▀▀▀   ███▌ ███   ███     ███     ███    ███ 
			  ███    █▄  ▀███████████ ███  ███   ███     ███     ███    ███ 
			  ███    ███   ███    ███ ███  ███   ███     ███     ███    ███ 
			  ██████████   ███    ███ █▀    ▀█   █▀     ▄████▀    ▀██████▀  
						   ███    ███                                       
								A laberynt generator
								done by:	Mosaico
								date:		19/05/2018
*/
//						:::Declaration of main variables:::
//						-----------------------------------
var matriz=[];
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var labGen=0;
var Rr=100,Rc=10,Rl=1;
var laberinto={
	width:$("#anchura").val()*2+1,
	height:$("#altura").val()*2+1
}
//HTML interaction width JQUERY
window.onload=setup();
$("#altura").change(()=>{
	laberinto.height=$("#altura").val()*2+1;
});
$("#anchura").change(()=>{
	laberinto.width=$("#anchura").val()*2+1;
});
$("#Trand").change(()=>{
	Rr=$("#Trand").val();
});
$("#Lrand").change(()=>{
	Rc=$("#Lrand").val();
});
$("#Irand").change(()=>{
	Rl=$("#Irand").val();
});
$("#create").click(()=>{
	if ($("#run").text()=="Borrar"&&labGen==0){
		labGen=1; 				//It can't ejecute in two because I can´t clean the scene
		crearLaberinto3D();;
	}
});
$("#run").click(()=>{
	if ($("#run").text()=="Generar"){
		generaLab();
		$("#run").text("Borrar");
	}else{
		ctx.save();
		ctx.fillStyle='rgba(200,200,200,1)';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.restore();
		$("#run").text("Generar");
	}	
});
function setup(){
	
	Rr=$("#Trand").val();


	Rc=$("#Lrand").val();


	Rl=$("#Irand").val();
	ctx.canvas.width  = window.innerHeight/1.3;
	ctx.canvas.height = window.innerHeight/1.3;
	ctx.save();
	ctx.fillStyle='rgba(255,255,255,0.5)';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.restore();
}
//							:::Main function to generate the labyrint:::
function generaLab(){
	var tiempo=Date.now();
	var contador=0;
	var paredes=[];// It is going to fill the wall abiables to generate labyrint
	var salida;
	matriz=[];//Clean the array that is going to fill the labyrint
	var Puerta=Math.floor(Math.random()*((laberinto.width+laberinto.height-2)));;// The randow selection of the future departure
	for (var m=0;laberinto.width>m;m++){//Generate a matrix width the labirynt dimensions
		 var columna=[];
		for (var n=0;laberinto.height>n;n++){//The edge of the square value will be "1" and the inside value will be "0"
			if (m==0||m==laberinto.width-1||n==0||n==laberinto.height-1)
			columna.push({
				p:1,
				x:m,
				y:n
			});
			else
				columna.push({
				p:0,
				x:m,
				y:n
			});
		}
		matriz.push(columna);
	}
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			if (matriz[n][m].p==1){
				if(n%2==0&&m%2==0){
					paredes.push([n,m]);
				}else{
					if (contador==Puerta){
						salida=[n,m];
					}
					contador++;
				}
			}
		}
	}
	
	matriz[(laberinto.width-1)/2][(laberinto.height-1)/2].p=1;
	while(paredes.length>0){
		var fuente=0;

		var randPared=Math.floor(Math.random()*paredes.length);
		var ladrillo=paredes[randPared];
		var direccion=[[0,1],[0,-1],[1,0],[-1,0]];
		for(var n=0, i =0 ;i<4;i++){
			if (ladrillo[0]+direccion[n][0]>=laberinto.width||ladrillo[0]+direccion[n][0]<0||ladrillo[1]+direccion[n][1]>=laberinto.height||ladrillo[1]+direccion[n][1]<0) {
				direccion.splice(n,1);
			}
			else if (matriz[ladrillo[0]+direccion[n][0]][ladrillo[1]+direccion[n][1]].p===1){
				direccion.splice(n,1);
			}else n++;
		}
		if(direccion.length>0){
			for (var i =direccion.length-1;i>=0&&fuente==0;i--){
				var rand=Math.floor(Math.random()*(i+1));
				var x=ladrillo[0]+direccion[rand][0];
				var y=ladrillo[1]+direccion[rand][1];
				var direcX=direccion[rand][0];
				var direcY=direccion[rand][1];;
				
				r=Math.floor(Math.random()*Rr);
				c=Math.floor(Math.random()*Rc);
				l=Math.floor(Math.random()*Rl);
				if ((y%2==0||x%2==0)&&(matriz[x+direcX+direcY][y+direcY+direcX].p  +  matriz[x+direcX][y+direcY].p + matriz[x+direcX-direcY][y+direcY-direcX].p==0)){
					if((matriz[x-direcX+direcY][y-direcY+direcX].p + matriz[x-direcX-direcY][y-direcY-direcX].p!==2||r==0) &&
					(matriz[x-direcX+direcY][y-direcY+direcX].p + matriz[x-direcX-direcY][y-direcY-direcX].p!==1||c==0) &&
					(matriz[x-direcX+direcY][y-direcY+direcX].p + matriz[x-direcX-direcY][y-direcY-direcX].p!==0||l==0)){
						matriz[x][y].p=1;
						paredes.push([x,y]);
						direccion=direccion.filter(n=>false);
					}
					fuente=1;
				}
				direccion=direccion.filter(num=>rand!=direccion.indexOf(num));
			}
		}
		if (fuente==0)paredes.splice(randPared,1);
	}
	matriz[(laberinto.width-1)/2][(laberinto.height-1)/2].p=0;
	matriz[salida[0]][salida[1]].p=0;
	visualizarLab(controls.getObject().position.x,controls.getObject().position.z);
	console.log(tiempo);
	$("#tiempo").text("Tiempo: "+((Date.now()-tiempo)/1000)+" s");
	$("#tiempo2").text("Efi: "+((Date.now()-tiempo)/(laberinto.width*laberinto.height)).toFixed(8)+" s/u2");
}
function visualizarLab(X,Z){
	var x=X*canvas.width/laberinto.width/20;
	var y=Z*canvas.height/laberinto.height/20;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			ctx.save();	
			var width;
			var height;
			var propX=1.5;
			var propY=1.5;
			var ajustY=((canvas.height)/laberinto.height)*propY/2;
			var ajustX=((canvas.width)/laberinto.width)*propX/2;
			if( matriz[n][m].p==1){
				ctx.fillStyle='rgba(220,50,0,0.9)';
			}else{
				ctx.fillStyle='rgba(50,200,0,0.6)';
			}
			if (m%2==1){
				height=((canvas.height+ajustY)/laberinto.height)*propY;
			}else{
				height=((canvas.height+ajustY)/laberinto.height)*(2-propY);
			}
			if (n%2==1){
				width=((canvas.width+ajustX)/laberinto.width)*propX;
			}else{
				width=((canvas.width+ajustX)/laberinto.width)*(2-propX);
			}
			ctx.fillRect(((canvas.width+ajustX)/laberinto.width)*(n-(propX-1)*(n%2)),((canvas.height+ajustY)/laberinto.height)*(m-(propY-1)*(m%2)),width,height);
			ctx.restore();
		}
	}
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x+canvas.width/2,y+canvas.height/2)
	ctx.arc(x+canvas.width/2,y+canvas.height/2,30,0,(Math.PI/180)*360,true);//void arc(in float x, in float y, in float radius, in float startAngle, in float endAngle, in boolean anticlockwise Optional );
    ctx.fillStyle="rgba(0,100,200,0.5";
	ctx.closePath();
    ctx.fill();
	ctx.restore();
}

var camera, scene, renderer;
var geometry, material, mesh;
var controls;
var objects = [];
var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
// https://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
	var element = document.body;
	var pointerlockchange = function ( event ) {
			if($("#run").text()=="Borrar")visualizarLab(controls.getObject().position.x,controls.getObject().position.z);
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controlsEnabled = true;
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};
	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	};
	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	instructions.addEventListener( 'click', function ( event ) {
		
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			};
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}
init();
animate();
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 800 );
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffdfff, 0, 750 );
	var light = new THREE.HemisphereLight( 0xee8eff, 0x774788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	// floor
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.rotateX( - Math.PI / 2 );
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
	}
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	var GeometriaPlano=new THREE.PlaneGeometry(100,100,10,10);
	var TexturaPlano=new THREE.ImageUtils.loadTexture("textures/floor2.jpg");
	TexturaPlano.wrapS=TexturaPlano.wrapT=THREE.RepeatWrapping;
	TexturaPlano.repeat.set(50,50);
	var MaterialPlano=new THREE.MeshBasicMaterial({map:TexturaPlano,side:THREE.DoubleSide});
	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
	mesh = new THREE.Mesh( geometry, MaterialPlano );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;
		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;
		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < 10 ) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}
		prevTime = time;
	}
	renderer.render( scene, camera );
}	
var Territorio =new THREE.Mesh();
var Pared=new THREE.Mesh();
var laberinto3D=[];
var espacioX=20*laberinto.width;
var espacioY=20*laberinto.height;			
function crearLaberinto3D(){
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			var width;
			var height;
			var propX=1;
			var propY=1;
			var ajustY=((espacioY)/laberinto.height)*propY/2;
			var ajustX=((espacioX)/laberinto.width)*propX/2;
			if( matriz[n][m].p==1){
				var Placa= new THREE.CubeGeometry(
				20, // Dimensiones en eje X
				50, // Dimensiones en eje Y
				20 // Dimensiones en eje Z
				);
				var TexturaCubo=new THREE.ImageUtils.loadTexture("textures/muro.jpg");
				var Pintura=new THREE.MeshBasicMaterial({map:TexturaCubo});
				Pared =new THREE.Mesh(Placa,Pintura);
					//camera.position.set(20*laberinto.width,10,20*laberinto.height);
				scene.add(Pared);
				Pared.position.x=20*n-9*laberinto.width;
				Pared.position.z=20*m-9*laberinto.height;
				Pared.position.y=10;
			}
		}
	}
}