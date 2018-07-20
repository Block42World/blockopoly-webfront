class Index {
  static init() {
    ThreejsUtility.init();

    var citySizeX = 10;
    var citySizeY = 10;

    var reomveList = [55, 155, 255, 355];

    //for-sale land
    var LandPoslist = [];
    var LandId = 0;

    var loadedLandCount = 0;

    //4 lands every block
    for (var xa = 0; xa < 2; xa++) {
      for (var ya = 0; ya < 2; ya++) {
        //100 blocks
        for (var xi = 0; xi < citySizeX; xi++) {
          for (var yi = 0; yi < citySizeY; yi++) {
            //record position
            var pos = [xi * 149 + xa * 63, yi * 149 + ya * 63]; //149=126+23
            LandPoslist.push(pos);

            var objPosition = new THREE.Vector3(
              LandPoslist[LandId][0],
              0,
              LandPoslist[LandId][1]
            );

            ObjLoaderUtils.SpawnObjAtPosition(
              "assets/Free Land.obj",
              "assets/Free Land.png",
              objPosition,
              function(object) {
                if (!reomveList.includes(loadedLandCount)) {
				  scene.add(object);
				}
				console.log(loadedLandCount + "% downloaded");
				loadedLandCount++;
              }
            );

            LandId++;
            
          }
        }
      }
    }

    //121 street
    var hStPoslist = [];
    var hStId = 0;

    for (var xi = 0; xi < citySizeX; xi++) {
      for (var yi = 0; yi < citySizeY + 1; yi++) {
        //record position
        var pos = [xi * 149 + 31.5, yi * 149 - 43];
        hStPoslist.push(pos);

		var objPosition = new THREE.Vector3(
			hStPoslist[hStId][0],
			-1,
			hStPoslist[hStId][1]
		  );

		ObjLoaderUtils.SpawnObjAtPosition("assets/Road.obj", "assets/Road.png",objPosition,function(object){
				scene.add(object);
		});
		hStId++;
      }
    }

    var vStPoslist = [];
    var vStId = 0;

    //121 street

    for (var xi = 0; xi < citySizeX + 1; xi++) {
      for (var yi = 0; yi < citySizeY; yi++) {
        //record position
        var pos = [xi * 149 - 43, yi * 149 + 31.5];
        vStPoslist.push(pos);

		var objPosition = new THREE.Vector3(
			vStPoslist[vStId][0],
			-1,
			vStPoslist[vStId][1]
		  );

		ObjLoaderUtils.SpawnObjAtPosition("assets/Road.obj", "assets/Road.png",objPosition,function(object){
				object.rotateY(Math.PI / 2);
				scene.add(object);
		});
		vStId++;
      }
    }

    var cPoslist = [];
    var cId = 0;
    for (var xi = 0; xi < citySizeX + 1; xi++) {
      for (var yi = 0; yi < citySizeY + 1; yi++) {
        //record position
        var pos = [xi * 149 - 43, yi * 149 - 43];
        cPoslist.push(pos);

		var objPosition = new THREE.Vector3(
			cPoslist[cId][0],
			-1,
			cPoslist[cId][1]
		  );

		ObjLoaderUtils.SpawnObjAtPosition("assets/Road2.obj", "assets/Road2.png",objPosition,function(object){
				object.rotateY(Math.PI / 2);
				scene.add(object);
		});
		cId++;
      }
    }

    //central building
	//Shibuya
	var objPosition = new THREE.Vector3(
		149 * parseInt(citySizeX / 2) + 32,
		0,
		149 * parseInt(citySizeY / 2) + 32
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/Shibuya.obj", "assets/Shibuya.png",objPosition,function(object){
			scene.add(object);
	});

    var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(Math.round(percentComplete, 2) + "% downloaded");
      }
    };
    var onError = function(xhr) {};
  }
}
