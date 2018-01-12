var demo = (function() {

    "use strict";

    var container, camera, scene = new THREE.Scene(), controls, renderer, stats, renderer, earth, earthCloud, objectEarth;
    var CANVAS_WIDTH = window.innerWidth,CANVAS_HEIGHT = window.innerHeight;

    var createGeometry = function(){

        var earthTexture = new THREE.TextureLoader().load('assets/textures/world-big.jpg');
        var earthGeometry = new THREE.SphereGeometry(50, 32, 32);
        earthGeometry.computeFaceNormals();
       earthGeometry.mergeVertices();
        earthGeometry.computeVertexNormals();
        var earthMesh = new THREE.MeshBasicMaterial({map: earthTexture});
        earth = new THREE.Mesh(earthGeometry, earthMesh);
        earth = THREEx.Planets.createEarth();
        //earthCloud = THREEx.Planets.createEarthCloud();
        
    },
    createMarker = function(){
        var pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0,10), new THREE.MeshPhongMaterial({color: 0xff5c01}));
        pointer.position.set(55, 0, 0);
        pointer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
        var marker = new THREE.Object3D();
        marker.add(pointer);
        return marker;
    },
    setMarker = function(listBranchList){
        var rad = Math.PI / 180;
              
        listBranchList.forEach(function(element) {
            var marker = createMarker();    
            marker.name = element.nameBranch.replace(/ /g, '-').toLowerCase();
            marker.quaternion.setFromEuler(new THREE.Euler(0, element.longitude * rad, element.latitude * rad, "YZX")); 
            var text = createText(element.nameBranch, element.nameBranch);
            objectEarth.add(marker);
        });
        
    },
    loadData = function(){
        var listBranchList = [
            { id: 1, nameBranch: 'diconiun Lisbon', longitude: -9.141870, latitude: 38.717756 },
            { id: 2, nameBranch: 'diconium Stuttgart', longitude: 9.212767, latitude: 48.813548 },
            { id: 3, nameBranch: 'diconium São José', longitude: -122.057543, latitude: 37.387474 },
            { id: 4, nameBranch: 'diconium Karlsruhe', longitude: 8.403653, latitude: 49.006890 },
            { id: 5, nameBranch: 'diconium Hamburg', longitude: 9.993682, latitude: 53.551085 },
            { id: 6, nameBranch: 'diconium Berlin', longitude: 13.404954, latitude: 52.520007 }
        ];
        return listBranchList;
    },
    setupEarth = function(){
        objectEarth = new THREE.Object3D();
        objectEarth.add(earth);
        objectEarth.position.x = -30;
        earthCloud.position.x = -30;
        scene.add(objectEarth);
        scene.add(earthCloud);
    },
    loadRender = function () {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);
        container.appendChild(renderer.domElement);
    },
    setControls = function () {
        controls = new THREE.TrackballControls(camera, container);
    },
    lights = function () {
        var lightA = new THREE.DirectionalLight(0xffffff);
        lightA.position.set(0, 200, 0);
        scene.add(lightA);
        var lightB = new THREE.DirectionalLight(0xffffff);
        lightB.position.set(200, -200, 0);
        scene.add(lightB);
    },
    updateScene = function () {
        renderer.clear();
        renderer.render(scene, camera);
    },
    updateBussines = function(){
        objectEarth.rotation.x += 0.0002;
        earthCloud.rotation.x += 0.0001;

        
        controls.update();
    },
    animate = function () {
        requestAnimationFrame(animate);
        updateBussines();
        updateScene();
    },
    setCamera = function(){
        camera = new THREE.PerspectiveCamera(25, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
        camera.position.set(0, 110, 200);
    },
    createText = function(textContent, name) {

        var loader = new THREE.FontLoader();

    },
    init = function () {

        container = document.getElementById("container");
        loadRender();
        setCamera();
        setControls();
        createGeometry();    
        setupEarth();
        lights();
        setMarker(loadData());
        animate();
    }

    window.onload = init;
    
    return {
        scene: scene,
        camera : camera
    }

})();