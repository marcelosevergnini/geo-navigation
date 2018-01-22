var UTIL = UTIL || {}

UTIL.Functions	= {}

UTIL.Functions.convertLatLonToVec3	= function(lat,lon){
    //lat =  lat * Math.PI / 180.0;
    //lon = -lon * Math.PI / 180.0;
    //return new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
    var radius = 1.2;
    var phi   = (90-lat)*(Math.PI/180);
    var theta = (lon+180)*(Math.PI/180);

    x = -((radius) * Math.sin(phi)*Math.cos(theta));
    y = ((radius) * Math.cos(phi));
    z = ((radius) * Math.sin(phi)*Math.sin(theta));

    return new THREE.Vector3(x, y, z);
}

UTIL.Functions.createMarker = function(){
    var pointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0,10), new THREE.MeshPhongMaterial({color: 0xff5c01}));
    pointer.position.set(55, 0, 0);
    pointer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    var marker = new THREE.Object3D();
    marker.add(pointer);
    return marker;
}

UTIL.Functions.createPin = function(){
    var marker = new THREE.Object3D();
        var loader = new THREE.OBJLoader();
        loader.load( 'src/assets/models/Pin.obj', function ( object ) {
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
                    object.scale.set(0.005,0.005,0.005);
                    object.position.set(51, 0, 0);
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

UTIL.Functions.setGuiObjectRotation = function(object){
    var gui = new dat.GUI();     
    gui.add( {z: 1}, 'z', -200, 200 ).step(5).onChange( function( value ){ object.fov = value;});
    gui.add( {x: 1}, 'x', -200, 200 ).step(6).onChange( function( value ){object.rotation.x = value;});
    gui.add( {y: 1}, 'y', -200, 200 ).step(7).onChange( function( value ){object.rotation.y = value;});
}

UTIL.Functions.createSimpleSphere = function(rad, widthSegments, heightSegments, posX, posY, posZ){
        
    var geometry	= new THREE.SphereGeometry(rad, widthSegments, heightSegments)
    var material	= new THREE.MeshPhongMaterial({
        bumpScale	: 0.05,
    })
    var object = new THREE.Object3D();
    object= new THREE.Mesh(geometry, material)
    object.position.set(posX, posY, posZ);

    return object;
}