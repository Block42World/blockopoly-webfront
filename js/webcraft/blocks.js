// ==========================================
// Block types
//
// This file contains all available block types and their properties.
// ==========================================

// Direction enumeration
var DIRECTION = {};
DIRECTION.UP = 1;
DIRECTION.DOWN = 2;
DIRECTION.LEFT = 3;
DIRECTION.RIGHT = 4;
DIRECTION.FORWARD = 5;
DIRECTION.BACK = 6;

BLOCK = {};

// Air
BLOCK.AIR = {
	id: 0,
	spawnable: false,
	transparent: true
};


// Dirt
BLOCK.DIRT = {
	id: 2,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	colorID: 3,
	texture: function( world, lightmap, lit, x, y, z, dir )
	{
		if ( dir == DIRECTION.UP && lit )
			return [ 14/16, 0/16, 15/16, 1/16 ];
		else if ( dir == DIRECTION.DOWN || !lit ) 
			return [ 2/16, 0/16, 3/16, 1/16 ];
		else
			return [ 3/16, 0/16, 4/16, 1/16 ];
	}
};



// fromId( id )
//
// Returns a block structure for the given id.

BLOCK.fromId = function( id )
{
	for ( var mat in BLOCK )
		if ( typeof( BLOCK[mat] ) == "object" && BLOCK[mat].id == id )
			return BLOCK[mat];
	return null;
}

// pushVertices( vertices, world, lightmap, x, y, z )
//
// Pushes the vertices necessary for rendering a
// specific block into the array.

BLOCK.pushVertices = function( vertices, world, lightmap, x, y, z )
{
	var blocks = world.blocks;
	var blockLit = z >= lightmap[x][y];
	var block = blocks[x][y][z];
	var bH = block.fluid && ( z == world.sz - 1 || !blocks[x][y][z+1].fluid ) ? 0.9 : 1.0;
	
	

	//console.log(x+" "+y+" "+z);
	var r = myVoxelData.palette[block.colorID].r/255;
	var g = myVoxelData.palette[block.colorID].g/255;
	var b = myVoxelData.palette[block.colorID].b/255;
	//console.log(blocks[x][y][z].colorID);
	// Top
	if ( z == world.sz - 1 || world.blocks[x][y][z+1].transparent || block.fluid )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.UP );
		
		var lightMultiplier = z >= lightmap[x][y] ? 1.0 : 0.6;
		if ( block.selflit ) lightMultiplier = 1.0;
		
		pushQuad(
			vertices,
			[ x,    y,    z+ 1, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y,    z+ 1, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z+ 1, c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x,    y+ 1, z+ 1, c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}
	
	// Bottom
	if ( z == 0 || world.blocks[x][y][z-1].transparent )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.DOWN );
		
		var lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		pushQuad(
			vertices,							
			[ x,    y+ 1, z, c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z, c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y,    z, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x,    y,    z, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}
	
	// Front
	if ( y == 0 || world.blocks[x][y-1][z].transparent )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.FORWARD );
		
		var lightMultiplier = ( y == 0 || z >= lightmap[x][y-1] ) ? 1.0 : 0.6;
		if ( block.selflit ) lightMultiplier = 1.0;
		
		pushQuad(
			vertices,
			[ x,    y, z,    c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y, z,    c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y, z+ 1, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x,    y, z+ 1, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}
	
	// Back
	if ( y == world.sy - 1 || world.blocks[x][y+1][z].transparent )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.BACK );
		
		var lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		pushQuad(
			vertices,
			[ x,    y+ 1, z+ 1, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z+ 1, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z,    c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x,    y+ 1, z,    c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}
	
	// Left
	if ( x == 0 || world.blocks[x-1][y][z].transparent )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.LEFT );
		
		var lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		pushQuad(
			vertices,
			[ x, y,    z+ 1, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x, y+ 1, z+ 1, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x, y+ 1, z,    c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x, y,    z,    c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}
	
	// Right
	if ( x == world.sx - 1 || world.blocks[x+1][y][z].transparent )
	{
		var c = block.texture( world, lightmap, blockLit, x, y, z, DIRECTION.RIGHT );
		
		var lightMultiplier = ( x == world.sx - 1 || z >= lightmap[x+1][y] ) ? 1.0 : 0.6;
		if ( block.selflit ) lightMultiplier = 1.0;
		
		pushQuad(
			vertices,
			[ x+ 1, y,    z,    c[0], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z,    c[2], c[3], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y+ 1, z+ 1, c[2], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ],
			[ x+ 1, y,    z+ 1, c[0], c[1], r*lightMultiplier, g*lightMultiplier, b*lightMultiplier, 1.0 ]
		);
	}

}

// pushPickingVertices( vertices, x, y, z )
//
// Pushes vertices with the data needed for picking.

BLOCK.pushPickingVertices = function( vertices, x, y, z )
{
	var color = { r: x/255, g: y/255, b: z/255 };
	
	// Top
	pushQuad(
		vertices,
		[ x, y, z + 1, 0, 0, color.r, color.g, color.b, 1/255 ],
		[ x + 1, y, z + 1, 1, 0, color.r, color.g, color.b, 1/255 ],
		[ x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, 1/255 ],
		[ x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, 1/255 ]
	);
	
	// Bottom
	pushQuad(
		vertices,
		[ x, y + 1, z, 0, 0, color.r, color.g, color.b, 2/255 ],
		[ x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, 2/255 ],
		[ x + 1, y, z, 1, 1, color.r, color.g, color.b, 2/255 ],
		[ x, y, z, 0, 0, color.r, color.g, color.b, 2/255 ]
	);
	
	// Front
	pushQuad(
		vertices,
		[ x, y, z, 0, 0, color.r, color.g, color.b, 3/255 ],
		[ x + 1, y, z, 1, 0, color.r, color.g, color.b, 3/255 ],
		[ x + 1, y, z + 1, 1, 1, color.r, color.g, color.b, 3/255 ],
		[ x, y, z + 1, 0, 0, color.r, color.g, color.b, 3/255 ]
	);
	
	// Back
	pushQuad(
		vertices,
		[ x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, 4/255 ],
		[ x + 1, y + 1, z + 1, 1, 0, color.r, color.g, color.b, 4/255 ],
		[ x + 1, y + 1, z, 1, 1, color.r, color.g, color.b, 4/255 ],
		[ x, y + 1, z, 0, 0, color.r, color.g, color.b, 4/255 ]
	);
	
	// Left
	pushQuad(
		vertices,
		[ x, y, z + 1, 0, 0, color.r, color.g, color.b, 5/255 ],
		[ x, y + 1, z + 1, 1, 0, color.r, color.g, color.b, 5/255 ],
		[ x, y + 1, z, 1, 1, color.r, color.g, color.b, 5/255 ],
		[ x, y, z, 0, 0, color.r, color.g, color.b, 5/255 ]
	);
	
	// Right
	pushQuad(
		vertices,
		[ x + 1, y, z, 0, 0, color.r, color.g, color.b, 6/255 ],
		[ x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, 6/255 ],
		[ x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, 6/255 ],
		[ x + 1, y, z + 1, 0, 0, color.r, color.g, color.b, 6/255 ]
	);
}

// Export to node.js
if ( typeof( exports ) != "undefined" )
{
	exports.BLOCK = BLOCK;
}