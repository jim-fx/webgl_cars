/*jshint esversion: 6 */
//Require all the stuff
const THREE = require("./three.min.js").THREE;
const scnl = require("./loader.js");
const CarVizControls = require("./controls.js");

//////////////////////////////
////Generate General Stuff////
//////////////////////////////

const scene = new THREE.Scene();
window.scene = scene;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setPixelRatio(devicePixelRatio || 2);
renderer.localClippingEnabled = true;
window.renderer = renderer;

const controls = new CarVizControls.CarVizControls(camera, scene, renderer.domElement, THREE);

const manager = new THREE.LoadingManager();

const loader = new scnl.sceneLoader(manager, scene, THREE);

var localPlane = new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 4 );
var wirePlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), -4 );
window.localPlane = localPlane;
renderer.clippingPlanes = [];
renderer.localClippingEnabled = true;

//Every scene has different objects, so every scene needs
//a different init function

let renderFunction = function(){};
let initFunction = function(){};

const initFunctions = {
  "challenger": function(){

    let ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambLight);

    objects.windows[0].updateMatrix();
    objects.chassi[0].material.clippingPlanes = [localPlane];
    objects.wireframe[0].material.clippingPlanes = [wirePlane];

    //Assign Children
    let children = ["wireframe", "windows", "groundshadow", "seats" ];
    for (let i = 0; i < children.length; i++) {
      for (let j = 0; j < objects[children[i]].length; j++) {
        objects.chassi[0].add(objects[children[i]][j]);
      }
    }

    //Create tire Parents
    objects.tireParents = [];
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tireParents[i] = new THREE.Group();
      objects.tireParents[i].position.copy(objects.tires[i].position);
    }

    //Add tires to tire parents‚
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tires[i].position.set(0, 0, 0);
      objects.tireParents[i].add(objects.tires[i]);
      scene.add(objects.tireParents[i]);
    }

    controls.setOrbit(objects.chassi[0]);

    objects.windows[0].material.clippingPlanes = [localPlane];

    objects.chassi[0].add(objects.tireParents[0]);
    objects.chassi[0].add(objects.tireParents[1]);
    objects.chassi[0].add(objects.tireParents[2]);
    objects.chassi[0].add(objects.tireParents[3]);

  },
  "delorean": function(){
    renderer.setClearColor(0xff0000);

    let ambLight = new THREE.AmbientLight(0xff0000, 0.5);
    scene.add(ambLight);

    console.log(objects);

    //objects.windows[0].updateMatrix();
    objects.chassi[0].material.clippingPlanes = [localPlane];
    //objects.wireframe[0].material.clippingPlanes = [wirePlane]

    //Assign Children
    let children = ["windows", "mirrors", "flaps", "lights", "grill"];
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < objects[children[i]].length; j++) {
        objects.chassi[0].add(objects[children[i]][j]);
      }
    }

    //Create tire Parents
    objects.tireParents = [];
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tireParents[i] = new THREE.Group();
      objects.tireParents[i].position.copy(objects.tires[i].position);
    }

    //Add tires to tire parents‚
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tires[i].position.set(0, 0, 0);
      objects.tireParents[i].add(objects.tires[i]);
      scene.add(objects.tireParents[i]);
    }

    controls.setOrbit(objects.chassi[0]);

    objects.windows[0].material.clippingPlanes = [localPlane];

    objects.chassi[0].add(objects.tireParents[0]);
    objects.chassi[0].add(objects.tireParents[1]);
    objects.chassi[0].add(objects.tireParents[2]);
    objects.chassi[0].add(objects.tireParents[3]);

  },
  "dwfb": function(){

    let ambLight = new THREE.AmbientLight(0xffeeee, 0.2);
    scene.add(ambLight);

    objects.windows[0].updateMatrix();
    objects.chassi[0].material.clippingPlanes = [localPlane];
    objects.wireframe[0].material.clippingPlanes = [wirePlane];

    //Assign Children
    let children = ["wireframe", "windows", "groundshadow", "seats" ];
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < objects[children[i]].length; j++) {
        objects.chassi[0].add(objects[children[i]][j]);
      }
    }

    //Create tire Parents
    objects.tireParents = [];
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tireParents[i] = new THREE.Group();
      objects.tireParents[i].position.copy(objects.tires[i].position);
    }

    //Add tires to tire parents‚
    for (let i = 0; i < objects.tires.length; i++) {
      objects.tires[i].position.set(0, 0, 0);
      objects.tireParents[i].add(objects.tires[i]);
      scene.add(objects.tireParents[i]);
    }

    controls.setOrbit(objects.chassi[0]);

    objects.windows[0].material.clippingPlanes = [localPlane];

    objects.chassi[0].add(objects.tireParents[0]);
    objects.chassi[0].add(objects.tireParents[1]);
    objects.chassi[0].add(objects.tireParents[2]);
    objects.chassi[0].add(objects.tireParents[3]);

  }
};
const renderFunctions = {
  "challenger": function(){

      objects.tires[0].rotation.x -= userInput.speed;
      objects.tires[1].rotation.x -= userInput.speed;
      objects.tires[2].rotation.x -= userInput.speed;
      objects.tires[3].rotation.x -= userInput.speed;

      localPlane.normal.x = -userInput.steering;
      wirePlane.normal.x = userInput.steering;

      objects.tireParents[2].rotation.y = userInput.steeringOffset*10;
      objects.tireParents[3].rotation.y = userInput.steeringOffset*10;


      objects.ground[0].material.map.offset.y += userInput.speed/18;
      objects.ground[0].material.map.offset.x -= (userInput.steering/18 + userInput.steeringOffset/4)*userInput.speed;

      objects.chassi[0].rotation.y = userInput.steering;
      objects.chassi[0].rotation.z = userInput.steeringOffset/4;

    },
  "delorean": function(){
      objects.tires[0].rotation.x += userInput.speed;
      objects.tires[1].rotation.x += userInput.speed;
      objects.tires[2].rotation.x += userInput.speed;
      objects.tires[3].rotation.x += userInput.speed;

      localPlane.normal.x = -userInput.steering;
      wirePlane.normal.x = userInput.steering;

      objects.tireParents[0].rotation.y = userInput.steeringOffset*10;
      objects.tireParents[1].rotation.y = userInput.steeringOffset*10;


      objects.ground[0].material.map.offset.y -= userInput.speed/18;
      objects.ground[0].material.map.offset.x += (userInput.steering/18 + userInput.steeringOffset/4)*userInput.speed;

      objects.chassi[0].rotation.y = userInput.steering;
      objects.chassi[0].rotation.z = -userInput.steeringOffset/4;
    },
  "dwfb": function(){

      objects.tires[0].rotation.x -= userInput.speed;
      objects.tires[1].rotation.x -= userInput.speed;
      objects.tires[2].rotation.x -= userInput.speed;
      objects.tires[3].rotation.x -= userInput.speed;

      localPlane.normal.x = -userInput.steering;
      wirePlane.normal.x = userInput.steering;

      objects.tireParents[2].rotation.y = userInput.steeringOffset*10;
      objects.tireParents[3].rotation.y = userInput.steeringOffset*10;


      objects.ground[0].material.normalMap.offset.y += userInput.speed/18;
      objects.ground[0].material.normalMap.offset.x -= (userInput.steering/18 + userInput.steeringOffset/4)*userInput.speed;

      objects.chassi[0].rotation.y = userInput.steering;
      objects.chassi[0].rotation.z = userInput.steeringOffset/4;

    },
};

const helpers = {
  elastic: function(t){
      let x1 = 4.7; //4.78|11|30|80
    	return (-Math.sin(x1-t*t*x1)*(1-t));
  },
  lerp: function(alpha, v1, v2){
    return (1 - alpha) * v1 + alpha * v2;
  },
  clamp: function(num, min, max){
    return Math.max(min, Math.min(num, max));
  }
};

const userInput = new function(){

  var scope = this;

  this.strength = 0.001;

  this.speed = 0;
  this.speedStrength = 0.5;
  this.speedOffset = 0;
  this.speedKey = 0;

  this.steering = 0;
  this.steeringStrength = 0.003;
  this.steeringOffset = 0;
  this.steeringKey = 0;

  this.update = function(){

    //Update Speed
    if (scope.speedKey === 0) {
      scope.speed *= 0.98;
      scope.speedOffset *= 0.8;
    }else{
      if (0.05 > scope.speedOffset && scope.speedOffset > -0.01) {
        scope.speedOffset += scope.speedKey;
      }

      if (0.5 > scope.speed && scope.speed > -0.1) {
        scope.speed += scope.speedOffset*scope.speedStrength;
      }
    }

    //Update steering
    if (scope.steeringKey === 0) {
      //Decrease steeringoffset over time
      scope.steeringOffset *= 0.99;
    }else{
        switch (scope.steeringKey) {

          case 1:
            if (scope.steeringOffset > -0.06) {
              scope.steeringOffset -= scope.steeringStrength;
            }
            break;
          case -1:
            if (scope.steeringOffset < 0.06) {
              scope.steeringOffset += scope.steeringStrength;
            }
            break;

        }
    }

    if (scope.steering > -0.6 && scope.steering < 0.6) {
      scope.steering += scope.steeringOffset * scope.speed/5;
    }else{
      scope.steering *= 0.999;
    }
    
  };

  this.init = function(){
    window.addEventListener("keydown", function(){
      switch(event.key){
        case "ArrowRight":
          scope.steeringKey = 1;
          break;
        case "ArrowLeft":
          scope.steeringKey = -1;
          break;
        case "ArrowUp":
          scope.speedKey = 0.01;
          break;
        case "ArrowDown":
          scope.speedKey = -0.002;
          break;
      }
    });
    window.addEventListener("keyup", function(){
      switch(event.key){
        case "ArrowRight":
          scope.steeringKey = 0;
          break;
        case "ArrowLeft":
          scope.steeringKey = 0;
          break;
        case "ArrowDown":
          scope.speedKey = 0;
          break;
        case "ArrowUp":
          scope.speedKey = 0;
          break;
      }
    });
    document.getElementById("range").addEventListener("input", function(){
      localPlane.constant = (this.value)/100*8-4;
      wirePlane.constant = (100-this.value)/100*8-4;
    });
  };

  this.init();

};

function render(){

  requestAnimationFrame(render);
  renderer.render(scene, camera);

  userInput.update();

  renderFunction();

  controls.update();

}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let sceneName;
function init(){

  //Setting up the rendering canvas
  let canvas = renderer.domElement;
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  document.body.appendChild(canvas);

  //Loading the scene from "scenename".json;
  loader.load("./3D/"+sceneName+"/"+sceneName+".json", function(scene, tempObs){

    objects = tempObs;
    window.objects = objects;

    initFunction(scene);

    loadingOut();

    render();


  });


}

function gup( name ) {
  let url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

sceneName = gup("scene");
initFunction = initFunctions[sceneName];
renderFunction = renderFunctions[sceneName];
init();
