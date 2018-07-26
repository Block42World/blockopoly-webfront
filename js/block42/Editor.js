class Editor
{
	static Save()
	{
		for (var i = world.blocks.length - 1; i >= 0; i--) {
			if(){}
	    	world.blocks[voxelData.voxels[i].x][voxelData.voxels[i].y][voxelData.voxels[i].z] =// blank
			{
				id: 19,
				spawnable: true,
				transparent: false,
				selflit: true,
				gravity: false,
				fluid: false,
				isColorful: true,
				colorID: voxelData.voxels[i].colorIndex,
				texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 2.1/16, 4.1/16, 2.9/16, 4.9/16 ]; }
			};
		}
	}


	static SaveToObj()
	{
		
	}
}
