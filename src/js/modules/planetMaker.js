import { TextureLoader, SphereGeometry, MeshPhongMaterial, Mesh, Color, MeshBasicMaterial, Texture, DoubleSide, BackSide } from "three";

import worldBig from "../../assets/textures/world-big.jpg";
import earthcloudmaptrans from "../../assets/textures/earthcloudmaptrans.jpg";
import earthcloudmap from "../../assets/textures/earthcloudmap.jpg";
import galaxy_starfield from "../../assets/textures/galaxy_starfield.png";

export function createEarth(manager) {
  let mapLoader = new TextureLoader(manager).load(worldBig);
  let bumpMapLoader = new TextureLoader(manager).load(worldBig);
  let specularMapLoader = new TextureLoader(manager).load(worldBig);

  let geometry = new SphereGeometry(50, 32, 32);
  let material = new MeshPhongMaterial({
      map: mapLoader,
      bumpMap: bumpMapLoader,
      bumpScale: 0.05,
      shininess: 100,
      specularMap: specularMapLoader,
      specular: new Color("grey")
  });
  let mesh = new Mesh(geometry, material);
  return mesh;
}

export function createEarthCloud(manager) {
    // create destination canvas
    let canvasResult = document.createElement("canvas");
    canvasResult.width = 1024;
    canvasResult.height = 512;
    var contextResult = canvasResult.getContext("2d");

    // load earthcloudmap
    let imageMap = new Image();
    imageMap.addEventListener("load", function() {
        // create dataMap ImageData for earthcloudmap
        let canvasMap = document.createElement("canvas");
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        let contextMap = canvasMap.getContext("2d");
        contextMap.drawImage(imageMap, 0, 0);
        let dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        let imageTrans = new Image();
        imageTrans.addEventListener("load", function() {
          // create dataTrans ImageData for earthcloudmaptrans
          let canvasTrans = document.createElement("canvas");
          canvasTrans.width = imageTrans.width;
          canvasTrans.height = imageTrans.height;
          let contextTrans = canvasTrans.getContext("2d");
          contextTrans.drawImage(imageTrans, 0, 0);
          let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
          // merge dataMap + dataTrans into dataResult
          let dataResult = contextMap.createImageData( canvasMap.width, canvasMap.height );
          for (let y = 0, offset = 0; y < imageMap.height; y++) {
              for (let x = 0; x < imageMap.width; x++, offset += 4) {
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
      }, false
    );

    imageMap.src = earthcloudmap;

    let geometry = new SphereGeometry(50.5, 32, 32);

    let material = new MeshPhongMaterial({ map: new Texture(canvasResult), side: DoubleSide, transparent: true, opacity: 0.8 });

    let mesh = new Mesh(geometry, material);
    return mesh;
}

export function createSkyBox(manager) {
    let texture = new TextureLoader(manager).load(galaxy_starfield);
    let material = new MeshBasicMaterial({ map: texture, side: BackSide });
    let geometry = new SphereGeometry(1000, 32, 32);
    let mesh = new Mesh(geometry, material);
    return mesh;
}
