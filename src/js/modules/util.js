import {
  Vector3,
  MeshPhongMaterial,
  CylinderGeometry,
  Object3D,
  Geometry,
  ObjectLoader,
  BufferGeometry,
  SphereGeometry,
  Mesh
} from "three";

export function convertLatLonToVec3(lat, lon, radiusToTarget, radiusSpaceView) {
  var phi = (90 - lat) * (Math.PI / 180);
  var theta = (lon + 180) * (Math.PI / 180);

  var objectTarget = {};

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
  var pointer = new Mesh(
    new CylinderGeometry(0.1, 0, 5),
    new MeshPhongMaterial({ color: 0xff5c01 })
  );
  pointer.position.set(50, 0, 0);
  pointer.quaternion.setFromUnitVectors(
    new Vector3(0, 1, 0),
    new Vector3(1, 0, 0)
  );

  var marker = new Object3D();
  marker.add(pointer);

  return marker;
}

export function createPin(manager, scaleX, scaleY, scaleZ, pin) {
  var marker = new Object3D();

  var loader = new ObjectLoader(manager);
  loader.load(pin, function(object) {
    object.traverse(function(child) {
      if (child instanceof Mesh) {
        child.material = new MeshPhongMaterial({
          color: 0xff5c01,
          specular: 0x050505,
          shininess: 100
        });
        var geometry = new Geometry().fromBufferGeometry(child.geometry);
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

export function createSimpleSphere(
  rad,
  widthSegments,
  heightSegments,
  posX,
  posY,
  posZ
) {
  var geometry = new SphereGeometry(rad, widthSegments, heightSegments);
  var material = new MeshPhongMaterial({
    bumpScale: 0.05
  });
  var object = new Object3D();
  object = new Mesh(geometry, material);
  object.position.set(posX, posY, posZ);

  return object;
}
