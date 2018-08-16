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
	var collisionRadius = 0.1;// NEVER set this to bigger than 0.5, otherwise player will go though walls. Recommend : 0.1

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
		//shot a ray right down from where player position
		var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 1000 );
		raycaster.ray.origin.copy(this.pointerLockControls.getObject().position);
		//raycaster.ray.origin.add(velocity * deltaTime );
		//console.log(raycaster.ray.origin);
		raycaster.ray.origin.y += 3;

		var intersections = raycaster.intersectObjects( [scene], true );
		var onObject = intersections.length > 0;
		
		//to make sure player won't falling more then 1 block every frame
		if((velocity.y - 9.8 * 5.0 * deltaTime)* deltaTime > -1)
		{
			velocity.y -= 9.8 * 5.0 * deltaTime;
		}

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

		//normalise the XZ only
		var velY = velocity.y;
		velocity.y = 0;
		velocity = velocity.normalize();
		velocity.x *= speed;
		velocity.z *= speed;
		velocity.y = velY;


		if(this.pointerLockControls.getObject().position.y < 1)
		{
			velocity.y = Math.max( 0, velocity.y );
			this.pointerLockControls.getObject().position.y = 1;
		}

		//if player is not on map, apply velocity and end update
		if(!onObject)
		{
			//shoot the ray from sky, if it hit anything, teleport to there.
			raycaster.ray.origin.y = 200;
			intersections = raycaster.intersectObjects( [scene], true );
			if(intersections.length > 0)
			{
				this.pointerLockControls.getObject().position.y = intersections[0].point.y +5;
			}
			else
			this.pointerLockControls.getObject().translateY( velocity.y * deltaTime);
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime);
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime);
			console.log("not on map");
			return;
		}

		var groundUserData = intersections[0].object.userData;
		var size = groundUserData.size;

		//console.log(intersections[0]);
		var lastPosX = this.pointerLockControls.getObject().position.x - groundUserData.position.x;
		var lastPosY = this.pointerLockControls.getObject().position.y - groundUserData.position.z-2;
		var lastPosZ = this.pointerLockControls.getObject().position.z - groundUserData.position.y;

		var newPosX = lastPosX + velocity.x * deltaTime;
		var newposY = lastPosY + velocity.y * deltaTime;
		var newposZ = lastPosZ + velocity.z * deltaTime;




		//WARNING: since MagicaVoxel is Z-UP, so the the order is X, Z, Y 
		var isAir = function(x, z, y)
		{
			x = Math.floor(x);
			y = Math.floor(y);
			z = Math.floor(z);
			return 	typeof groundUserData.vectors[x] == "undefined" ||
					typeof groundUserData.vectors[x][z] == "undefined" ||
			   		typeof groundUserData.vectors[x][z][y] == "undefined";
		}

		//if player standing in a block, rise up.
		if(!isAir(lastPosX, lastPosZ, lastPosY))
		{
			this.pointerLockControls.getObject().position.y ++;
			console.log("the Dark Night Rise");
			return;
		}

		//if player is not on current vox field, apply XZ velocity and end update
		if(newPosX >= groundUserData.size.x || newposZ >= groundUserData.size.y  ||newPosX < 0 || newposZ < 0)
		{
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime);
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime);
			return;
		}




		//if the block below player is not empty, stop falling
		if(!isAir(lastPosX, lastPosZ, lastPosY-1) && !isAir(newPosX, newposZ, lastPosY-1))
		{
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}else{console.log("not on ground" + velocity.y);}


		//if the block on player is not empty, player can go
		if(isAir(lastPosX+collisionRadius, newposZ+collisionRadius, newposY) && isAir(lastPosX-collisionRadius, newposZ-collisionRadius, newposY))
		{
			this.pointerLockControls.getObject().translateZ( velocity.z * deltaTime);
		}

		if(isAir(newPosX+collisionRadius, lastPosZ+collisionRadius, newposY) && isAir(newPosX-collisionRadius, lastPosZ-collisionRadius, newposY))
		{
			this.pointerLockControls.getObject().translateX( velocity.x * deltaTime);
		}

		this.pointerLockControls.getObject().translateY( velocity.y * deltaTime);
	};





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
