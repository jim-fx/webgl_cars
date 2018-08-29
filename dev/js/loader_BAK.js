exports.sceneLoader = function(manager, scene, THREE){

  var scope = this;

  this.json;

  this.name;

  this.objects = {};

  this.debug = false;

  this.texloader = new THREE.TextureLoader();
  this.jsonloader = new THREE.JSONLoader();

  this.callback;

  this.scene = scene;

  this.looperCount = 0;
  this.looper = function(array, callback, finished){
    array.forEach((item, index, array) => {
        callback(item, index, () => {
          scope.looperCount++;
          if(scope.looperCount === array.length){
            scope.looperCount = 0;
            finished()
          }
        });
      });

  }

  //Creates the Scene from the JSON Data
  this.createScene = function(){

    this.name = this.json.name
    this.scene.name = this.name

    let hdris = {};
    let materialArray = [];
    let materials = {};

    let staticmeshes = [];
    let staticMesh = new THREE.Geometry();

    function addStaticMeshToScene(callback){

      //Convert to Buffergeometry
      staticMesh.computeVertexNormals();
      let tempGeometry = new THREE.BufferGeometry().fromGeometry(staticMesh)

      //Create mesh from the geometry
      let tempMesh = new THREE.Mesh(tempGeometry, materialArray)
      tempMesh.name = "staticMesh";
      tempMesh.userData.clickable = false;
      scope.scene.add(tempMesh);

      callback();

    }

    function mergingMeshes(item,i, callback){
      if (staticMesh.geometry) {
        staticMesh.merge(item.mesh, item.matrix, item.materialIndex);
      }
      callback()
    }

    function buildMaterial(material, callback){

      let _material;

      //Creating the basic material
      switch (material.type) {
        case "basic":
          _material = new THREE.MeshBasicMaterial()
          break;
        case "physical":
          _material = new THREE.MeshPhysicalMaterial()
          break;
        default:
          _material = new THREE.MeshStandardMaterial()
      }


      //Go through all properties of the material
      //and assign it to the new _material created above
      for (var key in material) {


          //Filter out Properties that arent values or textures
          if(key === "type" || key === "scale" )
          {
            //Do nothing, type is set above, scale is set below
          }
          //Filter out envMap property
          else if (key === "envMap")
          {
            _material.envMap = hdris[material.envMap]
          }
          //Filter out the color attribute
          else if (key === "color")
          {
            _material.color.setHex(material[key])
          }
          else if (key === "normalScale")
          {
            _material.normalScale = new THREE.Vector2(material[key], material[key])
          }
          else if (key === "side")
          {

            switch (material[key]) {
              case "double":
                _material.side = THREE.DoubleSide;
                break;
              case "back":
                _material.side = THREE.BackSide;
                break;
              default:

            }
          }
          //If the property is a value
          else
          {
            switch (typeof material[key]) {
              case "string":
                //All textures
                _material[key] = scope.texloader.load("./3D/"+scope.name+"/textures/"+material[key])

                if (material.scale && key !== "lightMap") {

                  _material[key].repeat.set(material.scale, material.scale);
                  _material[key].wrapT = _material[key].wrapS = THREE.RepeatWrapping;

                }
                break;
              case "number":
                //Handle all value types (roughness, metalness an so forth)
                _material[key] = material[key]
                break;
              case "boolean":
                //Handle all booleans (tranparency, wireframe and so on)
                _material[key] = material[key]
                break;
              default:

            }
          }

      }

      callback(_material);

    }

    function buildMesh(item, i, callback){

      if (!scope.json.materials[item.material]) {console.error("Material for "+item.name.toUpperCase()+" is missing")};

      scope.jsonloader.load(
        "./3D/"+scope.name+"/models/"+item.name+".json",
        function(geometry){

          geometry.computeBoundingBox();

          if (item.type === "static")
          {
            if(item.size)
            {
              geometry.scale(item.size)
            }

            if (item.rot)
            {
              geometry.rotateX(item.rot[0]*Math.PI/180)
              geometry.rotateY(item.rot[1]*Math.PI/180)
              geometry.rotateZ(item.rot[2]*Math.PI/180)
            }

            if (item.pos)
            {
              geometry.translate(item.pos[0], item.pos[1], item.pos[2])
            }
          }


          if (materials[item.material] === undefined)
          {
            buildMaterial(scope.json.materials[item.material],
              function(material){

                material.name = item.material;

                materialArray.push(material)
                materials[item.material] = materialArray.length-1;

                if (item.type === "static" && scope.debug === false)
                {
                  staticmeshes.push({"name": item.name, "mesh": geometry, "materialIndex": materialArray.length-1})
                }
                else
                {
                  geometry.computeFaceNormals();
                  let buffergeometry = new THREE.BufferGeometry().fromGeometry(geometry)
                  let mesh = new THREE.Mesh(buffergeometry, materialArray[materials[item.material]]);
                  mesh.name = item.name
                  if (item.pos) {mesh.position.set(item.pos[0], item.pos[1], item.pos[2])}
                  if (item.size) {mesh.scale.set(item.size, item.size, item.size)}
                  if (item.rot) {mesh.rotation.set(item.rot[0]*Math.PI/180, item.rot[1]*Math.PI/180, item.rot[2]*Math.PI/180)}
                  if (item.fpos) {mesh.userData.fpos = item.fpos}
                  if (item.type === "clickable") {mesh.userData.clickable = true}
                  if (item.camAngle) {mesh.userData.camAngle = item.camAngle}
                  if (item.text) {mesh.userData.text = item.text}
                  if (item.promote){
                    if (scope.objects[item.promote]) {
                      scope.objects[item.promote].push(mesh)
                    }else{
                      scope.objects[item.promote] = []
                      scope.objects[item.promote].push(mesh)
                    }
                  }
                  scope.scene.add(mesh)
                }


                callback();
              }
            )
          }
          else
          {
            if (item.type === "static" && scope.debug === false)
            {
              staticmeshes.push({"name": item.name, "mesh": geometry, "materialIndex": materials[item.material]})
            }
            else
            {
              let mesh = new THREE.Mesh(geometry, materialArray[materials[item.material]]);
              mesh.name = item.name
              if (item.pos) {mesh.position.set(item.pos[0], item.pos[1], item.pos[2])}
              if (item.size) {mesh.scale.set(item.size, item.size, item.size)}
              if (item.rot) {mesh.rotation.set(item.rot[0]*Math.PI/180, item.rot[1]*Math.PI/180, item.rot[2]*Math.PI/180)}
              if (item.fpos) {mesh.userData.fpos = item.fpos}
              if (item.type === "clickable") {mesh.userData.clickable = true}
              if (item.camAngle) {mesh.userData.camAngle = item.camAngle}
              if (item.text) {mesh.userData.text = item.text}
              if (item.promote){
                if (scope.objects[item.promote]) {
                  scope.objects[item.promote].push(mesh)
                }else{
                  scope.objects[item.promote] = [];
                  scope.objects[item.promote].push(mesh)
                }
              }
              scope.scene.add(mesh)
            }
            callback();
          }
        }
      )
    }

    function loadHdri(item, i, callback){
      scope.texloader.load(

        "./3D/"+scope.name+"/hdris/"+item.path,

        function(texture){
          texture.mapping = THREE.EquirectangularReflectionMapping;
          hdris[item.name] = texture;
          callback();
        }
      )
    }

    //Loops through the hdris, loading every single one
    //and setting it as a new child of the hdris variable
    //when finished runs the load meshes function
    scope.looper(scope.json.hdris, loadHdri, function(){

      //Loops through the objects, create a new material if it doesnt
      //exist for the mesh. If the mesh is static put it in the staticmeshes array
      //else just add it to the scene
      scope.looper(scope.json.objects, buildMesh, function(){

        if (staticmeshes.length > 1) {
          //Merge the meshes in the static meshes array
          scope.looper(staticmeshes, mergingMeshes, function(){

            addStaticMeshToScene(function(){
              scope.send();
            })

          })
        }else{
          scope.send();
        }

      })
    });

  }

  //Sends the scene back
  this.send = function(){
    scope.callback(scope.scene, scope.objects)
  }

  //Loads the josn DATA
  this.load = function(jsonpath, callback){
    //Load the entire JSON File
    this.callback = callback;
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonpath, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            scope.json = JSON.parse(xobj.responseText);
            scope.createScene();

        }
    }
    xobj.send(null);

  }

}
