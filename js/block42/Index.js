class Index {
  static init() {
    Index.worldLoaded = false;

    ThreejsUtility.init();

    var citySizeX = 10;
    var citySizeY = 10;

		var reomveList = [
			 55, 155, 255, 355
			,54, 154, 254, 354
			,45, 145, 245, 345
			,44, 144, 244, 344
		];

    // var geometry = new THREE.PlaneGeometry(2000,2000,2,2)
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // var plane = new THREE.Mesh( geometry, material );
    // plane.rotation.set(new THREE.Euler(-90,0,0,'XYZ'));
    // scene.add(plane);

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


			if(reomveList.includes(LandId))
			{
				LandId++;
				continue;
			}

            var objPosition = new THREE.Vector3(
              xi * 149 + xa * 63,
              0,
              yi * 149 + ya * 63
            );

			var fileName;
			if(Math.random()> 0.3)
			{ fileName = "Land+4+sale";
			}else{ 
			fileName = "Apartment+combine";
			}

            ObjLoaderUtils.SpawnObjAtPosition(
			  "assets/"+fileName+".obj",
              "assets/"+fileName+".png",
              objPosition,
              function(object) {
				  scene.add(object);

				console.log(loadedLandCount + "/400 loaded");
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

        ObjLoaderUtils.SpawnObjAtPosition(
          "assets/Road.obj",
          "assets/Road.png",
          objPosition,
          function(object) {
            scene.add(object);
          }
        );
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

        ObjLoaderUtils.SpawnObjAtPosition(
          "assets/Road.obj",
          "assets/Road.png",
          objPosition,
          function(object) {
            object.rotateY(Math.PI / 2);
            scene.add(object);
          }
        );
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

        ObjLoaderUtils.SpawnObjAtPosition(
          "assets/Road2.obj",
          "assets/Road2.png",
          objPosition,
          function(object) {
            object.rotateY(Math.PI / 2);
            scene.add(object);
          }
        );
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

    ObjLoaderUtils.SpawnObjAtPosition(
      "assets/Shibuya.obj",
      "assets/Shibuya.png",
      objPosition,
      function(object) {
        scene.add(object);
      }
    );

    Index.worldLoaded = true;

	//Sweaty Chair Building
	var objPosition = new THREE.Vector3(
		(149) * parseInt(citySizeX/2-1)+31.5,
		0,
		(149) * parseInt(citySizeY/2)+31.5,
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/SweatyChair.obj", "assets/SweatyChair.png",objPosition,function(object){
			scene.add(object);
	});


	//Block 42 Building base
	var objPosition = new THREE.Vector3(
		(149) * parseInt(citySizeX/2-1)+31.5,
		0,
		(149) * parseInt(citySizeY/2-1)+31.5,
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/Block+42.obj", "assets/Block+42.png",objPosition,function(object){
			scene.add(object);
	});

	//Block 42 Building top
	var objPosition = new THREE.Vector3(
		(149) * parseInt(citySizeX/2-1)+31.5,
		126,
		(149) * parseInt(citySizeY/2-1)+31.5,
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/Block+42_2.obj", "assets/Block+42_2.png",objPosition,function(object){
			scene.add(object);
	});


	//ugly Building base
	var objPosition = new THREE.Vector3(
		(149) * parseInt(citySizeX/2)+31.5,
		0,
		(149) * parseInt(citySizeY/2-1)+31.5,
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/city+ugly.obj", "assets/city+ugly.png",objPosition,function(object){
			scene.add(object);
	});

	//ugly Building top
	var objPosition = new THREE.Vector3(
		(149) * parseInt(citySizeX/2)+31.5,
		126,
		(149) * parseInt(citySizeY/2-1)+31.5,
	  );

	ObjLoaderUtils.SpawnObjAtPosition("assets/ugly+building+2.obj", "assets/ugly+building+2.png",objPosition,function(object){
			scene.add(object);
	});

  }
}

function showElementById(id) {
  document.getElementById(id).style.display = "block";
}

function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}
