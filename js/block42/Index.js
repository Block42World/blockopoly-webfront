
class Index
{	
	static init()
	{
		ThreejsUtility.init();

		//for sale land
		var poslist = [];
		var id = 0;


		for (var xa = 0; xa < 2; xa++) {
			for (var ya = 0; ya < 2; ya++) {
				for (var xi = 0; xi < 10; xi++) {
					for (var yi = 0; yi < 10; yi++) {
						var pos = [xi * (126+23*2) + xa*63, yi * (126+23*2)+ya*63];
						poslist.push(pos);

						//Shibuya
						new THREE.MTLLoader()
							.setPath("assets/")
							.load('Free Land.mtl', function (materials) {
								materials.preload();
								new THREE.OBJLoader()
									.setMaterials(materials)
									.load('assets/Free Land.obj', function (object) {
										object.position.x += poslist[id][0];
										object.position.z += poslist[id][1];
										scene.add(object);
										id++;
										console.log(id + '% downloaded');
									});
							});
					}
				}
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
						object.position.x += 126 * 5;
						object.position.z += 126 * 5;
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