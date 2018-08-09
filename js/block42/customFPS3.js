CustomFPS3 = function(camera) {

	this.camera = camera;
	this.pointerLockControls = new THREE.PointerLockControls(camera);
	this.pointerLockControls.enabled = false;
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var canJump = false;

	var velocity = new THREE.Vector3();
	var direction = new THREE.Vector3();

	this.SetActive = function(isActive)
	{
		this.pointerLockControls.enabled = isActive;
		this.pointerLockControls.reset(isActive);
		if(isActive)
		{
			var element = document.body;
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}
	}

	this.update = function(deltaTime) {

		var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		raycaster.ray.origin.copy( this.pointerLockControls.getObject().position );
		//raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects( [scene], true );

		var onObject = intersections.length > 0;
		console.log(intersections);

		velocity.y -= 9.8 * 5.0 * deltaTime; // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveLeft ) - Number( moveRight );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) 
			velocity.z = -direction.z * 1000.0 * deltaTime;
		else
			velocity.z = 0;

		if ( moveLeft || moveRight ) 
			velocity.x = -direction.x * 1000.0 * deltaTime;
		else
			velocity.x = 0;

		if ( onObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}

		this.pointerLockControls.getObject().translateY( velocity.y * deltaTime );
	

		if ( this.pointerLockControls.getObject().position.y < 3 ) {
			velocity.y = 0;
			this.pointerLockControls.getObject().position.y = 3;
			canJump = true;
		}


		var vel = new THREE.Vector3().copy(velocity);
		var position = this.pointerLockControls.getObject().localToWorld(vel);
		position.y = 0;
		position.normalize();

		var raycaster2 = new THREE.Raycaster( this.pointerLockControls.getObject().position, position, 0, 5 );
		//raycaster2.ray.origin.y -= 9;
		var infrontofObject = raycaster2.intersectObjects( [scene], true ).length > 0;
		//console.log(controls.getObject());
		if(!infrontofObject)
		{
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime );
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime );
		}
							

	};





	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; 
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 50;
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
};
