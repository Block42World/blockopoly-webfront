//Initialisation code

console.log(fileName);

if(typeof fileName === "undefined")
{
	var fileName = "Shibuya";
}


var world;
var render;
var physics;
var player;
var isPlaying = false;
var myVoxelData;
var orbitControls;
var threeJsPlayer;

class Editor
{
	static init()
	{
		Palette.init(8, 32, 10, true);

		//init sight script
		Sight.init();	


		// Create a new flat world
		world = new World( 128, 128, 128 );
		world.createFlatWorld( 0 );

		// Set up renderer
		render = new Renderer( "renderSurface" );
		render.setWorld( world, 100 );
		render.setPerspective( 60, 0.01, 200 );
	
	
		// Create new local player
		player = new Player();
		player.setWorld( world );
		player.setInputCanvas( "renderSurface" );
		//player.setMaterialSelector( "materialSelector" );

		//threeJsPlayer = new THREE.Object3D();
		//orbitControls = new THREE.OrbitControls(threeJsPlayer);

		// Render loop			
		setInterval( function()
		{
			var time = new Date().getTime() / 1000.0;
		
			// Update local player
			player.update();
		
			// Build a chunk
			render.buildChunks( 1 );
		
			// Draw world
			render.setCamera( player.getEyePos().toArray(), player.angles );
			//render.setCamera( threeJsPlayer.position.toArray(), threeJsPlayer.rotation.toArray());//[-0.4439981878515318, 0.5049579584189791, 0] );
			//console.log(threeJsPlayer.position);
			render.draw();
		
			while ( new Date().getTime() / 1000 - time < 0.016 );
		}, 1 );
	
			
		//Shibuya2    chr_rain   Road X
		var parser = new vox.Parser();
		parser.parse("assets/"+fileName+".vox").then(function(voxelData) {
			console.log(voxelData);
			myVoxelData = voxelData;

			for (var i = voxelData.voxels.length - 1; i >= 0; i--) {
	    		world.blocks[voxelData.voxels[i].x][voxelData.voxels[i].y][voxelData.voxels[i].z] =// blank
				{
					id: 19,
					spawnable: true,
					transparent: false,
					gravity: false,
					fluid: false,
					isColorful: true,
					colorID: voxelData.voxels[i].colorIndex,
					x:voxelData.voxels[i].x,
					y:voxelData.voxels[i].y,
					z:voxelData.voxels[i].z,
					texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 2.1/16, 4.1/16, 2.9/16, 4.9/16 ]; }
				};
			
			}

			//update all chuncks
			for ( var i = 0; i < render.chunks.length; i++ )
			{
				render.chunks[i].dirty = true;
			}
	    
			//voxelData.voxels; // voxel position and color data
			//voxelData.size; // model size
			//voxelData.palette; // palette data
	
		
		});
	}
}


	

	



function OnBtnSave()
{
	myVoxelData = world.ToVoxelData();
	var result = Exporter.SaveToVox(myVoxelData);
		
	console.log("finished encoding");
	
	Upload(fileName+".vox", result);
	//download(result, fileName+".vox", "text/plain");



	//Exporter.SaveToObj();
	//download(Exporter.vertexsOutput + Exporter.FacesOutput, "city.obj", "text/plain");
}

function OnCheckboxFlyingMode(checkbox)
{
	player.isFlyingMode = checkbox.checked;
	console.log(player.isFlyingMode);
}


function addUint8Arrays(a, b) {
	var c = new Uint8Array(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}

function ToUint8(number)
{
	return [number, 
	number/Math.pow(256, 1), 
	number/Math.pow(256, 2), 
	number/Math.pow(256, 3)]
}


function Upload(fileName, blob)
{
	var formData = new FormData();

	formData.append("username", "Groucho");
	formData.append("accountnum", 123456);

	//formData.append("vox", blob, fileName);

	var file = new Blob([blob], {type: "text/plain"});
	formData.append("voxFile", file, fileName);

	var request = new XMLHttpRequest();
	request.open("POST", "/uploadVox");
	request.send(formData);
	console.log("uploaded");
}


// Function to download data to a file
function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}
