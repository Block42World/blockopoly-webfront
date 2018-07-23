//#region Enum

ControlTypeEnum = {
	Flight: 1,
	FPS: 2,
	Orbit: 3
};

//#endregion

Block42.Player = function(cameraObject, controllerType) {
	//#region Class Variables
	this.cameraObject = cameraObject;
	this.controlType = controllerType;

	//Controls : We have a controls instance for each of these so we can easily set values without worrying if we are editing the correct type.
	this.flightControls;
	this.fpsControls;
	this.orbitControls;

	//#endregion

	//#region General Methods

	this.Initialize = function() {
		this.InitializeControlType(this.controlType);
	};

	this.Update = function(deltaTime) {
		this.UpdateController(deltaTime);
	};

	//#endregion

	//#region Controller Methods

	//#region Set Control

	this.SetControlType = function(controlType) {
		//Set our control type
		this.controlType = controllerType;
		switch (this.controlType) {
			default:
			case ControlTypeEnum.Flight:
				this.flightControls.freeze = false;
				this.orbitControls.enabled = false;
				break;
			case ControlTypeEnum.FPS:
				//Do nothing since we dont have it yet
				this.flightControls.freeze = true;
				this.orbitControls.enabled = false;
				break;
			case ControlTypeEnum.Orbit:
				this.flightControls.freeze = true;
				this.orbitControls.enabled = true;
				break;
		}
	};

	this.IncrementControlType = function() {
		var tempControlType = this.controlType;
		tempControlType = (tempControlType % 3) + 1; //Since our enum is in the value range of 1-3 we can simply modulo our number to get its value plus 1
		SetControlType(tempControlType);
	};

	//#endregion

	//#region Initialize Control Types

	this.InitializeControlType = function(controllerType) {
		//Initialize all our control types
		this.InitializeFlightControls();
		this.InitializeFPSControls();
		this.InitializeOrbitControls();

		this.SetControlType(controllerType);
	};

	this.InitializeFlightControls = function() {
		this.flightControls = new THREE.FirstPersonControls(this.cameraObject);
		this.flightControls.target = new THREE.Vector3(661, 65, 824);
		this.flightControls.movementSpeed = 20;
		this.flightControls.lookSpeed = 0.05;
		this.flightControls.lookVertical = true;
		this.flightControls.update(0.000001);
	};

	this.InitializeOrbitControls = function() {
		this.orbitControls = new THREE.OrbitControls(this.cameraObject);
		this.orbitControls.update();
	};

	this.InitializeFPSControls = function() {
		//Not Implemented Yet
	};

	//#endregion

	//#region Update Controller

	this.UpdateController = function(deltaTime) {
		switch (this.controlType) {
			default:
			case ControlTypeEnum.Flight:
				this.flightControls.update(deltaTime);
				break;
			case ControlTypeEnum.FPS:
				//Do nothing since we dont have it yet
				break;
			case ControlTypeEnum.Orbit:
				this.orbitControls.update();
				break;
		}
	};

	//#endregion

	//#endregion

	//#region Hide Show Land

	this.GetLandsAroundPlayer = function() {
		//Not implemented Yet. Need a good way to use Land.js with this too. Get all lands within the player area
		//Get all lands around player using 'this.cameraObject.position' as player position;
	};

	//#endregion
};
