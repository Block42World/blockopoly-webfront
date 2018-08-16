CustomFPS3 = function(camera) {

	this.camera = camera;
	this.pointerLockControls = new THREE.PointerLockControls(camera);
	this.pointerLockControls.enabled = false;
	var speed = 10;
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

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

	this.update = function(deltaTime) 
	{

		velocity.y -= 9.8 * 5.0 * deltaTime; // 100.0 = mass

		//shot a ray right down from where player position
		var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 400 );
		raycaster.ray.origin.copy(this.pointerLockControls.getObject().position);
		//raycaster.ray.origin.add(velocity * deltaTime );
		//console.log(raycaster.ray.origin);
		raycaster.ray.origin.y = 300;

		var intersections = raycaster.intersectObjects( [scene], true );
		var onObject = intersections.length > 0;
		

		velocity.x = 0;
		velocity.z = 0;

		if (moveBackward ) {
			velocity.x += Math.cos( Math.PI / 2 - this.pointerLockControls.getYawAngle());
			velocity.z += Math.sin( Math.PI / 2 - this.pointerLockControls.getYawAngle());
		}
		if (moveForward) {
			velocity.x += Math.cos( Math.PI + Math.PI / 2 - this.pointerLockControls.getYawAngle());
			velocity.z += Math.sin( Math.PI + Math.PI / 2 - this.pointerLockControls.getYawAngle());
		}
		if (moveLeft) {
			velocity.x += Math.cos( Math.PI / 2 + Math.PI / 2 - this.pointerLockControls.getYawAngle());
			velocity.z += Math.sin( Math.PI / 2 + Math.PI / 2 - this.pointerLockControls.getYawAngle());
		}
		if (moveRight) {
			velocity.x += Math.cos( -Math.PI / 2 + Math.PI / 2 - this.pointerLockControls.getYawAngle());
			velocity.z += Math.sin( -Math.PI / 2 + Math.PI / 2 - this.pointerLockControls.getYawAngle());
		}

		velocity.x *= speed;
		velocity.z *= speed;

		//if player is not on map, apply velocity and end update
		if(!onObject)
		{
			this.pointerLockControls.getObject().translateY( velocity.y * deltaTime );
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime );
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime );
			console.log("not on map");
			return;
		}

		var groundUserData = intersections[0].object.userData;
		var size = groundUserData.size;

		var pos = {x:Math.floor(this.pointerLockControls.getObject().position.x + velocity.x * deltaTime )
				  ,y:Math.floor(this.pointerLockControls.getObject().position.y)
				  ,z:Math.floor(this.pointerLockControls.getObject().position.z + velocity.z * deltaTime )};
		//console.log(intersections[0]);
		pos.x -= groundUserData.position.x;
		pos.y -= groundUserData.position.z+2;
		pos.z -= groundUserData.position.y+1;

		//if player is not on current vox field, apply XZ velocity and end update
		if(pos.x >= groundUserData.size.x || pos.z >= groundUserData.size.y  ||pos.x < 0 || pos.z < 0)
		{
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime );
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime );
			return;
		}

		//if the block below player is not empty, stop falling
		if(typeof groundUserData.vectors[pos.x][pos.z] == "undefined" ||
		   typeof groundUserData.vectors[pos.x][pos.z][pos.y-1] == "undefined" || 
				  groundUserData.vectors[pos.x][pos.z][pos.y-1].colorIndex==0)
		{
			console.log("not on ground");
		}
		else
		{
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}
		this.pointerLockControls.getObject().translateY( velocity.y * deltaTime );

		//if the block on player is not empty, player can go
		if(typeof groundUserData.vectors[pos.x][pos.z] == "undefined" ||
		   typeof groundUserData.vectors[pos.x][pos.z][pos.y] == "undefined" || 
				  groundUserData.vectors[pos.x][pos.z][pos.y].colorIndex==0)
		{
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime );
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime );
		}
		else
		{
			console.log(groundUserData.vectors[pos.x][pos.z][pos.y]);
		}
	};

	var isAir = function(x, y, z)
	{
		
	}

	this.isBlock = function(x, y, z)
	{
		for (var i = 0; i < Land.lands.length; i++) 
		{
			var land = Land.lands[i];
			if(	   land._x<=x && land._x+land._w >=x 
				&& land._y<=z && land._y+land._h >=z )
			{
				return land.vectors[x][y][z].colorIndex != 0;
			}
		}
		return false;
	}

	var onKeyDown = function ( event )
	{
		switch ( event.keyCode ) 
		{
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
				if ( canJump === true ) velocity.y += 10;
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
			



	var pointerlockchange = function ( event ) 
	{
	
		var element = document.body;
		if ( document.pointerLockElement === element 
		|| document.mozPointerLockElement === element 
		|| document.webkitPointerLockElement === element ) 
		{
		//when enter pointer-lock mode

		} else {

		//when exit pointer-lock mode, change to orbit-control mode
			$("#orbit-control").prop("checked", true).trigger("click");;
		}
	};
	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

};
