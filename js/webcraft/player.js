// ==========================================
// Player
//
// This class contains the code that manages the local player.
// ==========================================

// Mouse event enumeration
MOUSE = {};
MOUSE.DOWN = 1;
MOUSE.UP = 2;
MOUSE.MOVE = 3;

// Constructor()
//
// Creates a new local player manager.

function Player()
{	
}

// setWorld( world )
//
// Assign the local player to a world.

Player.prototype.setWorld = function( world )
{
	this.world = world;
	this.world.localPlayer = this;
	this.pos = world.spawnPoint;
	this.velocity = new Vector( 0, 0, 0 );
	this.angles = [ 0, Math.PI, 0 ];
	this.falling = false;
	this.keys = {};
	this.buildMaterial = BLOCK.DIRT;
	this.eventHandlers = {};
	this.targetPitch = 0;
	this.targetYaw = 0;
	this.speed = 10;
	this.isFlyingMode = false;
}

// setClient( client )
//
// Assign the local player to a socket client.

Player.prototype.setClient = function( client )
{
	this.client = client;
}

// setInputCanvas( id )
//
// Set the canvas the renderer uses for some input operations.

Player.prototype.setInputCanvas = function( id )
{
	var canvas = this.canvas = document.getElementById( id );

	var t = this;
	console.log(isPlaying);

	document.addEventListener("click",  function( e ) { t.onMouseEvent( window.innerWidth/2, window.innerHeight/2, MOUSE.UP, e.which == 3 ); });

	document.onkeydown = function( e ) { if ( e.target.tagName != "INPUT" ) { t.onKeyEvent( e.keyCode, true ); return false; } }
	document.onkeyup = function( e ) { if ( e.target.tagName != "INPUT" ) { t.onKeyEvent( e.keyCode, false ); return false; } }
	//canvas.onmousedown = function( e ) { t.onMouseEvent( e.clientX, e.clientY, MOUSE.DOWN, e.which == 3 ); return false; }
	//canvas.onmouseup = function( e ) { t.onMouseEvent( e.clientX, e.clientY, MOUSE.UP, e.which == 3 ); return false; }
	//canvas.onmousemove = function (e) {t.onMouseEvent(e.clientX, e.clientY, MOUSE.MOVE, e.which == 3); return false;}
                             
    // Hook mouse move events
	document.addEventListener("mousemove", function (e) {t.onMouseEvent(e.movementX, e.movementY, MOUSE.MOVE, e.which == 3);return false;}, false);                                
}


/*
// setMaterialSelector( id )
//
// Sets the table with the material selectors.

Player.prototype.setMaterialSelector = function( id )
{
	var tableRow = document.getElementById( id ).getElementsByTagName( "tr" )[0];
	var texOffset = 0;

	for ( var mat in BLOCK )
	{
		if ( typeof( BLOCK[mat] ) == "object" && BLOCK[mat].spawnable == true )
		{
			var selector = document.createElement( "td" );
			selector.style.backgroundPosition = texOffset + "px 0px";

			var pl = this;
			selector.material = BLOCK[mat];
			selector.onclick = function()
			{
				this.style.opacity = "1.0";

				pl.prevSelector.style.opacity = null;
				pl.prevSelector = this;

				pl.buildMaterial = this.material;
			}

			if ( mat == "DIRT" ) {
				this.prevSelector = selector;
				selector.style.opacity = "1.0";
			}

			tableRow.appendChild( selector );
			texOffset -= 70;
		}
	}
}
*/


// on( event, callback )
//
// Hook a player event.

Player.prototype.on = function( event, callback )
{
	this.eventHandlers[event] = callback;
}

// onKeyEvent( keyCode, down )
//
// Hook for keyboard input.

Player.prototype.onKeyEvent = function( keyCode, down )
{
	var key = String.fromCharCode( keyCode ).toLowerCase();
	this.keys[key] = down;
	this.keys[keyCode] = down;
	
	if ( !down && key == "t" && this.eventHandlers["openChat"] ) this.eventHandlers.openChat();
}

// onMouseEvent( x, y, type, rmb )
//
// Hook for mouse input.

Player.prototype.onMouseEvent = function( x, y, type, rmb )
{


	if ( type == MOUSE.UP ) {
		this.doBlockAction( x, y, !rmb );
		this.dragging = false;
	}
	else if (type == MOUSE.MOVE) {
        this.dragging = true;

		//check if is not look upward or downward, before apply
        var result = this.targetPitch - y / 1000;
        if(result < Math.PI/2 && result > -Math.PI/2)
        {
            this.targetPitch -= y / 1000;
        }
        this.targetYaw += x / 1000;
    }
}

// doBlockAction( x, y )
//
// Called to perform an action based on the player's block selection and input.

Player.prototype.doBlockAction = function( x, y, destroy )
{
	var bPos = new Vector( Math.floor( this.pos.x ), Math.floor( this.pos.y ), Math.floor( this.pos.z ) );
	var range = 10;
	var block = this.canvas.renderer.pickAt( new Vector( bPos.x - range, bPos.y - range, bPos.z - range ), new Vector( bPos.x + range, bPos.y + range, bPos.z + range ), x, y );

	if ( block != false )
	{
		var obj = this.client ? this.client : this.world;
		
		if ( destroy )
			obj.setBlock( block.x, block.y, block.z, BLOCK.AIR );
		else
			obj.setBlock( block.x + block.n.x, block.y + block.n.y, block.z + block.n.z, {
				id: 19,
				isColorful: true,
				colorID: Palette.colorID,
				x:block.x + block.n.x,
				y:block.y + block.n.y,
				z:block.z + block.n.z,
				texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 2.1/16, 4.1/16, 2.9/16, 4.9/16 ]; }
			});
	}
}

// getEyePos()
//
// Returns the position of the eyes of the player for rendering.

Player.prototype.getEyePos = function()
{
	return this.pos.add( new Vector( 0.0, 0.0, 1.7 ) );
}

// update()
//
// Updates this local player (gravity, movement)

Player.prototype.update = function()
{
	var world = this.world;
	var velocity = this.velocity;
	var pos = this.pos;
	var bPos = new Vector( Math.floor( pos.x ), Math.floor( pos.y ), Math.floor( pos.z ) );

	if ( this.lastUpdate != null )
	{
		var delta = ( new Date().getTime() - this.lastUpdate ) / 1000;

		// View
		if ( this.dragging )
		{
			this.angles[0] += ( this.targetPitch - this.angles[0] ) * 30 * delta;
			this.angles[1] += ( this.targetYaw - this.angles[1] ) * 30 * delta;
			if ( this.angles[0] < -Math.PI/2 ) this.angles[0] = -Math.PI/2;
			if ( this.angles[0] > Math.PI/2 ) this.angles[0] = Math.PI/2;
		}

		



		if( this.isFlyingMode)
		{
			if ( this.keys["q"] )
				velocity.z = this.speed;
			else if ( this.keys["e"]) 
				velocity.z = -this.speed;
			else 
				velocity.z = 0; 
		}
		else
		{
			// Gravity
			if ( this.falling)
				velocity.z += -0.5;
			
			// Jumping
			if ( this.keys[" "])
				velocity.z = 10;
		}

		// Walking
		var walkVelocity = new Vector( 0, 0, 0 );

		if ( this.keys["w"] ) {
			walkVelocity.x += Math.cos( Math.PI / 2 - this.angles[1]);
			walkVelocity.y += Math.sin( Math.PI / 2 - this.angles[1]);
		}
		if ( this.keys["s"] ) {
			walkVelocity.x += Math.cos( Math.PI + Math.PI / 2 - this.angles[1]);
			walkVelocity.y += Math.sin( Math.PI + Math.PI / 2 - this.angles[1]);
		}
		if ( this.keys["a"] ) {
			walkVelocity.x += Math.cos( Math.PI / 2 + Math.PI / 2 - this.angles[1]);
			walkVelocity.y += Math.sin( Math.PI / 2 + Math.PI / 2 - this.angles[1]);
		}
		if ( this.keys["d"] ) {
			walkVelocity.x += Math.cos( -Math.PI / 2 + Math.PI / 2 - this.angles[1]);
			walkVelocity.y += Math.sin( -Math.PI / 2 + Math.PI / 2 - this.angles[1]);
		}

		/*
			if ( this.keys["w"] ) {
				walkVelocity.x += this.speed;

			}
			if ( this.keys["s"] ) {
				walkVelocity.x -= this.speed;
			}
			if ( this.keys["a"] ) {
				walkVelocity.y += this.speed;
			}
			if ( this.keys["d"] ) {
				walkVelocity.y -= this.speed;
			}
		*/

		/*
			if ( this.keys["w"] ) {
				walkVelocity.x += Math.cos( Math.PI / 2 - this.angles[1]);
				walkVelocity.y += Math.sin( Math.PI / 2 - this.angles[1]);
			}
			if ( this.keys["s"] ) {
				walkVelocity.x += Math.cos( Math.PI + Math.PI / 2 - this.angles[1]);
				walkVelocity.y += Math.sin( Math.PI + Math.PI / 2 - this.angles[1]);
			}
			if ( this.keys["a"] ) {
				walkVelocity.x += Math.cos( Math.PI / 2 + Math.PI / 2 - this.angles[1]);
				walkVelocity.y += Math.sin( Math.PI / 2 + Math.PI / 2 - this.angles[1]);
			}
			if ( this.keys["d"] ) {
				walkVelocity.x += Math.cos( -Math.PI / 2 + Math.PI / 2 - this.angles[1]);
				walkVelocity.y += Math.sin( -Math.PI / 2 + Math.PI / 2 - this.angles[1]);
			}
		*/

		/*
			if ( this.keys["w"] ) {
				this.pos.x += Math.cos( Math.PI / 2 - this.angles[1] );
				this.pos.y += Math.sin( Math.PI / 2 - this.angles[1] );
			}
			if ( this.keys["s"] ) { 
				this.pos.x += Math.cos( Math.PI + Math.PI / 2 - this.angles[1] );
				this.pos.y += Math.sin( Math.PI + Math.PI / 2 - this.angles[1] );
			}
			if ( this.keys["a"] ) {
				this.pos.x += Math.cos( Math.PI / 2 + Math.PI / 2 - this.angles[1] );
				this.pos.y += Math.sin( Math.PI / 2 + Math.PI / 2 - this.angles[1] );
			}
			if ( this.keys["d"] ) {
				this.pos.x += Math.cos( -Math.PI / 2 + Math.PI / 2 - this.angles[1] );
				this.pos.y += Math.sin( -Math.PI / 2 + Math.PI / 2 - this.angles[1] );
			}	
		*/

		velocity.x = walkVelocity.x * this.speed;
		velocity.y = walkVelocity.y * this.speed;
		/*
		if ( walkVelocity.length() > 0 ) {
				walkVelocity = walkVelocity.normal();

		} else {
			velocity.x /= this.falling ? 1.01 : 1.5;
			velocity.y /= this.falling ? 1.01 : 1.5;
		}
		*/
		// Resolve collision
		this.pos = this.resolveCollision( pos, bPos, velocity.mul( delta ) );
	}

	this.lastUpdate = new Date().getTime();
}

// resolveCollision( pos, bPos, velocity )
//
// Resolves collisions between the player and blocks on XY level for the next movement step.

Player.prototype.resolveCollision = function( pos, bPos, velocity )
{
	var world = this.world;
	var playerRect = { x: pos.x + velocity.x, y: pos.y + velocity.y, size: 0.25 };

	// Collect XY collision sides
	var collisionCandidates = [];

	for ( var x = bPos.x - 1; x <= bPos.x + 1; x++ )
	{
		for ( var y = bPos.y - 1; y <= bPos.y + 1; y++ )
		{
			for ( var z = bPos.z; z <= bPos.z + 1; z++ )
			{
				if ( world.getBlock( x, y, z ) != BLOCK.AIR )
				{
					if ( world.getBlock( x - 1, y, z ) == BLOCK.AIR ) collisionCandidates.push( { x: x, dir: -1, y1: y, y2: y + 1 } );
					if ( world.getBlock( x + 1, y, z ) == BLOCK.AIR ) collisionCandidates.push( { x: x + 1, dir: 1, y1: y, y2: y + 1 } );
					if ( world.getBlock( x, y - 1, z ) == BLOCK.AIR ) collisionCandidates.push( { y: y, dir: -1, x1: x, x2: x + 1 } );
					if ( world.getBlock( x, y + 1, z ) == BLOCK.AIR ) collisionCandidates.push( { y: y + 1, dir: 1, x1: x, x2: x + 1 } );
				}
			}
		}
	}

	// Solve XY collisions
	for( var i in collisionCandidates ) 
	{
		var side = collisionCandidates[i];

		if ( lineRectCollide( side, playerRect ) )
		{
			if ( side.x != null && velocity.x * side.dir < 0 ) {
				pos.x = side.x + playerRect.size / 2 * ( velocity.x > 0 ? -1 : 1 );
				velocity.x = 0;
			} else if ( side.y != null && velocity.y * side.dir < 0 ) {
				pos.y = side.y + playerRect.size / 2 * ( velocity.y > 0 ? -1 : 1 );
				velocity.y = 0;
			}
		}
	}

	var playerFace = { x1: pos.x + velocity.x - 0.125, y1: pos.y + velocity.y - 0.125, x2: pos.x + velocity.x + 0.125, y2: pos.y + velocity.y + 0.125 };
	var newBZLower = Math.floor( pos.z + velocity.z );
	var newBZUpper = Math.floor( pos.z + 1.7 + velocity.z * 1.1 );

	// Collect Z collision sides
	collisionCandidates = [];

	for ( var x = bPos.x - 1; x <= bPos.x + 1; x++ ) 
	{
		for ( var y = bPos.y - 1; y <= bPos.y + 1; y++ )
		{
			if ( world.getBlock( x, y, newBZLower ) != BLOCK.AIR )
				collisionCandidates.push( { z: newBZLower + 1, dir: 1, x1: x, y1: y, x2: x + 1, y2: y + 1 } );
			if ( world.getBlock( x, y, newBZUpper ) != BLOCK.AIR )
				collisionCandidates.push( { z: newBZUpper, dir: -1, x1: x, y1: y, x2: x + 1, y2: y + 1 } );
		}
	}

	// Solve Z collisions
	this.falling = true;
	for ( var i in collisionCandidates )
	{
		var face = collisionCandidates[i];

		if ( rectRectCollide( face, playerFace ) && velocity.z * face.dir < 0 )
		{
			if ( velocity.z < 0 ) {
				this.falling = false;
				pos.z = face.z;
				velocity.z = 0;
				this.velocity.z = 0;
			} else {
				pos.z = face.z - 1.8;
				velocity.z = 0;
				this.velocity.z = 0;
			}

			break;
		}
	}

	// Return solution
	return pos.add( velocity );
	
}