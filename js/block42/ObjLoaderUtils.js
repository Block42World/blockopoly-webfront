class ObjLoaderUtils {

    static SpawnObjAtPosition(objUrl, textureUrl,position,onLoad){

        //Create an instance of our toon material to apply to our object
                var objTexture = new THREE.TextureLoader().load(textureUrl);
                objTexture.wrapS = objTexture.wrapT = THREE.RepeatWrapping;
                objTexture.anistropy = 16;

                var objMaterial = new THREE.MeshToonMaterial({
                    map: objTexture,
                    color: 0xffffff
                });


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
                        onLoad(object);
                    });
    }


    // new THREE.MTLLoader()
    // .setPath("assets/")
    // .load('Free Land.mtl', function (materials) {
    //     materials.preload();
    //     new THREE.OBJLoader()
    //         .setMaterials(materials)
    //         .load('assets/Free Land.obj', function (object) {
    //             object.position.x += LandPoslist[LandId][0];
    //             object.position.z += LandPoslist[LandId][1];

    //             if(!reomveList.includes(LandId))
    //                 scene.add(object);
                
                
    //             //object.id = 
    //             LandId++;
    //             //lands.push(obj);
    //             console.log(LandId + '% downloaded');
    //         });
    // });

}