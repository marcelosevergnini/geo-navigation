import * as base from "../js/modules/loader";
import { pin } from "../assets/model/Pin.obj";
import { cssBase } from "../style/base.css";
import { cssBulma } from "../style/bulmaswatch.min.css";
import { cssBulmaTheme } from "../style/bulma.theme.css";
import { image } from "../assets/textures/progress-image.jpg";

const OrbitControls = require("three-orbitcontrols");
var TWEEN = require("@tweenjs/tween.js");

geoNavigation().init();

export function geoNavigation() {
  var scene,
    controls,
    renderer,
    stats,
    renderer,
    markers = [];
  var cameraContainer = {};
  var CANVAS_WIDTH = window.innerWidth,
    CANVAS_HEIGHT = window.innerHeight;
  var objectGroup = new base.Object3D();
  var earthObject = {};
  var loadManager;
  var progress = {};

  let createLoadManager = function() {
      var onLoad = function() {
        document
          .getElementById("start-container")
          .setAttribute("class", "field is-grouped is-grouped-centered");
      };
      loadManager = new base.LoadingManager(onLoad);

      loadManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        document
          .getElementById("progress-bar")
          .setAttribute("value", itemsLoaded / itemsTotal * 100);
        document.getElementById("progress-bar").innerHTML =
          itemsLoaded / itemsTotal * 100 + "%";
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
      var rad = Math.PI / 180;

      listBranchList.forEach(function(element) {
        //var marker = base.createPin(loadManager, 0.002, 0.002, 0.002, pin);
        var marker = base.createMarker();
        marker.name = element.nameBranch.replace(/ /g, "-").toLowerCase();
        marker.quaternion.setFromEuler(
          new base.Euler(
            0,
            element.longitude * rad,
            element.latitude * rad,
            "YZX"
          )
        );
        markers.push(marker);
        earthObject.earth.add(marker);
      });
    },
    loadRender = function() {
      renderer = new base.WebGLRenderer({ antialias: false });
      renderer.setClearColor(0xf0f0f0);
      renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);
    },
    setControls = function() {
      controls = new OrbitControls(cameraContainer.camera);
      controls.minDistance = 65;
      controls.maxDistance = 230;
      controls.enabled = false;
    },
    lights = function() {
      var lightA = new base.DirectionalLight(0xffffff);
      lightA.position.set(0, 200, 0);
      objectGroup.add(lightA);
      var lightB = new base.DirectionalLight(0xffffff);
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
      TWEEN.update(time);
    },
    animate = function(time) {
      requestAnimationFrame(animate);
      updateTasks(time);
      earthObject.cloudsMesh.rotation.y += 0.0001;
      updateScene();
    },
    setCamera = function() {
      cameraContainer.camera = new base.PerspectiveCamera(
        45,
        CANVAS_WIDTH / CANVAS_HEIGHT,
        1,
        100000
      );
      cameraContainer.camera.position.set(0, 0, 150);
      cameraContainer.cameraOriginalPosition = new base.Vector3(
        cameraContainer.camera.position.x,
        cameraContainer.camera.position.y,
        cameraContainer.camera.position.z
      );
    },
    init = function() {
      scene = new base.Scene();

      createLoadManager();
      loadRender();
      document
        .getElementsByClassName("render-container")[0]
        .appendChild(renderer.domElement);
      lights();
      createGeometry();
      setCamera();
      setControls();
      base.createRunners(base.getData(), cameraContainer, controls);
      //TWEENS.runners.createTweensByGeoPosition(dataList, cameraContainer);
      setMarker(base.getData());
      animate();
    };

  document
    .getElementById("start-container")
    .addEventListener("click", function(event) {
      var parent = document.getElementById("app");
      parent
        .querySelectorAll(".is-invisible")[0]
        .classList.remove("is-invisible");

      parent.removeChild(parent.querySelectorAll(".progress-countainer")[0]);
      base
        .tweenContainer()
        .runnersContainer[base.tweenContainer().processId].delay(500)
        .start();
    });

  return {
    init: init
  };
}
