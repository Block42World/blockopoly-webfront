CustomFPS3 = function(camera) {

	this.camera = camera;
	this.pointerLockControls = new THREE.PointerLockControls(camera);
	this.pointerLockControls.enabled = false;
	scene.add( this.pointerLockControls.getObject() );

	this.SetActive = function(isActive)
	{
		this.pointerLockControls.enabled = isActive;

		if(isActive)
		{
			//this.pointerLockControls.reset();
			var element = document.body;
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}
	}

	this.update = function(deltaTime) {

		this.resetPlayer();
		this.keyboardControls();
		this.applyPhysics(deltaTime*1000);
		this.updateCamera();
	};


	this.motion = {
		airborne : false,
		position : new THREE.Vector3(), velocity : new THREE.Vector3(),
		rotation : new THREE.Vector2(), spinning : new THREE.Vector2()
	};
	this.motion.position.y = -150;



	// game systems code
	this.resetPlayer = function() {
		if( this.motion.position.y < -123 ) {
			this.motion.position.set( -2, 7.7, 25 );
			this.motion.velocity.multiplyScalar( 0 );
		}
	};

	this.keysPressed = {};
	this.keyboardControls = (function() {
		var keys = { SP : 32, W : 87, A : 65, S : 83, D : 68, UP : 38, LT : 37, DN : 40, RT : 39 };
		var keysPressed = {};
		(function( watchedKeyCodes ) {
			var handler = function( down ) {
				return function( e ) {
					var index = watchedKeyCodes.indexOf( e.keyCode );
					if( index >= 0 ) {
						keysPressed[watchedKeyCodes[index]] = down; e.preventDefault();
					}
				
				};
			};
			window.addEventListener( "keydown", handler( true ), false );
			window.addEventListener( "keyup", handler( false ), false );
		})([
			keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
		]);
		var forward = new THREE.Vector3();
		var sideways = new THREE.Vector3();
		return function() {

			if( !this.motion.airborne ) 
			{
				// look around
				var sx = keysPressed[keys.UP] ? 0.03 : ( keysPressed[keys.DN] ? -0.03 : 0 );
				var sy = keysPressed[keys.LT] ? 0.03 : ( keysPressed[keys.RT] ? -0.03 : 0 );
				if( Math.abs( sx ) >= Math.abs( this.motion.spinning.x ) ) this.motion.spinning.x = sx;
				if( Math.abs( sy ) >= Math.abs( this.motion.spinning.y ) ) this.motion.spinning.y = sy;
				// move around
				forward.set( Math.sin( this.motion.rotation.y ), 0, Math.cos( this.motion.rotation.y ) );
				sideways.set( forward.z, 0, -forward.x );
				forward.multiplyScalar( keysPressed[keys.W] ? -0.1 : (keysPressed[keys.S] ? 0.1 : 0));
				sideways.multiplyScalar( keysPressed[keys.A] ? -0.1 : (keysPressed[keys.D] ? 0.1 : 0));
				var combined = forward.add( sideways );
				if( Math.abs( combined.x ) >= Math.abs( this.motion.velocity.x ) ) this.motion.velocity.x = combined.x;
				if( Math.abs( combined.y ) >= Math.abs( this.motion.velocity.y ) ) this.motion.velocity.y = combined.y;
				if( Math.abs( combined.z ) >= Math.abs( this.motion.velocity.z ) ) this.motion.velocity.z = combined.z;
				//jump
 				var vy = keysPressed[keys.SP] ? 0.7 : 0;
 				this.motion.velocity.y += vy;
			}

		};
	})();


	this.applyPhysics = (function() {
		var timeStep = 5;
		var timeLeft = timeStep + 1;
		var birdsEye = 100;
		var kneeDeep = 0.4;
		var raycaster = new THREE.Raycaster();
		raycaster.ray.direction.set( 0, -1, 0 );
		var angles = new THREE.Vector2();
		var displacement = new THREE.Vector3();
		return function( dt ) {
			var platform = scene.getObjectByName( "platform", true );
			if( true ) {

				timeLeft += dt;
				// run several fixed-step iterations to approximate varying-step
				dt = 5;
				//console.log(timeLeft);
				while( timeLeft >= dt ) {
					var time = 0.3;
					damping = 0.93;
					gravity = 0.01;
					tau = 2 * Math.PI;
					raycaster.ray.origin.copy( this.motion.position );
					raycaster.ray.origin.y += birdsEye;
					var hits = raycaster.intersectObjects( [ scene ], true );
					this.motion.airborne = true;
					// are we above, or at most knee deep in, the platform?
					if( ( hits.length > 0 ) && ( hits[0].face.normal.y > 0 ) ) {
						var actualHeight = hits[0].distance - birdsEye;
						// collision: stick to the surface if landing on it
						if( ( this.motion.velocity.y <= 0 ) && ( Math.abs( actualHeight ) < kneeDeep ) ) {
							this.motion.position.y -= actualHeight;
							this.motion.velocity.y = 0;
							this.motion.airborne = false;
						}
					}
					if( this.motion.airborne ) this.motion.velocity.y -= gravity;
					angles.copy( this.motion.spinning ).multiplyScalar( time );
					if( !this.motion.airborne ) this.motion.spinning.multiplyScalar( damping );
					displacement.copy( this.motion.velocity ).multiplyScalar( time );
					if( !this.motion.airborne ) this.motion.velocity.multiplyScalar( damping );
					this.motion.rotation.add( angles );
					this.motion.position.add( displacement );
					// limit the tilt at ±0.4 radians
					this.motion.rotation.x = Math.max( -0.4, Math.min ( +0.4, this.motion.rotation.x ) );
					// wrap horizontal rotation to 0...2π
					this.motion.rotation.y += tau; this.motion.rotation.y %= tau;
					timeLeft -= dt;
					//console.log(this.motion.velocity);
				}
			}
		};
	})();

	this.updateCamera = (function() {
		return function() {
			this.camera.position.copy( this.motion.position );
			this.camera.position.y += 3.0;
		};
	})();

};
