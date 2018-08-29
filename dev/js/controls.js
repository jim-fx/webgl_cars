exports.CarVizControls = function(camera, scene, domElement, THREE) {

  var scope = this;

  this.debug = false;

  this.savePos = true;

  //General Stuff
  this.lookSpeed = 1.4,
  this.camera = camera;
  this.target;
  this.type = "fp";

  this.prevCamRot = new THREE.Vector2();

  //Limiting Angles
  this.maxAzimuthAngle = -1337,
  this.minAzimuthAngle = 1337,
  this.maxPolarAngle = -1,
  this.minPolarAngle = 1;

  this.zoom = true;
  this.zoomSpeed = 0.002;
  this.maxZoom = 12;
  this.minZoom = 4.8;

  //Auto Rotation Stuff
  this.autoRotate = false,
  this.autoRotateMaxSpeed = 0.001,
  this.autoRotateTimer = 240;

  //Drag Stuff
  this.drag = true,
  this.dragMultiplier = 2,
  this.dragStrength = 0.4,
  this.dragVector = new THREE.Vector2();

  //Mouse events
  this.pressed,

  this.m1 = new THREE.Vector2(),
  this.m2 = new THREE.Vector2(),
  this.mVector = new THREE.Vector2(),
  this.length,
  this.mouseArray = [];

  //////////////////////////////////////////
  // Here comes the brain of the scope //
  //////////////////////////////////////////

  //Some simple functions the scope uses
  this.math = new function(){
    //Clamp a number to two decimals
    this.twoDecimals = function(value){
      return (((value * 100).toFixed()) / 100)
    }

    //Linear Interpolate between two numbers
    this.lerp = function(value1, value2, alpha) {
      alpha = alpha < 0 ? 0 : alpha;
      alpha = alpha > 1 ? 1 : alpha;
      return value1 + (value2 - value1) * alpha;
    }

    //Clamp a number to the min and max
    this.clip = function(number, min, max) {
      return Math.max(min, Math.min(number, max));
    }

    //Is a number
    this.isNumber = function(n){
      return !isNaN(parseFloat(n) && isFinite(n));
    }

    //Easing Type
    this.easeInOutCubic = function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };

    this.easeInOutCubic = function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
  }

  //-----Eventhandlers-----//

  //Mouse stuff
  function handleMouseMove(event) {

    //Update the m1 vector to the cursor position
    scope.m1.x = (event.clientX / window.innerWidth) * 2 - 1;
    scope.m1.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //create the vector between m2, and m1
    scope.mVector.subVectors(scope.m1, scope.m2);
    //update scope.length to the length of the mVector
    scope.length = scope.mVector.lengthSq();

    if (scope.pressed === true) {

      //Update the scope with that vector
      rotate(scope.mVector)

      scope.mouseArray.push({
        x: scope.m1.x,
        y: scope.m1.y
      });
      if (scope.mouseArray.length > 10) {
        scope.mouseArray.splice(0, 1)
      };


    } else {

      scope.m1.x, scope.m2.x = (event.clientX / window.innerWidth) * 2 - 1;
      scope.m1.y, scope.m2.y = -(event.clientY / window.innerHeight) * 2 + 1;

    }

  }
  function handleMouseDown(event) {

    scope.dragMultiplier = 1.1;

    scope.prevCamRot.x = scope.target.rotation.x;
    scope.prevCamRot.y = scope.target.rotation.y;

    scope.m1.x = (event.clientX / window.innerWidth) * 2 - 1;
    scope.m1.y = -(event.clientY / window.innerHeight) * 2 + 1;

    scope.m2.x = scope.m1.x;
    scope.m2.y = scope.m1.y;

    scope.length = 0;
    scope.pressed = true;

  }
  function handleMouseUp(event) {

    scope.prevCamRot.x = scope.target.rotation.x;
    scope.prevCamRot.y = scope.target.rotation.y;

    scope.m2.x = (event.clientX / window.innerWidth) * 2 - 1;
    scope.m2.y = -(event.clientY / window.innerHeight) * 2 + 1;

    scope.pressed = false;

  }
  function handleMouseLeave(){
    scope.pressed = false;
  }
  function handleMouseScroll(event){
    scope.camera.position.z = scope.math.clip(scope.camera.position.z + scope.math.clip(event.deltaY, -100, 100)*scope.zoomSpeed, 5, 10);
  }

  //Touchy Stuff
  function handleTouchMove(){
    //Update the m1 vector to the cursor position
    scope.m1.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    scope.m1.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    //create the vector between m2, and m1
    scope.mVector.subVectors(scope.m1, scope.m2);
    //update scope.length to the length of the mVector
    scope.length = scope.mVector.lengthSq();
  }
  function handleTouchStart(){
    scope.dragMultiplier = 1.1;

    scope.prevCamRot.x = scope.target.rotation.x;
    scope.prevCamRot.y = scope.target.rotation.y;

    scope.m1.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    scope.m1.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    scope.m2.x = scope.m1.x;
    scope.m2.y = scope.m1.y;

    scope.length = 0;
    scope.pressed = true;

  }
  function handleTouchEnd(){

    scope.prevCamRot.x = scope.target.rotation.x;
    scope.prevCamRot.y = scope.target.rotation.y;

    scope.m2.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    scope.m2.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    scope.pressed = false;

  }

  let initDeviceOrientation;

  //Device orientation Stuff
  function handleOrientation(){
    if (initDeviceOrientation === undefined) {
      if (scope.math.isNumber(event.beta)) {
        initDeviceOrientation = {
          "alpha":event.beta,
          "beta":event.beta,
          "gamma":event.gamma
        }
      }
    }else{
      handleOrientation = function(){

      }
    }
    rotate();
  }

  //Keyboard stuff
  function handleKeyDown(event){

    let e = event;

    if (scope.debug === true) {

      console.log(e.key)

      switch (e.key) {
        case "Escape":

          console.log("Escaoe")

          break;

        case "w":
          scope.target.position.z -= 0.1;
          break;

        case "a":

          break;

        case "s":
          scope.target.position.z += 0.1;
          break;

        case "d":

          break;

        case "":

          break;

        case "Shift":

          break;
        default:
      }

    }else{

      switch (e.key) {
        case "Escape":

          if (scope.type === "orbit" && scope.activeObject) {
            let temp = new THREE.Object3D();
            temp.point = {x: (scope.activeObject.position.x - scope.activeObject.userData.fpos[0]),
                              y: 0,
                              z: (scope.activeObject.position.z - scope.activeObject.userData.fpos[1])};

            scope.setFP(temp);
          }

          break;
      }

    }
  }

  //-----Public Functions-----//
  this.setOrbit = function(target) {

    scope.dragMultiplier = 0;

    if (scope.type !== "anim") {

      scope.target.rotation.y = scope.target.rotation.y % (Math.PI * 2)

      if (scope.target.rotation.y > 0 && ((target.userData.camAngle[2] + target.userData.camAngle[3]) / 2) < 0) {
        scope.target.rotation.y -= Math.PI * 2
      }
      if (scope.target.rotation.y < 0 && ((target.userData.camAngle[2] + target.userData.camAngle[3]) / 2) > 0) {
        scope.target.rotation.y += Math.PI * 2
      }

      let i = 0;
      //Duration of the Animation
      let duration = 150;

      //Previous position of the camera target
      let prevPos = new THREE.Vector3().copy(this.target.position);
      //Next Position of the camera target
      let nextPos = new THREE.Vector3().copy(target.position);
      //Vertical offset of the focal point relative to the objects origin
      nextPos.y += target.userData.fpos[1];

      //Previous camera position
      let camPrev = new THREE.Vector3().copy(scope.camera.position);
      //Next Camera position
      let camNext = new THREE.Vector3(0, 0, target.userData.fpos[0]);

      //Camera target y rotation is calculated as the median between the objects max, and min Azimuth Angle
      let targetYPrev = scope.target.rotation.y;
      let targetYNext = (target.userData.camAngle[2] + target.userData.camAngle[3]) / 2;

      const int = setInterval(function() {
        scope.type = "anim";
        if (i < 70) {

          i++;

          let alpha = scope.math.easeInOutCubic(i / duration);

          prevPos.lerp(nextPos, alpha)
          camPrev.lerp(camNext, alpha)

          scope.camera.position.z = camPrev.z
          scope.target.position.x = prevPos.x
          scope.target.position.y = prevPos.y
          scope.target.position.z = prevPos.z
          scope.target.rotation.y = scope.math.lerp(targetYPrev, targetYNext, scope.math.clip((alpha * 6), 0, 1))

        } else {

          //Animation complete
          scope.type = "orbit";

          //Clear the animation interval
          clearInterval(int);

          //Set the limits on the scope
          scope.minPolarAngle = target.userData.camAngle[0];
          scope.maxPolarAngle = target.userData.camAngle[1];
          scope.minAzimuthAngle = target.userData.camAngle[2];
          scope.maxAzimuthAngle = target.userData.camAngle[3];

          //reset the interval
          i = 0;
        }

      }, 15);
    }
  }

  this.setFP = function(target) {

    scope.minPolarAngle = -0.5
    scope.maxPolarAngle = 0.5
    scope.minAzimuthAngle = -1337;
    scope.maxAzimuthAngle = 1337;

    scope.dragMultiplier = 0;


    if (scope.type !== "anim") {

      let i = 0;
      let duration = 150;
      let prevPos = new THREE.Vector3().copy(this.target.position);
      let nextPos = new THREE.Vector3().copy(target.point);
      let camPrev = new THREE.Vector3().copy(scope.camera.position);
      let camNext = new THREE.Vector3();

      nextPos.y += 1.6;

      const int = setInterval(function() {
        scope.type = "anim";
        if (i < 55) {

          i++;

          let alpha = scope.math.easeInOutCubic(i / duration);

          prevPos.lerp(nextPos, alpha)

          camPrev.lerp(camNext, alpha)

          scope.camera.position.z = camPrev.z
          scope.target.position.x = prevPos.x
          scope.target.position.y = prevPos.y
          scope.target.position.z = prevPos.z

        } else {
          scope.type = "fp";
          clearInterval(int);
          i = 0;
        }

      }, 15);
    }

  }

  this.reset = function() {
    let empty = new THREE.Object3D();
    empty.point = new THREE.Vector3(0, 0, 0)
    scope.setFP(empty)
  }

  //Update functions
  function rotate() {
    switch (scope.type) {
      case 'fp':

        scope.target.rotation.y = scope.prevCamRot.y + scope.mVector.x * scope.lookSpeed;
        scope.target.rotation.x = scope.math.clip((scope.prevCamRot.x - scope.mVector.y * scope.lookSpeed * 0.5), -0.5, 0.5)

        break;

      case "orbit":

        scope.target.rotation.y = scope.math.clip((scope.prevCamRot.y - scope.mVector.x * scope.lookSpeed), scope.minAzimuthAngle, scope.maxAzimuthAngle);
        scope.target.rotation.x = scope.math.clip((scope.prevCamRot.x + scope.mVector.y * scope.lookSpeed * 0.5), scope.minPolarAngle, scope.maxPolarAngle);

        break;

      case "anim":

        break;
      default:

    }

  }

  this.update = function() {

    //Save the camera position
    if (scope.savePos === true) {
      localStorage.camPosX = scope.target.position.x
      localStorage.camPosY = scope.target.position.y
      localStorage.camPosZ = scope.target.position.z
      localStorage.camRotX = scope.target.rotation.x
      localStorage.camRotY = scope.target.rotation.y
      localStorage.camRotZ = scope.target.rotation.z

    }


    //AUTO ROTATE
    if (scope.type === "orbit" && scope.autoRotate === true && scope.pressed === false) {

      switch (true) {

        case (scope.autoRotateTimer <= 10):
          //Last Stage
          scope.target.rotation.y = scope.math.clip((scope.target.rotation.y - scope.autoRotateMaxSpeed), scope.minAzimuthAngle, scope.maxAzimuthAngle);

          //MAKE IT BOUNCE!
          //INVERT THE ROTATION IF IT REACHES MIN OR MAX ROTATION
          if (scope.target.rotation.y === scope.minAzimuthAngle) {
            scope.autoRotateMaxSpeed = -scope.autoRotateMaxSpeed;
          }
          if (scope.target.rotation.y === scope.maxAzimuthAngle) {
            scope.autoRotateMaxSpeed = -scope.autoRotateMaxSpeed;
          }

          break;

          //Second Stage
        case (scope.autoRotateTimer <= 70):

          scope.autoRotateTimer -= 1
          scope.target.rotation.y = scope.math.clip((scope.target.rotation.y - scope.autoRotateMaxSpeed * (10 / scope.autoRotateTimer)), scope.minAzimuthAngle, scope.maxAzimuthAngle);

          break;

          //First Stage
        case (scope.autoRotateTimer > 70):

          scope.autoRotateTimer -= 1

          break;

      }


      } else {

        scope.autoRotateTimer = 240;

      }

    //DRAG
    if (scope.type !== "anim" && scope.pressed === false && scope.drag === true) {

      if (scope.dragMultiplier > 0) {
        scope.dragMultiplier -= 0.02;
      } else {
        scope.dragMultiplier = 0;
      }

      if (scope.dragMultiplier !== 0 && scope.mouseArray.length > 9) {

        scope.dragVector.x = (scope.mouseArray[8].x - scope.mouseArray[9].x) * scope.dragStrength
        scope.dragVector.y = (scope.mouseArray[8].y - scope.mouseArray[9].y) * scope.dragStrength

        scope.dragVector.multiplyScalar(scope.dragMultiplier)

        switch (scope.type) {
          case "fp":

            scope.target.rotation.y -= scope.dragVector.x;
            scope.target.rotation.x = scope.math.clip((scope.target.rotation.x + scope.dragVector.y), -0.5, 0.5)

            break;

          case "orbit":

            scope.target.rotation.y = scope.math.clip((scope.target.rotation.y + scope.dragVector.x), scope.minAzimuthAngle, scope.maxAzimuthAngle)
            scope.target.rotation.x = scope.math.clip((scope.target.rotation.x - scope.dragVector.y), scope.minPolarAngle, scope.maxPolarAngle)

            break;
          default:

        }
      }
    }

  }

  //Initial Function
  let init = function() {

    if (/Mobi/.test(navigator.userAgent)) {
      scope.drag = false;
      scope.autoRotate = false;
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("touchstart", handleTouchStart, false);
      window.addEventListener("touchend", handleTouchEnd, false);
      window.addEventListener("touchmove", handleTouchMove, false);
    }else{
      //Add the Eventlisteners
      domElement.addEventListener('mousemove', handleMouseMove, false);
      domElement.addEventListener('mousedown', handleMouseDown, false);
      domElement.addEventListener('mouseup', handleMouseUp, false);
      domElement.addEventListener('mouseleave', handleMouseLeave, false);
      if(scope.zoom){
        window.addEventListener('wheel', handleMouseScroll, {passive: true})
      }
      window.addEventListener('keydown', handleKeyDown, false);
    }

    scope.camera.position.z = 0.2;

    scope.target = new THREE.AxesHelper();
    scope.target.name = "scopeTarget"
    scope.target.position.set(0, 1.3, 0);
    scope.target.rotation.order = "YXZ"

    scope.target.add(scope.camera)
    scene.add(scope.target)

    scope.target.visible = false;
    if (localStorage.camPosX && scope.savePos === true) {
      scope.target.position.x = parseFloat(localStorage.camPosX);
      scope.target.position.y = parseFloat(localStorage.camPosY);
      scope.target.position.z = parseFloat(localStorage.camPosZ);
      scope.target.rotation.x = parseFloat(localStorage.camRotX);
      scope.target.rotation.y = parseFloat(localStorage.camRotY);
      scope.target.rotation.z = parseFloat(localStorage.camRotZ);
    }
  }
  init();
}
