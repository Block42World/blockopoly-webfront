//#region Enum

ControlTypeEnum = {
	Flight: 1,
	FPS: 2,
	Orbit: 3
};

//#endregion

function Player(cameraObject, controllerType) {
	this.cameraObject = cameraObject;
	this.controlType = controllerType;

	this.flightControls;
	this.fpsControls;
	this.orbitControls;

	this.isActive = false;
	
	this.Listen();


	//for lerp
	this.isLerping = false;
	this.myTargetCameraPos = new THREE.Vector3();
	this.lerpTargetPos = new THREE.Vector3();
	this.lerpSpeed = 1.2;

}

//#region Main Methods

Player.prototype.Initialize = function() {
	this.InitializeControlType(this.controlType);
};

Player.prototype.Update = function(deltatime) {
	this.UpdateController(deltatime);
	
	this.UpdateLerp(deltatime);

};

//#endregion

Player.prototype.UpdateLerp = function(deltatime) 
{
	if(this.isLerping)
	{
		//lerp camera position and target position
		if(this.orbitControls.target.distanceTo(this.lerpTargetPos) > 1)
		{
			this.cameraObject.position.lerp(this.myTargetCameraPos, this.lerpSpeed*deltatime);
			this.orbitControls.target.lerp(this.lerpTargetPos, this.lerpSpeed*deltatime);
		}

		//lerp dolly 
		var offset = Math.abs(this.orbitControls.getSphericalRadius() -400);

		if(Math.abs(this.orbitControls.getSphericalRadius() -400)>1)
		{
			if(this.orbitControls.getSphericalRadius() >400)
				this.orbitControls.dollySet(1-(1+offset*0.02)*deltatime);
			else
				this.orbitControls.dollySet(1+(1+offset*0.02)*deltatime);
		}

		this.orbitControls.update();


		if(this.orbitControls.target.distanceTo(this.lerpTargetPos) < 2 && Math.abs(this.orbitControls.getSphericalRadius() -400)<10)
		{
			this.isLerping = false;
		}
	}
}

//#region Input

Player.prototype.SetPlayerActive = function(bool) {
	this.isActive = bool;

	if (this.isActive) {
		//Show swap controls
		$("#control-toggle-group").show();
		this.SetControlType(this.controlType);
	} else {
		//Hide swap controls
		$("#control-toggle-group").hide();

		this.flightControls.freeze = false;
		this.orbitControls.enabled = false;
	}
};

//#endregion

//#region Set Control Type

Player.prototype.SetControlType = function(controlType) {
	//Set our control type
	this.controlType = controlType;
	switch (this.controlType) {
		default:
		case ControlTypeEnum.Flight:
			this.flightControls.freeze = false;
			this.orbitControls.enabled = false;
			this.fpsControl.SetActive(false);
			break;
		case ControlTypeEnum.FPS:
			//Do nothing since we dont have it yet
			this.flightControls.freeze = true;
			this.orbitControls.enabled = false;
			this.fpsControl.SetActive(true);
			break;
		case ControlTypeEnum.Orbit:
			this.flightControls.freeze = true;
			this.orbitControls.enabled = true;
			this.fpsControl.SetActive(false);
			break;
	}
};

Player.prototype.IncrementControlType = function() {
	var tempControlType = this.controlType;
	tempControlType = (tempControlType % 3) + 1; //Since our enum is in the value range of 1-3 we can simply modulo our number to get its value plus 1
	this.SetControlType(tempControlType);

};

Player.prototype.DecrementControlType = function() {
	var tempControlType = this.controlType;
	tempControlType = tempControlType - 1;
	tempControlType =
		tempControlType <= 0 ? ControlTypeEnum.Orbit : tempControlType;
	this.SetControlType(tempControlType);
};

//#endregion

//#region Initialize Control Types

Player.prototype.InitializeControlType = function(controllerType) {
	//Initialize all our control types
	this.InitializeFlightControls();
	this.InitializeFPSControls();
	this.InitializeOrbitControls();
	this.SetControlType(controllerType);
};

Player.prototype.InitializeFlightControls = function() {
	this.flightControls = new THREE.FirstPersonControls(this.cameraObject);
	this.flightControls.target = new THREE.Vector3(206, 648, 1009);
	this.flightControls.movementSpeed = 120;
	this.flightControls.lookSpeed = 0.1;
	this.flightControls.lookVertical = true;
	this.flightControls.update(0.000001);
};

Player.prototype.InitializeOrbitControls = function() {
	this.orbitControls = new THREE.OrbitControls(this.cameraObject);
	this.orbitControls.panMinHeight = 5;
	this.orbitControls.maxDistance = 1000;

	//Set our initial position
	this.cameraObject.position.set(210, 479, 1039);
	this.orbitControls.target.set(404, 300, 900);

	this.orbitControls.maxPolarAngle = Math.PI / 2;
	this.orbitControls.update();
};

Player.prototype.InitializeFPSControls = function() {
	//Not Implemented Yet
	this.fpsControl = new CustomFPS3(this.cameraObject);

};

//#endregion

//#region Update Controller

Player.prototype.UpdateController = function(deltaTime) {
	
	if (!this.isActive) {
		return;
	}

	switch (this.controlType) {
		default:
		case ControlTypeEnum.Flight:
			this.flightControls.update(deltaTime);
			break;
		case ControlTypeEnum.FPS:
			this.fpsControl.update(deltaTime);
			break;
		case ControlTypeEnum.Orbit:
			//this.orbitControls.update();
			break;
	}



};

//#endregion

//#region Land Methods

Player.prototype.GetLandsAroundPlayer = function() {
	//Not implemented Yet. Need a good way to use Land.js with this too. Get all lands within the player area
	//Get all lands around player using 'this.cameraObject.position' as player position;
};

//#endregion

//#region click event

Player.prototype.Listen = function() {
	container.addEventListener(
		"click",//"dblclick",
		function(e) {
			if (!this.isActive) {return;}
			console.log("click");

			//this is the highlighted obj
			//console.log(outlinePass.selectedObjects[0].userData);
			ShowInfoBox(outlinePass.selectedObjects[0].userData.land);

			//Set our camera to orbit camera for preview
			this.SetControlType(ControlTypeEnum.Orbit);

			//Would this be better to do the raycasting logic itself or should we jsut do as above and use the outline pass data
			this.FocusCameraOnObject(
				outlinePass.selectedObjects[0],
				new THREE.Vector3(45, 45, 45),
				20
			);
			
		}.bind(this),
		false
	);
};

//#endregion

//#region Focus Camera

Player.prototype.FocusCameraOnObject = function(
	object,
	eulerRotation,
	distance
) {
	//Calculate the centroid of our buildings bounding box for camera positioning
	object.geometry.computeBoundingBox();
	var boundingBox = object.geometry.boundingBox;
	var position = new THREE.Vector3();
	position.subVectors(boundingBox.max, boundingBox.min);
	position.multiplyScalar(0.5);
	position.add(boundingBox.min);
	position.applyMatrix4(object.matrixWorld);

	this.FocusCameraOnPosition(position, eulerRotation, distance); //Focus our camera at that position
};

Player.prototype.FocusCameraOnPosition = function(
	position,
	eulerRotation,
	distance
) {
	if (!this.isActive) {
		return;
	}

	//Calculate the direction Vector from our euler rotation
	var directionVector = new THREE.Vector3();
	directionVector.x = Math.cos(eulerRotation.y) * Math.cos(eulerRotation.x);
	directionVector.y = Math.sin(eulerRotation.y) * Math.cos(eulerRotation.x);
	directionVector.z = Math.sin(eulerRotation.x);
	directionVector.normalize();

	//Add our direction vector onto our rotation vectors
	var targetCameraPos = new THREE.Vector3();
	targetCameraPos.add(position);
	targetCameraPos.addScaledVector(directionVector, distance);

	/*
	switch (this.controlType) {
		default:
		case ControlTypeEnum.Flight:
			this.cameraObject.position.copy(targetCameraPos);
			var vector = new THREE.Vector3().copy(eulerRotation);
			this.flightControls.lookDirectionSet(vector.negate());
			this.flightControls.update(0.0000001);
			
			break;

		case ControlTypeEnum.FPS:
			//Do nothing since we dont have it yet
			break;

		case ControlTypeEnum.Orbit:
			this.orbitControls.dollySet(distance);
			this.orbitControls.target.copy(position);
			//console.log(targetCameraPos);
			this.cameraObject.position.copy(targetCameraPos);
			this.orbitControls.update();
			console.log(this.orbitControls.target);
			break;
	}
	*/
	
	this.isLerping = true;
	this.myTargetCameraPos.copy(targetCameraPos);
	this.lerpTargetPos.copy(position);


	
};

//#endregion
