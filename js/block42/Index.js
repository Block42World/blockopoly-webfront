
class Index
{	
	static init()
	{
		ThreejsUtility.init();

		var citySizeX = 10;
		var citySizeY = 10;




		var reomveList = [55, 155, 255, 355];

		// DEV: variable use camelCase
		//for-sale land
		var LandPoslist = [];
		var LandId = 0;
		
		//4 lands every block
		for (var xa = 0; xa < 2; xa++) {
			for (var ya = 0; ya < 2; ya++) {
				//100 blocks
				for (var xi = 0; xi < citySizeX; xi++) {
					for (var yi = 0; yi < citySizeY; yi++) {
						//record position
						var pos = [xi * 149 + xa*63, yi * 149+ya*63];//149=126+23
						LandPoslist.push(pos);

						new THREE.MTLLoader()
							.setPath("assets/")
							.load('Free Land.mtl', function (materials) {
								materials.preload();
								new THREE.OBJLoader()
									.setMaterials(materials)
									.load('assets/Free Land.obj', function (object) {
										object.position.x += LandPoslist[LandId][0];
										object.position.z += LandPoslist[LandId][1];

										if(!reomveList.includes(LandId))
											scene.add(object);
										
										
										//object.id = 
										LandId++;
										//lands.push(obj);
										console.log(LandId + '% downloaded');
									});
							});
					}
				}
			}
		}



		//121 street
		var hStPoslist = [];
		var hStId = 0;

		for (var xi = 0; xi < citySizeX; xi++) {
			for (var yi = 0; yi < citySizeY+1; yi++) {
				//record position
				var pos = [xi * 149+31.5, yi * 149-43];
				hStPoslist.push(pos);

				new THREE.MTLLoader()
					.setPath("assets/")
					.load('Road.mtl', function (materials) {
						materials.preload();
						new THREE.OBJLoader()
							.setMaterials(materials)
							.load('assets/Road.obj', function (object) {
								object.position.x += hStPoslist[hStId][0];
								object.position.z += hStPoslist[hStId][1];
								object.position.y=-1;
								scene.add(object);
								hStId++;
								console.log(hStId + '% downloaded');
							});
					});
			}
		}
		
		var vStPoslist = [];
		var vStId = 0;

		//121 street

		for (var xi = 0; xi < citySizeX+1; xi++) {
			for (var yi = 0; yi < citySizeY; yi++) {
				//record position
				var pos = [xi * 149-43, yi * 149+31.5];
				vStPoslist.push(pos);

				new THREE.MTLLoader()
					.setPath("assets/")
					.load('Road.mtl', function (materials) {
						materials.preload();
						new THREE.OBJLoader()
							.setMaterials(materials)
							.load('assets/Road.obj', function (object) {
								object.position.x += vStPoslist[vStId][0];
								object.position.z += vStPoslist[vStId][1];
								object.position.y=-1;
								object.rotateY(Math.PI/2);
								scene.add(object);
								vStId++;
								console.log(vStId + '% downloaded');
							});
					});
			}
		}

		var cPoslist = [];
		var cId = 0;
		for (var xi = 0; xi < citySizeX+1; xi++) {
			for (var yi = 0; yi < citySizeY+1; yi++) {
				//record position
				var pos = [xi * 149-43, yi * 149-43];
				cPoslist.push(pos);

				new THREE.MTLLoader()
					.setPath("assets/")
					.load('Road2.mtl', function (materials) {
						materials.preload();
						new THREE.OBJLoader()
							.setMaterials(materials)
							.load('assets/Road2.obj', function (object) {
								object.position.x += cPoslist[cId][0];
								object.position.z += cPoslist[cId][1];
								object.position.y=-1;
								object.rotateY(Math.PI/2);
								scene.add(object);
								cId++;
								// console.log(cId + '% downloaded');
							});
					});
			}
		}


		//central building
		//Shibuya
		new THREE.MTLLoader()
			.setPath("assets/")
			.load('Shibuya.mtl', function (materials) {
				materials.preload();
				new THREE.OBJLoader()
					.setMaterials(materials)
					.load('assets/Shibuya.obj', function (object) {
						object.position.x += (149) * parseInt(citySizeX/2)+32;
						object.position.z += (149) * parseInt(citySizeY/2)+32;
						scene.add(object);
					});
			});








		var onProgress = function (xhr) {
			if (xhr.lengthComputable) {

				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log(Math.round(percentComplete, 2) + '% downloaded');
			}
		};
		var onError = function (xhr) { };
	}
}

function showElementById(id) {
	document.getElementById(id).style.display = 'block';
}

function hideElementById(id) {
	document.getElementById(id).style.display = 'none';
}