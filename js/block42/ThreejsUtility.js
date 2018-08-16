//Author: Jim
//this code is for basic three.js set up
var container, stats;
var camera, scene, renderer;
var lastTime = 0;
var gridHelper;

var ground;
var params = { opacity: 0.5 };
var deltatime;

var sky, sunSphere;
var distance = 400000;
var inclination = 0;

class ThreejsUtility {
	static init() {
		// build up the threejs environment
		container = document.createElement("div");
		document.body.appendChild(container);

		//Adding the scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color("skyblue");
		scene.fog = new THREE.FogExp2("white", 0.0009);

		camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			2000
		);
		camera.position.set(145, 716, 1050); // Set our position to look down on environment

		//

		var ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
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

		//stats = new Stats();
		//container.appendChild(stats.dom);

		//init the outline feature
		initOutline();

		ThreejsUtility.InitSky();

		ThreejsUtility.animate();
	}

	static animate() {
		//Update User Controls
		var time = performance.now() / 1000;
		deltatime = time - lastTime;

		ThreejsUtility.UpdateSky();

		if (player ) {     //If our player exists

			if (Index.worldLoaded && !player.isActive) {    //And our world is loaded
				player.SetPlayerActive(true); //Set our player to active
			}


			if (player.isActive) {
				player.Update(deltatime);//Update our controls using a deltatime
			}
		}

		//
		//stats.update();
		ThreejsUtility.render();
		requestAnimationFrame(ThreejsUtility.animate);
		lastTime = time;
	}

	static render() {
		//since i used the outline feature, i call the composer to update
		composer.render();
		//renderer.render( scene, camera );
	}

	//#region Skybox

	static InitSky() {
		//Add Sky
		sky = new THREE.Sky();
		sky.scale.setScalar(450000);
		scene.add(sky);

		// Add Sun Helper
		sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry(20000, 16, 8),
			new THREE.MeshBasicMaterial({ color: 0xffffff })
		);
		sunSphere.position.y = -700000;
		sunSphere.visible = false;
		scene.add(sunSphere);
	}

	static UpdateSky() {
		var uniforms = sky.material.uniforms;
		uniforms.turbidity.value = 10;
		uniforms.rayleigh.value = 0.65;
		uniforms.luminance.value = 0.8;
		uniforms.mieCoefficient.value = 0.0;
		uniforms.mieDirectionalG.value = 0.8;
		var theta = Math.PI * (inclination - 0.5);
		var phi = 2 * Math.PI * (0.25 - 0.5);
		sunSphere.position.x = 40000 * Math.cos(phi);
		sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
		sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
		sunSphere.visible = true;
		uniforms.sunPosition.value.copy(sunSphere.position);
	}

	//#endregion
}

window.onresize = function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};
