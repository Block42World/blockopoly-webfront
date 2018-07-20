//Author: Jim
//this code is for basic three.js set up
var container, stats;
var controls;
var camera, scene, renderer;
var lastTime = 0;
var gridHelper;

var ground;
var params = { opacity: 0.5 };
var deltatime;

var hasCityLoaded = false;

class ThreejsUtility {
  static init() {
    // build up the threejs environment
    container = document.createElement("div");
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      2000
	);
	camera.position.set(538,54,718);

    //controls = new THREE.OrbitControls( camera );
	controls = new THREE.FirstPersonControls(camera);
	controls.target = new THREE.Vector3(542,54,710);
    controls.movementSpeed = 20;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;

	var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    gridHelper = new THREE.GridHelper(100, 22);
    //scene.add( gridHelper );

    //renderer = new THREE.CanvasRenderer();
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    //init the outline feature
    initOutline();

    ThreejsUtility.animate();
  }

  static animate() {
    //Update User Controls
	var time = performance.now() / 1000;
	deltatime = time-lastTime;
	
    controls.update(deltatime); //Update our controls using a deltatime

    //
    stats.update();
    ThreejsUtility.render();
	requestAnimationFrame(ThreejsUtility.animate);
	lastTime = time;
  }

  static render() {
    //since i used the outline feature, i call the composer to update
    composer.render();
    //renderer.render( scene, camera );
  }
}

window.onresize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
