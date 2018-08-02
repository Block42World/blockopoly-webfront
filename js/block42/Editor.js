class Editor
{
	static SaveToObj()
	{
		
		Editor.allvertexs = [];

		Editor.faces =[[],[],[],[],[],[]];
		Editor.vertexsOutput = '';
		Editor.FacesOutput = '';
		Editor.volume = [];
		Editor.color = [];

		for ( var x = 0; x < world.sx; x++ ){
			for ( var y = 0; y < world.sy; y++ ){
				for ( var z = 0; z < world.sz; z++ ){
					/*
					console.log(x+" "+y+" "+z+" "+ world.blocks[x][y][z].colorID);
					if(typeof world.blocks[x][y][z].colorID === "undefined")
						Editor.volume[world.blocks[x][y][z].colorID].push(false);
					else
						Editor.volume[world.blocks[x][y][z].colorID].push(true);
					*/
					var color = vox.defaultPalette[world.blocks[x][y][z].colorID];
					//console.log(color);

					if(typeof color === "undefined")
						Editor.volume.push(0);
					else
						Editor.volume.push(color.r+color.g*256+color.b*256*256);
					//Editor.volume.push(world.blocks[x][y][z] != BLOCK.AIR);
					//Editor.OnBlock(x, y, z);
				}
			}
		}


		var result = MonotoneMesh(Editor.volume, [world.sx, world.sy, world.sz]);

		for(var i=0; i<result.vertices.length; ++i)
			Editor.vertexsOutput +='v ' + result.vertices[i][0] + ' ' + result.vertices[i][1] + ' ' + result.vertices[i][2] + "\n";

		for(var i=0; i<result.faces.length; ++i) 
			Editor.FacesOutput +='f ' + (result.faces[i][0]+1) + ' ' + (result.faces[i][1]+1) + ' ' + (result.faces[i][2]+1) + "\n";

		/*
		var result = GreedyMesh(Editor.volume, [world.sx, world.sy, world.sz]);

		for(var i=0; i<result.length; ++i) {

			var q = result[i]
			for(var j=0; j<4; ++j) {
				Editor.vertexsOutput += 'v ' + q[j][0] + ' ' + q[j][1] + ' ' + q[j][2] + '\n';
			}
			Editor.FacesOutput +='f ' + (i*4+1) + ' ' + (i*4+2) + ' ' + (i*4+3) +' '+ (i*4+4) + "\n";
		}
		*/
		console.log(Editor.vertexsOutput + Editor.FacesOutput);
		//console.log(Editor.allvertexs.length);
		//console.log(Editor.faces);
	}





	static OnBlock(x, y, z)
	{
	// filter out the air blocks
		if(world.blocks[x][y][z] == BLOCK.AIR){continue;}

		//DIRECTION.UP
		if ( z == world.sz - 1 || world.blocks[x][y][z+1].transparent)
		{
			Editor.SaveFace([
				[ x,    y,    z+ 1, ],
				[ x+ 1, y,    z+ 1, ],
				[ x+ 1, y+ 1, z+ 1, ],
				[ x,    y+ 1, z+ 1, ]],
				DIRECTION.UP,
				{	xPos:x,
					yPos:y,
					h:z}
			);
		}
	
		// DIRECTION.DOWN
		if ( z == 0 || world.blocks[x][y][z-1].transparent )
		{
			Editor.SaveFace([
				[ x,    y+ 1, z],
				[ x+ 1, y+ 1, z],
				[ x+ 1, y,    z],
				[ x,    y,    z]],
				DIRECTION.DOWN,
				{	xPos:x,
					yPos:y,
					h:z}
			);
		}
	
		// DIRECTION.FORWARD
		if ( y == 0 || world.blocks[x][y-1][z].transparent )
		{
			Editor.SaveFace([
				[ x,    y, z   ],
				[ x+ 1, y, z   ],
				[ x+ 1, y, z+ 1],
				[ x,    y, z+ 1]],
				DIRECTION.FORWARD,
				{	xPos:x,
					yPos:z,
					h:y}
			);
		}
	
		// Back
		if ( y == world.sy - 1 || world.blocks[x][y+1][z].transparent )
		{
			Editor.SaveFace([
				[ x,    y+ 1, z+ 1],
				[ x+ 1, y+ 1, z+ 1],
				[ x+ 1, y+ 1, z   ],
				[ x,    y+ 1, z   ]],
				DIRECTION.BACK,
				{	xPos:x,
					yPos:z,
					h:y}
			);
		}
	
		// Left
		if ( x == 0 || world.blocks[x-1][y][z].transparent )
		{
			Editor.SaveFace([
				[ x, y,    z+ 1],
				[ x, y+ 1, z+ 1],
				[ x, y+ 1, z,  ],
				[ x, y,    z,  ]],
				DIRECTION.LEFT,
				{	xPos:y,
					yPos:z,
					h:x}
			);
		}
	
		// Right
		if ( x == world.sx - 1 || world.blocks[x+1][y][z].transparent )
		{
			Editor.SaveFace([
				[ x+ 1, y,    z,  ],
				[ x+ 1, y+ 1, z,  ],
				[ x+ 1, y+ 1, z+ 1],
				[ x+ 1, y,    z+ 1]],
				DIRECTION.RIGHT,
				{	xPos:y,
					yPos:z,
					h:x}
			);
		}
	}


	static SaveFace(vertexs, direction, position)
	{
		//DIRECTION start with 1, so i need to -1;
		//Editor.faces[direction-1].push(0);
		Editor.faces[direction-1].push(position);

		Editor.OptimiseFaces(Editor.faces[DIRECTION.UP-1]);

		var a = Editor.SaveVertex(vertexs[0]);
		var b = Editor.SaveVertex(vertexs[1]);
		var c = Editor.SaveVertex(vertexs[2]);
		var d = Editor.SaveVertex(vertexs[3]);
		Editor.FacesOutput +='f ' + a + ' ' + b + ' ' + c +' '+ d + "\n";
		
	}

	static SaveVertex(vertex)
	{
		for ( var i = 0; i < Editor.allvertexs.length; i++ )
		{
			if(	Editor.allvertexs[i][0] ==vertex[0] &&
				Editor.allvertexs[i][1] ==vertex[1] &&
				Editor.allvertexs[i][2] ==vertex[2] )
			{
				//console.log("a");
				return i+1;
			}
		}

		Editor.allvertexs.push(vertex);
		Editor.vertexsOutput += 'v ' + vertex[0] + ' ' + vertex[1] + ' ' + vertex[2] + '\n';
		return Editor.allvertexs.length;
		//console.log("a");

	}


	static OptimiseFaces(faces){}
	
}
