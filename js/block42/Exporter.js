class Exporter
{
	static SaveToVox(data)
	{
		var encoder = new TextEncoder("utf-8");
		
		//https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox.txt
	//VOX
		var header = new Uint8Array(8);
		header.set(encoder.encode("VOX "),				0);//"VOX "
		header.set(ToUint8(150),						4);//version
		
	//SIZE
		var size = new Uint8Array(24);
		size.set(encoder.encode("SIZE"),				0);//"SIZE"
		size.set(ToUint8(12),							4);//num bytes of chunk content (N)
		size.set(ToUint8(0),							8);//num bytes of children chunks (M)
		size.set(ToUint8(data.size.x),					12);//x 
		size.set(ToUint8(data.size.y),					16);//y
		size.set(ToUint8(data.size.z),					20);//z

	//XYZI
		var xyzi = new Uint8Array((data.voxels.length+ 4)*4);
		xyzi.set(encoder.encode("XYZI"),				0);//"XYZI"
		xyzi.set(ToUint8((data.voxels.length+ 1)*4),	4);//num bytes of chunk content (N)
		xyzi.set(ToUint8(0),							8);//num bytes of children chunks (M)
		xyzi.set(ToUint8(data.voxels.length),			12);//num bytes of children chunks (M)
		for (var i = 0; i < data.voxels.length; i++) 
		{
			xyzi.set([
				data.voxels[i].x,			
				data.voxels[i].y,
				data.voxels[i].z,
				data.voxels[i].colorIndex
			],											16 + i*4);
		}

	//MAIN
		var main = new Uint8Array(12);
		main.set(encoder.encode("MAIN"),				0);//"MAIN"
		main.set(ToUint8(0),							4);//num bytes of chunk content (N)
		main.set(ToUint8(size.length + xyzi.length),			8);//num bytes of children chunks (M)


		var result = addUint8Arrays(header, main);
		console.log(result);
		result = addUint8Arrays(result, size);
		result = addUint8Arrays(result, xyzi);
		return result;
	}


	static SaveToObj()
	{
		
		Expoter.allvertexs = [];

		Expoter.faces =[[],[],[],[],[],[]];
		Expoter.vertexsOutput = '';
		Expoter.FacesOutput = '';
		Expoter.volume = [];
		Expoter.color = [];

		for ( var x = 0; x < world.sx; x++ ){
			for ( var y = 0; y < world.sy; y++ ){
				for ( var z = 0; z < world.sz; z++ ){
					/*
					console.log(x+" "+y+" "+z+" "+ world.blocks[x][y][z].colorID);
					if(typeof world.blocks[x][y][z].colorID === "undefined")
						Expoter.volume[world.blocks[x][y][z].colorID].push(false);
					else
						Expoter.volume[world.blocks[x][y][z].colorID].push(true);
					*/
					var color = vox.defaultPalette[world.blocks[x][y][z].colorID];
					//console.log(color);
					
					if(typeof color === "undefined")
						console.error("color undefined")

					Expoter.volume.push(color.r+color.g*256+color.b*256*256);
					//Expoter.volume.push(world.blocks[x][y][z] != BLOCK.AIR);
					//Expoter.OnBlock(x, y, z);
				}
			}
		}


		var result = MonotoneMesh(Expoter.volume, [world.sx, world.sy, world.sz]);

		for(var i=0; i<result.vertices.length; ++i)
			Expoter.vertexsOutput +='v ' + result.vertices[i][0] + ' ' + result.vertices[i][1] + ' ' + result.vertices[i][2] + "\n";

		for(var i=0; i<result.faces.length; ++i) 
			Expoter.FacesOutput +='f ' + (result.faces[i][0]+1) + ' ' + (result.faces[i][1]+1) + ' ' + (result.faces[i][2]+1) + "\n";

		/*
		var result = GreedyMesh(Expoter.volume, [world.sx, world.sy, world.sz]);

		for(var i=0; i<result.length; ++i) {

			var q = result[i]
			for(var j=0; j<4; ++j) {
				Expoter.vertexsOutput += 'v ' + q[j][0] + ' ' + q[j][1] + ' ' + q[j][2] + '\n';
			}
			Expoter.FacesOutput +='f ' + (i*4+1) + ' ' + (i*4+2) + ' ' + (i*4+3) +' '+ (i*4+4) + "\n";
		}
		*/
		console.log(Expoter.vertexsOutput + Expoter.FacesOutput);
		//console.log(Expoter.allvertexs.length);
		//console.log(Expoter.faces);
	}


	static OnBlock(x, y, z)
	{
	// filter out the air blocks
		if(world.blocks[x][y][z] == BLOCK.AIR){continue;}

		//DIRECTION.UP
		if ( z == world.sz - 1 || world.blocks[x][y][z+1].transparent)
		{
			Expoter.SaveFace([
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
			Expoter.SaveFace([
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
			Expoter.SaveFace([
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
			Expoter.SaveFace([
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
			Expoter.SaveFace([
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
			Expoter.SaveFace([
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
		//Expoter.faces[direction-1].push(0);
		Expoter.faces[direction-1].push(position);

		Expoter.OptimiseFaces(Expoter.faces[DIRECTION.UP-1]);

		var a = Expoter.SaveVertex(vertexs[0]);
		var b = Expoter.SaveVertex(vertexs[1]);
		var c = Expoter.SaveVertex(vertexs[2]);
		var d = Expoter.SaveVertex(vertexs[3]);
		Expoter.FacesOutput +='f ' + a + ' ' + b + ' ' + c +' '+ d + "\n";
		
	}

	static SaveVertex(vertex)
	{
		for ( var i = 0; i < Expoter.allvertexs.length; i++ )
		{
			if(	Expoter.allvertexs[i][0] ==vertex[0] &&
				Expoter.allvertexs[i][1] ==vertex[1] &&
				Expoter.allvertexs[i][2] ==vertex[2] )
			{
				//console.log("a");
				return i+1;
			}
		}

		Expoter.allvertexs.push(vertex);
		Expoter.vertexsOutput += 'v ' + vertex[0] + ' ' + vertex[1] + ' ' + vertex[2] + '\n';
		return Expoter.allvertexs.length;
		//console.log("a");

	}


	static OptimiseFaces(faces){}
	
}