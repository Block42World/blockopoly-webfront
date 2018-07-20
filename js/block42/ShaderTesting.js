var mesh;
var renderer;
var scene;
var camera;
var containter, stats;

var clock = new THREE.Clock();

function Initialize() {
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x3fd1b5);
  scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  PopulateScene();

  //Then reset our inner html and remove the please wait text
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  //Create a new stats window to monitor fps
  stats = new Stats();
  container.appendChild(stats.dom);

  //Subscribe to window change event
  window.addEventListener('resize',OnWindowResize,false);
}

function PopulateScene() {
  var light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  var light1 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light1);

  var geometry = new THREE.CubeGeometry(100, 100, 100);
  var material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, -1000);

  scene.add(mesh);
}

function OnWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);
}

function Update() {
  mesh.rotation.x += 0.1;
  mesh.rotation.y += 0.1;
}

function Render() {
  Update();

  renderer.render(scene, camera);
  requestAnimationFrame(Render);
}
