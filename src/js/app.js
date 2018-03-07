import * as base from "../js/modules/loader";
import { pin } from "../assets/model/Pin.obj";
import { cssBase } from "../style/base.css";
import { cssBulma } from "../style/bulmaswatch.min.css";
import { cssBulmaTheme } from "../style/bulma.theme.css";
import { image } from "../assets/textures/progress-image.jpg";
import { favicon } from "../assets/textures/favicon.png";
const OrbitControls = require("three-orbitcontrols");
const TWEEN = require("@tweenjs/tween.js");

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
          marker.name = element.nameBranch.replace(/ /g, "-").toLowerCase();
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

        if (base.Detector) {
          scene = new base.Scene();
          createLoadManager();
          loadRender();
          lights();
          createGeometry();
          setCamera();
          setControls();
          base.createRunners(base.getData(), cameraContainer, controls);
          setMarker(base.getData());
          animate();
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
