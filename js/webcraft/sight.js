// this class managed to display the cross in the middle of the screen and the #instructions
//author: Jim Chen
class Sight
{	
	//initialization
	static init()
	{
		//get the html element
		var blocker = document.getElementById( 'blocker' );//the dark background
		var instructions = document.getElementById( 'instructions' );//the "Click to play" laber
		var playBtn = document.getElementById( 'playBtn' );//vertial
		//this two div element is the crosshair on the center of screen
		var sight1 = document.getElementById( 'sight1' );//horiztal
		var sight2 = document.getElementById( 'sight2' );//vertial

		var FullScreenBtn = document.getElementById( 'FullScreen' );//Full Screen Button
		
		//hide the crosshair
		blocker.style.display = 'block';
		sight1.style.display = 'none';
		sight2.style.display = 'none';
		// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

		//check if brower support Pointer Lock API
		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		//appear warning and return if brower not support Pointer Lock API
		if ( !havePointerLock ) 
		{
			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
			return null;
		}

		var element = document.body;
		//create pointerlockchange event
		var pointerlockchange = function ( event ) 
		{
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) 
			{//hide the instructions and show the crosshair
				blocker.style.display = 'none';
				sight1.style.display = 'block';
				sight2.style.display = 'block';
				isPlaying = true;
				
			} else {//show the instructions and hide the crosshair
				blocker.style.display = 'block';
				sight1.style.display = 'none';
				sight2.style.display = 'none';
				instructions.style.display = '';
				isPlaying = false;
			}
			console.log(isPlaying);
		};

		//create pointerlockerror event
		var pointerlockerror = function ( event ) 
		{
			instructions.style.display = '';

		};

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		playBtn.addEventListener( 'click', function ( event ) 
		{
			instructions.style.display = 'none';
			isPlaying = true;
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();

		}, false );

		FullScreenBtn.addEventListener( 'click', function ( event ) 
		{
			FullScreen.requestFullScreen();
		}, false );
	}
}
