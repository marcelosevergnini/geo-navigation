import {
  TextureLoader,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Color,
  MeshBasicMaterial,
  Texture,
  DoubleSide,
  BackSide
} from "three";

import worldBig from "../../assets/textures/world-big.jpg";
import earthcloudmaptrans from "../../assets/textures/earthcloudmaptrans.jpg";
import earthcloudmap from "../../assets/textures/earthcloudmap.jpg";
import galaxy_starfield from "../../assets/textures/galaxy_starfield.png";

const path = require("path");

const resolvePath = (pathToResolve = "") =>
  path.resolve(__dirname, pathToResolve);

export function createEarth(manager) {
  var mapLoader = new TextureLoader(manager).load(worldBig);
  var bumpMapLoader = new TextureLoader(manager).load(worldBig);
  var specularMapLoader = new TextureLoader(manager).load(worldBig);

  var geometry = new SphereGeometry(50, 32, 32);
  var material = new MeshPhongMaterial({
    map: mapLoader,
    bumpMap: bumpMapLoader,
    bumpScale: 0.05,
    shininess: 100,
    specularMap: specularMapLoader,
    specular: new Color("grey")
  });
  var mesh = new Mesh(geometry, material);
  return mesh;
}

export function createEarthCloud(manager) {
  // create destination canvas
  var canvasResult = document.createElement("canvas");
  canvasResult.width = 1024;
  canvasResult.height = 512;
  var contextResult = canvasResult.getContext("2d");

  // load earthcloudmap
  var imageMap = new Image();
  imageMap.addEventListener(
    "load",
    function() {
      // create dataMap ImageData for earthcloudmap
      var canvasMap = document.createElement("canvas");
      canvasMap.width = imageMap.width;
      canvasMap.height = imageMap.height;
      var contextMap = canvasMap.getContext("2d");
      contextMap.drawImage(imageMap, 0, 0);
      var dataMap = contextMap.getImageData(
        0,
        0,
        canvasMap.width,
        canvasMap.height
      );

      // load earthcloudmaptrans
      var imageTrans = new Image();
      imageTrans.addEventListener("load", function() {
        // create dataTrans ImageData for earthcloudmaptrans
        var canvasTrans = document.createElement("canvas");
        canvasTrans.width = imageTrans.width;
        canvasTrans.height = imageTrans.height;
        var contextTrans = canvasTrans.getContext("2d");
        contextTrans.drawImage(imageTrans, 0, 0);
        var dataTrans = contextTrans.getImageData(
          0,
          0,
          canvasTrans.width,
          canvasTrans.height
        );
        // merge dataMap + dataTrans into dataResult
        var dataResult = contextMap.createImageData(
          canvasMap.width,
          canvasMap.height
        );
        for (var y = 0, offset = 0; y < imageMap.height; y++) {
          for (var x = 0; x < imageMap.width; x++, offset += 4) {
            dataResult.data[offset + 0] = dataMap.data[offset + 0];
            dataResult.data[offset + 1] = dataMap.data[offset + 1];
            dataResult.data[offset + 2] = dataMap.data[offset + 2];
            dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
          }
        }
        // update texture with result
        contextResult.putImageData(dataResult, 0, 0);
        material.map.needsUpdate = true;
      });
      imageTrans.src = earthcloudmaptrans;
    },
    false
  );

  imageMap.src = earthcloudmap;

  var geometry = new SphereGeometry(50.5, 32, 32);

  var material = new MeshPhongMaterial({
    map: new Texture(canvasResult),
    side: DoubleSide,
    transparent: true,
    opacity: 0.8
  });

  var mesh = new Mesh(geometry, material);
  return mesh;
}

export function createSkyBox(manager) {
  var texture = new TextureLoader(manager).load(galaxy_starfield);
  var material = new MeshBasicMaterial({ map: texture, side: BackSide });
  var geometry = new SphereGeometry(1000, 32, 32);
  var mesh = new Mesh(geometry, material);
  return mesh;
}
