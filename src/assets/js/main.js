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
        earthObject.earth.add(earthObject.earthMesh);
        earthObject.earth.add(earthObject.cloudsMesh);
        objectGroup.add(earthObject.earth);
        objectGroup.add(PLANET_UTIL.Planets.createSkyBox());
        scene.add(objectGroup);
    },
    setMarker = function(listBranchList){

        var rad = Math.PI / 180;
              
        listBranchList.forEach(function(element) {
            var marker = UTIL.Functions.createPin(0.002, 0.002, 0.002);    
            marker.name = element.nameBranch.replace(/ /g, '-').toLowerCase();
            marker.quaternion.setFromEuler(new THREE.Euler(0, element.longitude * rad, element.latitude * rad, "YZX")); 
            markers.push(marker);
            earthObject.earth.add(marker);
        });

    },
    loadRender = function () {
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);
        container.appendChild(renderer.domElement);
    },
    setControls = function () {
        controls = new THREE.OrbitControls(cameraContainer.camera);
        controls.minDistance = 65;
        controls.maxDistance = 230;
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
        earthObject.cloudsMesh.rotation.y += 0.0001;
        updateScene();
    },
    setCamera = function(){
       
        cameraContainer.camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100000);
        cameraContainer.camera.position.set(0, 0, 150);
        cameraContainer.cameraOriginalPosition = new THREE.Vector3(cameraContainer.camera.position.x, cameraContainer.camera.position.y, cameraContainer.camera.position.z);
      
    },
    init = function () {
        container = document.createElement("div");
        container.setAttribute("id", "container_webgl");
        document.getElementsByClassName("render-container")[0].appendChild(container);
        loadRender();
        lights();
        createGeometry();    
        setCamera();
        setMarker(dataList);
        setControls();
        TWEENS.runners.createTweensByGeoPosition(dataList, cameraContainer);
        TWEENS.runners.runnersContainer[TWEENS.runners.processId].delay(3000).start();
        animate();
    }

    window.onload = init;
    
    return {
        scene: scene
    }

})();