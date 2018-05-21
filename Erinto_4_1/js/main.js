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
var  eficiencia=0.016;
var Rt=100,Rl=10,Ri=1;
var laberinto={
	width:$("#anchura").val()*2+1,
	height:$("#altura").val()*2+1
}
var muralla=[];
//HTML interaction width JQUERY
window.onload=setup();
$("#altura").change(()=>{
	laberinto.height=$("#altura").val()*2+1;//Is very importat that value be odd
	expectedTime(laberinto.width,laberinto.height);
});
$("#anchura").change(()=>{
	laberinto.width=$("#anchura").val()*2+1;//Is very importat that value be odd
	expectedTime(laberinto.width,laberinto.height);
});
$("#Trand").change(()=>{
	Rt=$("#Trand").val();
});
$("#Lrand").change(()=>{
	Rl=$("#Lrand").val();
});
$("#Irand").change(()=>{
	Ri=$("#Irand").val();
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
		
	for (var n=laberinto.width*laberinto.height;n>0;n--)scene.remove(Pared);
	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle='rgba(200,200,200,0.1)';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.restore();
		labGen=0;
		$("#run").text("Generar");
	}	
});
function expectedTime(a,b){
	
	$("#tiempoE").text("T Aprox: "+(a*b*eficiencia/1000).toFixed(4)+" s");
	
}
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
	var wall=[];// It is going to fill the wall abiables to generate labyrint
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
		matriz.push(columna);//The matrix with the labyrint is going to fill in "matriz"
	}
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			if (matriz[n][m].p==1){//All positions with val 1, are going to be wall but only someone can be the root of future labyrint
				if(n%2==0&&m%2==0){//If pair are in two ejes will be part of the root of the future labyrint
					wall.push([n,m]);//All wall abiable are going to fill in this variable
				}else{
					if (contador==Puerta){//Select the future gate randomly
						salida=[n,m];
					}
					contador++;
				}
			}
		}
	}
	
	matriz[(laberinto.width-1)/2][(laberinto.height-1)/2].p=1;//In de tenter of thelabyrint we put a brick futurly will be removed to generate a spawn point
	while(wall.length>0){//While are abiable wall to make more roads to generate labyrint, the loop continius
		var OK=0;
		var randWall=Math.floor(Math.random()*wall.length);
		var brick=wall[randWall];//Select a random wall.
		var dir=[[0,1],[0,-1],[1,0],[-1,0]];//The four firections.
		for(var n=0, i =0 ;i<4;i++){//Check if the directions are abiables to select.
			if (brick[0]+dir[n][0]>=laberinto.width||brick[0]+dir[n][0]<0||brick[1]+dir[n][1]>=laberinto.height||brick[1]+dir[n][1]<0||
			matriz[brick[0]+dir[n][0]][brick[1]+dir[n][1]].p===1) dir.splice(n,1);//The directions not abiables will be removed
			else n++;//If the direction persist add to de counter to select the next direction
		}
		if(dir.length>0){//If are directions abiables 
			for (var i =dir.length-1;dir[i]!==undefined;i--){//For all directions abiables eject this
				var rand=Math.floor(Math.random()*(i+1));//We select a random direction 
				var x=brick[0]+dir[rand][0];//We select a near brick in the direction before selected
				var y=brick[1]+dir[rand][1];//We select a near brick in the direction before selected
				var dirX=dir[rand][0];
				var dirY=dir[rand][1];
				
				T=Math.floor(Math.random()*Rt);//This random numbers will be to regule the probabilitys to make the labyrint
				L=Math.floor(Math.random()*Rl);
				I=Math.floor(Math.random()*Ri);
				if ((y%2==0||x%2==0)&&(matriz[x+dirX+dirY][y+dirY+dirX].p+ 	//:::This is the principal algorithm::
				matriz[x+dirX][y+dirY].p+ 									//If the selected potential biricks 
				matriz[x+dirX-dirY][y+dirY-dirX].p==0)){					//front and sides are empty will be abiable to be a brick
				OK=1;//If pass the condition of the principal algorithm means that is OK to be a brick but in consecuence of the probability may not will be a brick
				/*Diverse formations:
				**"T"= ▄▄▄	"L"=  ▄▄▄	"I"=  █
				**new = ▓	new = ▓		new = ▓
				**brick		brick		brick
				*/
					if(((matriz[x-dirX+dirY][y-dirY+dirX].p + matriz[x-dirX-dirY][y-dirY-dirX].p!==2||T==0) &&//Regule of differents formes could catch the labyrint   
					(matriz[x-dirX+dirY][y-dirY+dirX].p + matriz[x-dirX-dirY][y-dirY-dirX].p!==1||L==0) &&
					(matriz[x-dirX+dirY][y-dirY+dirX].p + matriz[x-dirX-dirY][y-dirY-dirX].p!==0||I==0))){
						matriz[x][y].p=1;//Make a wall the selected brick
						wall.push([x,y]);//Add brick to the potential wall
						dir=[];//Remove all content of the dir array if some wall is made. 
					}
				}
				dir=dir.filter(num=>rand!=dir.indexOf(num));//Remove the direction if not abiable to be brick
			}
		}
		if (OK==0)wall.splice(randWall,1);//if in any direction is abiable make brick, the selected root brick will be removed for the wall array because isn't useful
	}
	matriz[(laberinto.width-1)/2][(laberinto.height-1)/2].p=0;//When te labirynt generation end the central brich will be deleted
	matriz[salida[0]][salida[1]].p=0;//And the gate selected will be deleted too.
	visualizarLab(controls.getObject().position.x,controls.getObject().position.z);//Call to the function to show labyrint in the 2D canvas. 
	$("#tiempo").text("Tiempo: "+((Date.now()-tiempo)/1000)+" s");//Put the value of time requered
	eficiencia=((Date.now()-tiempo)/(laberinto.width*laberinto.height));
	$("#tiempo2").text("Efi: "+eficiencia.toFixed(8)+" s/u2");//Put the value of eficiency
}
function visualizarLab(X,Z){//This function genere the 2D image in canvas
	var x=(X*canvas.width/laberinto.width)/20;//Captamos la posición en el mapa
	var y=(Z*canvas.height/laberinto.height)/20;
	ctx.clearRect(0, 0, canvas.width, canvas.height);//Limpiamos el canvas
	ctx.save()
	var width;
	var height;
	var propX=1.5;//Define the proportion of the wall and the road in eje X
	var propY=1.5;//Define the proportion of the wall and the road in eje Y
	var ajustY=((canvas.height)/laberinto.height)*propY/2;//It made a ajust the labyrint to the canvas
	var ajustX=((canvas.width)/laberinto.width)*propX/2;
	for (var m=laberinto.height-1;0<=m;m--){//We do a loop to scan all the labyrint
		for (var n=laberinto.width-1;0<=n;n--){
			if( matriz[n][m].p==1)ctx.fillStyle='rgba(220,50,0,0.9)';//Give the color to the wall
			else ctx.fillStyle='rgba(50,200,0,0.6)';//Give the color to the road
			
			if (m%2==1)	height=((canvas.height+ajustY)/laberinto.height)*propY;//Give the height of the block if the position is in eje Y odd or pair
			else height=((canvas.height+ajustY)/laberinto.height)*(2-propY);
			
			if (n%2==1)	width=((canvas.width+ajustX)/laberinto.width)*propX;//Give the height of the block if the position is in eje X odd or pair
			else width=((canvas.width+ajustX)/laberinto.width)*(2-propX);
			
			ctx.fillRect(((canvas.width+ajustX)/laberinto.width)*(n-(propX-1)*(n%2)),//Genere the rectangles in the canvas using the previous dates.
			((canvas.height+ajustY)/laberinto.height)*(m-(propY-1)*(m%2)),width,height);
		}
	ctx.restore();
	}
	ctx.save();
	ctx.beginPath();//Draw a circle in the cordenada of the camera yn 3D mapa
	ctx.moveTo(x+canvas.width/2,y+canvas.height/2)
	ctx.arc(x+canvas.width/2,y+canvas.height/2,5000/(laberinto.width+laberinto.height),0,(Math.PI/180)*360,true);
    ctx.fillStyle="rgba(0,100,200,0.5";
	ctx.closePath();
    ctx.fill();
	ctx.restore();
	
}

var camera, scene, renderer;
var geometry, material, mesh,rosa;
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
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 400 );
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x6878fd,390, 450 );
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
		vertex.x += Math.random() * 10 - 2;
		vertex.y += Math.random() * 1;
		vertex.z += Math.random() * 10- 2;
	}
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	var GeometriaRosa=new THREE.PlaneGeometry(8,8,10,10);
	var TexturaRosa=new THREE.ImageUtils.loadTexture("textures/rosa2.png");
//TexturaRosa.wrapS=TexturaRosa.wrapT=THREE.RepeatWrapping;
	//TexturaRosa.repeat.set(0.2,0.2);
	var MaterialRosa=new THREE.MeshBasicMaterial({map:TexturaRosa,wireframe:false,transparent:true});
	 rosa=new THREE.Mesh(GeometriaRosa,MaterialRosa);
	scene.add(rosa);
	rosa.rotateX(-Math.PI/2);
	
	
	
	var TexturaPlano=new THREE.ImageUtils.loadTexture("textures/floor2.jpg");
	TexturaPlano.wrapS=TexturaPlano.wrapT=THREE.RepeatWrapping;
	TexturaPlano.repeat.set(100,100);
	var MaterialPlano=new THREE.MeshBasicMaterial({map:TexturaPlano,side:THREE.DoubleSide});
	var TexturaSkay=new THREE.ImageUtils.loadTexture("textures/skay.jpg");
	scene.background =TexturaSkay;
	//material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
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


function hit(person,wall){
	var position={x:person.x,y:person.z};
	margen=4;
	
	if (wall.x+wall.width>person.x-margen&&person.x+margen>wall.x&&wall.y+wall.height>person.z-margen&&person.z+margen>wall.y){

		if(Math.abs(Math.abs(person.x-wall.x)-wall.width/2)>=Math.abs(Math.abs(person.z-wall.y)-wall.height/2)){
		
			if (person.x>wall.x+wall.width/2){
				
				position.x=wall.x+wall.width+margen;
			}else{

				position.x=wall.x-margen;
			}
		}else{
		
			if (person.z>wall.y+wall.height/2){
				position.y=wall.y+wall.height+margen;
			}else{

				position.y=wall.y-margen;
			}
		}
	}	
	return position;
}

function animate() {
	rosa.position.set(controls.getObject().position.x,controls.getObject().position.y-8,controls.getObject().position.z)
	
	for (var n in muralla){
		var pos = hit(controls.getObject().position,muralla[n]);
		controls.getObject().position.z=pos.y;
		controls.getObject().position.x=pos.x;
		
	}
	requestAnimationFrame( animate );
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		velocity.x -= velocity.x * 5.0 * delta;
		velocity.z -= velocity.z * 5.0 * delta;
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

var Pared=new THREE.Mesh();
//var laberinto3D=[];
var espacioX=20*laberinto.width;
var espacioY=20*laberinto.height;
function choque(){
	muralla=[];
	var y=Math.floor(controls.getObject().position.z/20+laberinto.height/2);
	var x=Math.floor(controls.getObject().position.x/20+laberinto.width/2);
	if (y+2>laberinto.height)y-=(y-laberinto.height+2);
	if (y-2<0)y+=(2-y);
	if (x+2>laberinto.width)x-=(x-laberinto.width+2);
	if (x-2<0)x+=(2-x);
for (var m=y-2;y+2>m;m++){
	
		for (var n=x-2;x+2>n;n++){
			if (matriz[n][m].p==1){
				muralla.push({
					x:(n-laberinto.width/2)*20,
					y:(m-laberinto.height/2)*20,
					height:20,
					width:20
					
				});
			}
		}
	}

}	
function crearLaberinto3D(){
	setInterval('choque()',200);
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			if (matriz[n][m].p==1){
				muralla.push({
					x:(n-laberinto.width/2)*20,
					y:(m-laberinto.height/2)*20,
					height:20,
					width:20
					
				});
			}
		}
	}
	/*
	var loader = new THREE.JSONLoader();
  loader.load( "models/treehouse_logo.js", function( geometry ){
    var material, mesh, i, j, instance;
    material = new THREE.MeshLambertMaterial({ color: 0x55B663 });
    mesh = new THREE.Mesh( geometry, material );
    for ( i = 0; i < 15; i += 3 ) {
      for ( j = 0; j < 15; j += 3 ) {
        instance = mesh.clone();
        instance.position.set( i, 0, j );
        group.add( instance );
      }
    }
  });*/
	
	var Placa= new THREE.CubeGeometry(
				20, // Dimensiones en eje X
				35, // Dimensiones en eje Y
				20 // Dimensiones en eje Z
				);
				var TexturaCubo=new THREE.ImageUtils.loadTexture("textures/muro.jpg");
				
				var Pintura=new THREE.MeshBasicMaterial({map:TexturaCubo,side:THREE.DoubleSide});
				
				Pared =new THREE.Mesh(Placa,Pintura);
					//camera.position.set(20*laberinto.width,10,20*laberinto.height);
	for (var m=0;laberinto.height>m;m++){
		for (var n=0;laberinto.width>n;n++){
			var width;
			var height;
			var propX=1;
			var propY=1;
			var ajustY=((espacioY)/laberinto.height)*propY/2;
			var ajustX=((espacioX)/laberinto.width)*propX/2;
			if( matriz[n][m].p==1){
				 instance = Pared.clone();
				instance.position.set( 20*n-10*(laberinto.width-1), Pared.geometry.parameters.height/2, 20*m-10*(laberinto.height-1) );
				
				scene.add(instance);
				
			}
		}
	}
}
//peson =controls.getObject().position
