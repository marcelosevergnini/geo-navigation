import { Vector3, MeshPhongMaterial, CylinderGeometry, Object3D, OBJLoader, Geometry, BufferGeometry, SphereGeometry } from 'three'

export function convertLatLonToVec3(lat, lon, radiusToTarget, radiusSpaceView){

 	var phi   = (90-lat) * (Math.PI/180);
    var theta = (lon+180) * (Math.PI/180);

    var objectTarget = {};
    
    objectTarget.targetView = new THREE.Vector3(
        (-((radiusToTarget) * Math.sin(phi)*Math.cos(theta))), (((radiusToTarget) * Math.cos(phi))), ((radiusToTarget) * Math.sin(phi)*Math.sin(theta))
    ).multiplyScalar(52.5)
    
    objectTarget.spaceViewTarget = new THREE.Vector3(
        (-((radiusSpaceView) * Math.sin(phi)*Math.cos(theta))), ((radiusSpaceView) * Math.cos(phi)), ((radiusSpaceView) * Math.sin(phi)*Math.sin(theta))
    ).multiplyScalar(52.5);
   
    return objectTarget;

}

export function createMarker = function(){

    var pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0,10), new THREE.MeshPhongMaterial({color: 0xff5c01}));
    pointer.position.set(55, 0, 0);
    pointer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    
    var marker = new THREE.Object3D();
    marker.add(pointer);

    return marker;

}

export function createPin = function(manager, scaleX, scaleY, scaleZ){

    var marker = new THREE.Object3D();
        var loader = new THREE.OBJLoader(manager);
        loader.load( '../../assets/models/Pin.obj', function ( object ) {
            object.traverse( function ( child ) {
                if (child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial( { 
                        color: 0xff5c01, 
                        specular: 0x050505,
                        shininess: 100
                    });
                    var geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
                    geometry.computeFaceNormals();
                    geometry.mergeVertices();
                    geometry.computeVertexNormals();
                    child.geometry = new THREE.BufferGeometry().fromGeometry( geometry );
                    object.scale.set(scaleX, scaleY, scaleZ);
                    object.position.set(50.2, 0, 0);
                    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
                }
            });
            object.rotateX((70 * Math.PI) / 180); 
            object.rotateY((125 * Math.PI) / 180);
            object.rotateZ((0 * Math.PI) / 180);
            marker.add(object);
        });
        return marker;  
}

export function createSimpleSphere = function(rad, widthSegments, heightSegments, posX, posY, posZ){
        
    var geometry	= new THREE.SphereGeometry(rad, widthSegments, heightSegments)
    var material	= new THREE.MeshPhongMaterial({
        bumpScale	: 0.05,
    })
    var object = new THREE.Object3D();
    object= new THREE.Mesh(geometry, material)
    object.position.set(posX, posY, posZ);

    return object;
}