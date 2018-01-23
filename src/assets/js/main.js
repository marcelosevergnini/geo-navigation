var demo = (function() {

    "use strict";

    var container, camera, scene = new THREE.Scene(), controls, renderer, stats, renderer, markers = [];
    var cameraContainer = {}
    var CANVAS_WIDTH = window.innerWidth,CANVAS_HEIGHT = window.innerHeight;
    var objectGroup = new THREE.Object3D();
    var earthObject = {}
    var objectToMove;

    var createGeometry = function(){
        earthObject.earthMesh = PLANET_UTIL.Planets.createEarth();
        earthObject.cloudsMesh = PLANET_UTIL.Planets.createEarthCloud();
        earthObject.earth = new THREE.Object3D();
        var sphereAxis = new THREE.AxesHelper(100);
        earthObject.earth.add(earthObject.earthMesh);
        earthObject.earth.add(earthObject.cloudsMesh);
        earthObject.earth.add(sphereAxis);
        objectGroup.add(earthObject.earth);
        scene.add(objectGroup);
    },
    createSkyBox = function(){
   
        var texture	= new THREE.TextureLoader().load('src/assets/textures/galaxy_starfield.png')
        var material = new THREE.MeshBasicMaterial({map	: texture, side : THREE.BackSide})
        var geometry = new THREE.SphereGeometry(1000, 32, 32)
        var mesh = new THREE.Mesh(geometry, material)
        objectGroup.add(mesh);

    },
    setMarker = function(listBranchList){

        var rad = Math.PI / 180;
              
        listBranchList.forEach(function(element) {
            var marker = UTIL.Functions.createPin();    
            marker.name = element.nameBranch.replace(/ /g, '-').toLowerCase();
            marker.quaternion.setFromEuler(new THREE.Euler(0, element.longitude * rad, element.latitude * rad, "YZX")); 
            markers.push(marker);
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
        controls = new THREE.OrbitControls(cameraContainer.camera);
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
        earthObject.cloudsMesh.rotation.y += 0.0003;
        updateScene();
    },
    setCamera = function(){
       
        cameraContainer.camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100000);
        cameraContainer.camera.position.set(0, 0, 150);
        cameraContainer.cameraOriginalPosition = new THREE.Vector3(cameraContainer.camera.position.x, cameraContainer.camera.position.y, cameraContainer.camera.position.z);
      
    },
    init = function () {

        container = document.getElementById("container");
        loadRender();
        lights();
        createGeometry();    
        setCamera();
        createSkyBox();
        setMarker(dataList);
        setControls();
        //UTIL.Functions.setGuiObjectRotation(cameraContainer.camera);
        TWEENS.runners.createTweensByGeoPosition(dataList, cameraContainer);
        TWEENS.runners.runnersContainer[TWEENS.runners.processId].delay(3000).start();
        animate();
    }

    window.onload = init;
    
    return {
        scene: scene
    }

})();