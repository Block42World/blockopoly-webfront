/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;
	var myCamera = camera;
	//camera.rotation.set( 0, 0, 0 );
	console.log("sdfsd");
	
	var pitchObject = camera;

	var yawObject = new THREE.Object3D();

	scene.add( yawObject);

	var prevPos = new THREE.Vector3();
	var prevRot = new THREE.Euler();

	var PI_2 = Math.PI / 2;
	
	var onMouseMove = function ( event ) {
		if ( scope.enabled === false ) 
			return;
		
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		
		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		//pitchObject.rotation.y = yawObject.rotation.y;
	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	this.enabled = false;

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );
	};

	this.reset = function (isActive) 
	{

		if(isActive)
		{
			//collecting current camera data
			prevPos.copy(pitchObject.position);
			prevRot.copy(pitchObject.rotation);

			THREE.SceneUtils.attach( pitchObject, scene, yawObject );

			pitchObject.rotation.set( 0, 0, 0 );
			yawObject.rotation.set(   0, 0, 0 );
			pitchObject.position.set( 0, 0, 0 );
			yawObject.position.set(   0, 9, 0 );


		}
		else if(pitchObject.parent == yawObject)//if it was active before
		{
			THREE.SceneUtils.detach( pitchObject, yawObject, scene );
			//put camera back
			pitchObject.position.copy(prevPos);
			pitchObject.rotation.copy(prevRot);

		}

	};

	this.getObject = function () 
	{
		return yawObject;
	};

	this.getDirection = function() 
	{

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) 
		{

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();
	
};
