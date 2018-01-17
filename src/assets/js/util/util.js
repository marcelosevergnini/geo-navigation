var UTIL = UTIL || {}

UTIL.Functions	= {}

UTIL.Functions.convertLatLonToVec3	= function(lat,lon){
    lat =  lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;
    return new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
}

UTIL.Functions.createMarker = function(){
    var pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0,10), new THREE.MeshPhongMaterial({color: 0xff5c01}));
    pointer.position.set(55, 0, 0);
    pointer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    var marker = new THREE.Object3D();
    marker.add(pointer);
    return marker;
}

UTIL.Functions.setGuiObjectRotation = function(object){
    var gui = new dat.GUI();     
    gui.add( {z: 1}, 'z', -200, 200 ).step(5).onChange( function( value ){ object.fov = value;});
    gui.add( {x: 1}, 'x', -200, 200 ).step(6).onChange( function( value ){object.rotation.x = value;});
    gui.add( {y: 1}, 'y', -200, 200 ).step(7).onChange( function( value ){object.rotation.y = value;});
}
