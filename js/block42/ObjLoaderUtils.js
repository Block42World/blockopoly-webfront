
class ObjLoaderUtils {

	//var objTexture;
	/*
	static SpawnObjFromData(land){

		var objPosition = { x:land._x, y:0, z:land._y };
		ObjLoaderUtils.SpawnObjAtPosition('./assets/'+land._description+".obj", objPosition, function(object) {
			scene.add(object);
			object.userData.land = land;
		});
	}
	*/

    static SpawnObjAtPosition(objUrl, position, onLoad){

		ModelBuilder.loadingCount++;
        //Create an instance of our toon material to apply to our object
		if(typeof objTexture  === 'undefined')
		{
		    var objTexture = new THREE.TextureLoader().load('./assets/color.png');
			objTexture.wrapS = objTexture.wrapT = THREE.RepeatWrapping;
			objTexture.anistropy = 16;

			var objMaterial = new THREE.MeshLambertMaterial({
				map: objTexture,
				color: 0xffffff
			});
		}

        //Create our Mesh and add to scene with the newly created material
        new THREE.OBJLoader()
            .load(objUrl, function (object) {
                object.traverse(function (child) {   //Go through each child and find our mesh component, and change our material
                    if (child instanceof THREE.Mesh) {
                        child.material = objMaterial;
                    }
                });

                //Then we need to set our objects position
                object.position.x = position.x;
                object.position.y = position.y;
				object.position.z = position.z;
				ModelBuilder.loadingCount--;
                onLoad(object,ModelBuilder.loadingCount);
            });
    }

	static SpawnObjFromVox(land, onLoad){
		ModelBuilder.loadingCount++;
		var objPosition = { x:land._x, y:0, z:land._y };
		console.log(land);
		if(land._description == "Land+4+sale_Big" || land._description == "Apartment+combine")
			ObjLoaderUtils.SpawnObjFromVox2('./assets/'+land._description +".vox", objPosition, land,onLoad);
		else if(land._description.endsWith('_2')){
			objPosition.y=126;
			ObjLoaderUtils.SpawnObjFromVox2('./assets/'+land._description +"_x"+land._x+"_y"+land._y+".vox", objPosition, land,onLoad);
		}
		else
			ObjLoaderUtils.SpawnObjFromVox2('./assets/'+land._description +"_x"+land._x+"_y"+land._y+".vox", objPosition, land,onLoad);
		
	}

	
	static SpawnObjFromVox2(objUrl, position, land,onLoad)
	{
		var parser = new vox.Parser();
		parser.parse(objUrl).then(function(voxelData) {


			var size = voxelData.size;
			var points = new Int32Array(size.x * size.y * size.z); 
			//console.log(points);
			for (var i = voxelData.voxels.length - 1; i >= 0; i--){
				var v = voxelData.voxels[i];
				points[(size.x -v.x) + v.y *size.x * size.z + v.z*size.y ] = v.colorIndex;
			}

			//console.log([size.x, size.y, size.z]);
			var result = MonotoneMesh(points, [size.x, size.z, size.y]);
					//console.log(result);
			var geometry = new THREE.Geometry();		
			geometry.vertices.length = 0;
			geometry.faces.length = 0;

			for(var i=0; i<result.vertices.length; ++i) 
			{
				var q = result.vertices[i];
				geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
			}
			//console.log(voxelData.palette[result.faces[0][3]]);
			for(var i=0; i<result.faces.length; ++i) 
			{
				var q = result.faces[i];
				var f= new THREE.Face3(q[0], q[1], q[2]);
				var faceColor = voxelData.palette[q[3]];
				f.color = new THREE.Color(faceColor.r/255, faceColor.g/255, faceColor.b/255);
				geometry.faces.push(f);

			}
			
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			geometry.verticesNeedUpdate = true;
			geometry.elementsNeedUpdate = true;
			geometry.normalsNeedUpdate = true;
      

      
			//Create surface mesh
			var material	= new THREE.MeshLambertMaterial({
				vertexColors: true
			});
			var surfacemesh	= new THREE.Mesh( geometry, material );
			surfacemesh.doubleSided = true;

			scene.add( surfacemesh );
			surfacemesh.position.set( land._x-31.5, position.y, land._y-31.5 );
			surfacemesh.userData.land = land;
			ModelBuilder.loadingCount--;


			/*
			geometry.computeBoundingBox();
			geometry.computeBoundingSphere();
			var sphere = new THREE.SphereGeometry();
			var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0xff0000 ) );
			var box = new THREE.BoxHelper( surfacemesh, 0xffff00 );
			scene.add( box );
			*/
			if (onLoad) {onLoad(ModelBuilder.loadingCount);}
		});
    }
}