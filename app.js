import * as base from "./src/js/modules/loader";
import { pin } from "./src/assets/model/Pin.obj";
import { cssBase } from "./src/style/base.css";
import { cssBulma } from "./src/style/bulmaswatch.min.css";
import { cssBulmaTheme } from "./src/style/bulma.theme.css";
import { image } from "./src/assets/textures/progress-image.jpg";
import { favicon } from "./src/assets/textures/favicon.png";
import TWEEN from "@tweenjs/tween.js";
import OrbitControls from 'three-orbitcontrols';
import firebase from 'firebase/app';
import '@firebase/database';

geoNavigation().init();

export function geoNavigation() {
  let scene;
  let controls;
  let renderer;
  let cameraContainer = {};
  let CANVAS_WIDTH = window.innerWidth;
  let CANVAS_HEIGHT = window.innerHeight;
  let objectGroup = new base.Object3D();
  let earthObject = {};
  let loadManager;
  let progress = {};
  let renderContainer; 
  var config = {
    apiKey: "AIzaSyCT5kOaMh_s0w16M9S1cNLlIn6mCrfhWJ8",
    authDomain: "geo-navigation.firebaseapp.com",
    databaseURL: "https://geo-navigation.firebaseio.com",
    projectId: "geo-navigation",
    storageBucket: "geo-navigation.appspot.com",
    messagingSenderId: "856376774252"
  };
  firebase.initializeApp(config);
  

  let createLoadManager = function() {
      
        let onLoad = function() {
          document.getElementById("start-container").setAttribute("class", "field is-grouped is-grouped-centered");
        };

        loadManager = new base.LoadingManager(onLoad);

        loadManager.onProgress = function(url, itemsLoaded, itemsTotal) {
          document.getElementById("progress-bar").setAttribute("value", itemsLoaded / itemsTotal * 100);
          document.getElementById("progress-bar").innerHTML = itemsLoaded / itemsTotal * 100 + "%";
        };

        loadManager.onError = function(url) {
          console.log("Error loading texture: " + url);
        };
    },
    createGeometry = function() {
      earthObject.earthMesh = base.createEarth(loadManager);
      earthObject.cloudsMesh = base.createEarthCloud(loadManager);
      earthObject.earth = new base.Object3D();
      earthObject.earth.add(earthObject.earthMesh);
      earthObject.earth.add(earthObject.cloudsMesh);
      objectGroup.add(earthObject.earth);
      objectGroup.add(base.createSkyBox(loadManager));
      scene.add(objectGroup);
    },
    setMarker = function(listBranchList) {
      let rad = Math.PI / 180;

      listBranchList.forEach(function(element) {
          //let marker = base.createPin(loadManager, 0.002, 0.002, 0.002, pin);
          let marker = base.createMarker();
          marker.name = element.city.replace(/ /g, "-").toLowerCase();
          marker.quaternion.setFromEuler(new base.Euler(0, element.longitude * rad, element.latitude * rad, "YZX"));
          earthObject.earth.add(marker);
      });
    },
    loadRender = function() {
        renderer = new base.WebGLRenderer({ antialias: false });
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);
        renderContainer = document.getElementsByClassName("render-container")[0];
        renderContainer.appendChild(renderer.domElement);
    },
    setControls = function() {
        controls = new OrbitControls(cameraContainer.camera);
        controls.minDistance = 65;
        controls.maxDistance = 230;
        controls.enabled = false;
    },
    lights = function() {
        let lightA = new base.DirectionalLight(0xffffff);
        lightA.position.set(0, 200, 0);
        objectGroup.add(lightA);
        let lightB = new base.DirectionalLight(0xffffff);
        lightB.position.set(200, -200, 0);
        objectGroup.add(lightB);
    },
    updateScene = function() {
        if (controls.enabled) {
          controls.update();
        }
        renderer.clear();
        renderer.render(scene, cameraContainer.camera);
    },
    updateTasks = function(time) {
      TWEEN.  update(time);
    },
    animate = function(time) {
        requestAnimationFrame(animate);
        updateTasks(time);
        earthObject.cloudsMesh.rotation.y += 0.0001;
        updateScene();
    },
    setCamera = function() {
        let aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
        let fov = 45;
        let near = 1;
        let far = 100000;
        cameraContainer.camera = new base.PerspectiveCamera(fov, aspect, near, far);
        cameraContainer.camera.position.set(0, 0, 150);
    },
    init = function() {

      var db = firebase.database();
      var ref = db.ref("/marked-places/places");
  
        if (base.Detector) {

          ref.once("value", function(snapshot) {
            var data = snapshot.val();   //Data is in JSON format.
            scene = new base.Scene();
            createLoadManager();
            loadRender();
            lights();
            createGeometry();
            setCamera();
            setControls();
            base.createRunners(data, cameraContainer, controls);
            setMarker(data);
            animate();
            
          });          
        } else {
          var warning = base.Detector.getWebGLErrorMessage();
          renderContainer.appendChild(warning);
        }
    
    };

    document.getElementById("start-container").addEventListener("click", function(event) {
        let parent = document.getElementById("app");
        parent.querySelectorAll(".is-invisible")[0].classList.remove("is-invisible");

        parent.removeChild(parent.querySelectorAll(".progress-countainer")[0]);
        base.tweenContainer().runnersContainer[base.tweenContainer().processId].delay(500).start();
    });

  return {
      init: init
  };
}
