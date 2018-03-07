import { Vector3, MeshPhongMaterial, CylinderGeometry, Object3D, Geometry, ObjectLoader, BufferGeometry, SphereGeometry, Mesh } from "three";

export function convertLatLonToVec3(lat, lon, radiusToTarget, radiusSpaceView) {
  let phi = (90 - lat) * (Math.PI / 180);
  let theta = (lon + 180) * (Math.PI / 180);

  let objectTarget = {};

  objectTarget.targetView = new Vector3(
    -(radiusToTarget * Math.sin(phi) * Math.cos(theta)),
    radiusToTarget * Math.cos(phi),
    radiusToTarget * Math.sin(phi) * Math.sin(theta)
  ).multiplyScalar(52.5);

  objectTarget.spaceViewTarget = new Vector3(
    -(radiusSpaceView * Math.sin(phi) * Math.cos(theta)),
    radiusSpaceView * Math.cos(phi),
    radiusSpaceView * Math.sin(phi) * Math.sin(theta)
  ).multiplyScalar(52.5);

  return objectTarget;
}

export function createMarker() {
  let pointer = new Mesh(
    new CylinderGeometry(0.1, 0, 5),
    new MeshPhongMaterial({ color: 0xff5c01 })
  );
  pointer.position.set(50, 0, 0);
  pointer.quaternion.setFromUnitVectors(
    new Vector3(0, 1, 0),
    new Vector3(1, 0, 0)
  );

  let marker = new Object3D();
  marker.add(pointer);

  return marker;
}

export function createPin(manager, scaleX, scaleY, scaleZ, pin) {
  let marker = new Object3D();

  let loader = new ObjectLoader(manager);
  loader.load(pin, function(object) {
    object.traverse(function(child) {
      if (child instanceof Mesh) {
        child.material = new MeshPhongMaterial({
          color: 0xff5c01,
          specular: 0x050505,
          shininess: 100
        });
        let geometry = new Geometry().fromBufferGeometry(child.geometry);
        geometry.computeFaceNormals();
        geometry.mergeVertices();
        geometry.computeVertexNormals();
        child.geometry = new BufferGeometry().fromGeometry(geometry);
        object.scale.set(scaleX, scaleY, scaleZ);
        object.position.set(50.2, 0, 0);
        object.quaternion.setFromUnitVectors(
          new Vector3(0, 1, 0),
          new Vector3(1, 0, 0)
        );
      }
    });
    object.rotateX(70 * Math.PI / 180);
    object.rotateY(125 * Math.PI / 180);
    object.rotateZ(0 * Math.PI / 180);
    marker.add(object);
  });
  return marker;
}

export function createSimpleSphere( rad, widthSegments, heightSegments, posX, posY, posZ) {
  let geometry = new SphereGeometry(rad, widthSegments, heightSegments);
  let material = new MeshPhongMaterial({ bumpScale: 0.05 });
  let object = new Object3D();
  object = new Mesh(geometry, material);
  object.position.set(posX, posY, posZ);

  return object;
}

export function Detector() {
    //from  -->> https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
    var Detector = { canvas: !!window.CanvasRenderingContext2D, webgl: (function() {
      try {
        var canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      } catch (e) {
        return false;
      }
    })(), workers: !!window.Worker, fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    getWebGLErrorMessage: function() {
      var element = document.createElement("div");
      element.id = "webgl-error-message";
      element.style.fontFamily = "monospace";
      element.style.fontSize = "13px";
      element.style.fontWeight = "normal";
      element.style.textAlign = "center";
      element.style.background = "#fff";
      element.style.color = "#000";
      element.style.padding = "1.5em";
      element.style.width = "400px";
      element.style.margin = "5em auto 0";

      if (!this.webgl) {
        element.innerHTML = window.WebGLRenderingContext ? ['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n") : ['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n");
      }

      return element;
    },
    addGetWebGLMessage: function(parameters) {
      var parent, id, element;

      parameters = parameters || {};

      parent = parameters.parent !== undefined ? parameters.parent : document.body;
      id = parameters.id !== undefined ? parameters.id : "oldie";

      element = Detector.getWebGLErrorMessage();
      element.id = id;

      parent.appendChild(element);
    } };
};