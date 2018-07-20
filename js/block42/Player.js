class Player
{
	static initFly()
	{
	    controls = new THREE.FirstPersonControls(camera);
		controls.target = new THREE.Vector3(661, 65, 824);
		controls.movementSpeed = 20;
		controls.lookSpeed = 0.05;
		controls.lookVertical = true;
		controls.update(0);
	}

	static initFPS()
	{

	}

	static initOrbitControl()
	{
		controls = new THREE.OrbitControls( camera );
	}
}