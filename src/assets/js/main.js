var demo = (function() {

    "use strict";

    var container, camera, scene = new THREE.Scene(), controls, renderer, stats, renderer, markers = [];
    var cameraContainer = {}
    var CANVAS_WIDTH = window.innerWidth,CANVAS_HEIGHT = window.innerHeight;
    var objectGroup = new THREE.Object3D();
    var earthObject = {}
    var tweens = {};
    tweens.runners = [];
    tweens.processId = 0;
    
    var createGeometry = function(){
        earthObject.earthMesh = PLANET_UTIL.Planets.createEarth();
        earthObject.cloudsMesh = PLANET_UTIL.Planets.createEarthCloud();
        earthObject.earth = new THREE.Object3D();
        earthObject.earth.add(earthObject.earthMesh);
        earthObject.earth.add(earthObject.cloudsMesh);
        objectGroup.add(earthObject.earth);
        scene.add(objectGroup);
    },
    convertLatLonToVec3	= function(lat,lon){
        lat =  lat * Math.PI / 180.0;
        lon = -lon * Math.PI / 180.0;
        return new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
    },
    creaSkyBox = function(){
   
        var texture	= new THREE.TextureLoader().load('src/assets/textures/galaxy_starfield.png')
        var material = new THREE.MeshBasicMaterial({map	: texture, side : THREE.BackSide})
        var geometry = new THREE.SphereGeometry(1000, 32, 32)
        var mesh = new THREE.Mesh(geometry, material)
        objectGroup.add(mesh);

    },
    createPin = function(id){

        var marker = new THREE.Object3D();
        var loader = new THREE.OBJLoader();
        loader.load( 'src/assets/models/Pin.obj', function ( object ) {
            object.traverse( function ( child ) {
                if (child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial( { 
                        color: 0xff5c01, 
                        specular: 0x050505,
                        shininess: 100
                    });
                    object.scale.set(0.005,0.005,0.005);
                    object.position.set(51, 0, 0);
                    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
                }
            });
            object.rotateX((70 * Math.PI) / 180);
            object.rotateY((125 * Math.PI) / 180);
            object.rotateZ((0 * Math.PI) / 180);
            marker.add(object);
        });
        return marker;  
    },
    setMarker = function(listBranchList){
        var rad = Math.PI / 180;
              
        listBranchList.forEach(function(element) {
            var marker = createPin();    
            marker.name = element.nameBranch.replace(/ /g, '-').toLowerCase();
            marker.quaternion.setFromEuler(new THREE.Euler(0, element.longitude * rad, element.latitude * rad, "YZX")); 
            markers.push(marker);
            //cameraContainer.camera.add(marker);
            earthObject.earth.add(marker);
        });

    },
    loadRender = function () {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);
        container.appendChild(renderer.domElement);
    },
    setControls = function () {
        controls = new THREE.OrbitControls( cameraContainer.camera);
    },
    lights = function () {
        var lightA = new THREE.DirectionalLight(0xffffff);
        lightA.position.set(0, 200, 0);
        objectGroup.add(lightA);
        var lightB = new THREE.DirectionalLight(0xffffff);
        lightB.position.set(200, -200, 0);
        objectGroup.add(lightB);
    },
    updateScene = function () {
        controls.update();
        renderer.clear();
        renderer.render(scene, cameraContainer.camera);
    },
    updateTasks = function(time){
        TWEEN.update(time);
    },
    animate = function (time) {
        requestAnimationFrame(animate);
        updateTasks(time);
        updateScene();
    },
    setCamera = function(){
        cameraContainer.camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100000);
        cameraContainer.camera.position.set(0, 0, 150);
        cameraContainer.cameraOriginalPosition = new THREE.Vector3(cameraContainer.camera.position.x, cameraContainer.camera.position.y, cameraContainer.camera.position.z);
    },
    createTweens = function(){

        tweens.original = new TWEEN.Tween(cameraContainer.camera.position).to(cameraContainer.cameraOriginalPosition, 3000).easing(TWEEN.Easing.Quadratic.Out)
        .onStart(function(){})
        .onComplete(function(){
            tweens.processId = tweens.processId + 1;
            if(tweens.processId > dataList.length){
                tweens.processId = 1;
            }
            tweens.runners[tweens.processId].delay(1000).start();
        });

        dataList.forEach(function(element) {
            var currentPosition = UTIL.Functions.convertLatLonToVec3(element.latitude,element.longitude).multiplyScalar(52.5);
            //var current = { x: cameraContainer.camera.position.x, y: cameraContainer.camera.position.y, z: cameraContainer.camera.position.z  };
            //var target = { x: (currentPosition.x), y: (currentPosition.y), z: 0};
            var currentTween = new TWEEN.Tween(cameraContainer.camera.position).to(currentPosition, 3000).easing(TWEEN.Easing.Quadratic.Out)
            .onStart(function(){})
            .onComplete(function(){});
            currentTween.chain(tweens.original.delay(3000));
            tweens.runners.push(currentTween);
        });      
    },
    init = function () {

        container = document.getElementById("container");
        loadRender();
      
        lights();
        createGeometry();    
        setCamera();
        creaSkyBox();
        setMarker(dataList);
        setControls();
        //UTIL.Functions.setGuiObjectRotation(cameraContainer.camera);
        createTweens();
        tweens.runners[tweens.processId].delay(3000).start();
        animate();
    },
    addZoom = function(value){
        cameraContainer.camera.position.z = value;
    }

    window.onload = init;
    
    return {
        scene: scene,
        tweens : tweens,
        addZoom : addZoom
    }

})();