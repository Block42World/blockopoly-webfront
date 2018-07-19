


//Author: Jim
//this code is for basic three.js set up 
var container, stats;
var controls;
var camera, scene, renderer;

var gridHelper;

var ground;
var params = { opacity: 0.5 };

class ThreejsUtility
{
	static init() 
	{

		// build up the threejs environment
		container = document.createElement( 'div' );
		document.body.appendChild( container );

		scene = new THREE.Scene();
		scene.background = new THREE.Color('skyblue');
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
		
		controls = new THREE.OrbitControls( camera );

		var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
		scene.add( ambientLight );

		var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
		camera.add( pointLight );
		scene.add( camera );
	
		gridHelper = new THREE.GridHelper( 100, 22 );
		//scene.add( gridHelper );


		//renderer = new THREE.CanvasRenderer();
		renderer = new THREE.WebGLRenderer();
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		stats = new Stats();
		container.appendChild( stats.dom );

		//init the outline feature
		initOutline();

		ThreejsUtility.animate();
	}

	static animate() 
	{
		
		stats.update();
		ThreejsUtility.render();
		requestAnimationFrame( ThreejsUtility.animate );
	}

	static render() 
	{
		//since i used the outline feature, i call the composer to update
		composer.render();
		//renderer.render( scene, camera );
	}
}




window.onresize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};
