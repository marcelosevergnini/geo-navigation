var TWEENS = TWEENS || {}

TWEENS.runners	= {}
TWEENS.runners.runnersContainer = [];
TWEENS.runners.processId = 0;

TWEENS.runners.createTweensByGeoPosition = function(dataList, cameraContainer, onStartExec, onCompleteExec){

    TWEENS.runners.originalPosition = new TWEEN.Tween(cameraContainer.camera.position).to(cameraContainer.cameraOriginalPosition, 3000).easing(TWEEN.Easing.Quadratic.In)
    .onStart(function(){

    })
    .onComplete(function(){
        TWEENS.runners.processId += 1;
        if(TWEENS.runners.processId > dataList.length){
            TWEENS.runners.processId = 1;
        }
        TWEENS.runners.runnersContainer[TWEENS.runners.processId].delay(1000).start();
    });

    dataList.forEach(function(element) {
        var currentPosition = UTIL.Functions.convertLatLonToVec3(element.latitude,element.longitude).multiplyScalar(52.5);
        //var current = { x: cameraContainer.camera.position.x, y: cameraContainer.camera.position.y, z: cameraContainer.camera.position.z  };
        //var target = { x: (currentPosition.x), y: (currentPosition.y), z: 0};
        var currentTween = new TWEEN.Tween(cameraContainer.camera.position).to(currentPosition, 2000).easing(TWEEN.Easing.Quadratic.In)
        .onStart(function(){

        })
        .onComplete(function(){
            
        });
        
        currentTween.chain(TWEENS.runners.originalPosition.delay(3000));
        TWEENS.runners.runnersContainer.push(currentTween);
    });  
}

TWEENS.runners.createTweensObjectByGeoPosition = function(dataList, objectToMove, onStartExec, onCompleteExec){

    dataList.forEach(function(element) {

        var targetPosition = UTIL.Functions.convertLatLonToVec3(element.latitude,element.longitude).multiplyScalar(52.5);
        
        var currentTween = new TWEEN.Tween(objectToMove.position).to(targetPosition, 3000).easing(TWEEN.Easing.Quartic.Out)

        .onStart(function(){
            onCompleteExec != undefined ? onStartExec() : "";
        })
        .onComplete(function(){
            onCompleteExec != undefined ? onCompleteExec() : "";

            TWEENS.runners.processId = TWEENS.runners.processId + 1;
            if(TWEENS.runners.processId > dataList.length){
                TWEENS.runners.processId = 1;
            }
            TWEENS.runners.runnersContainer[TWEENS.runners.processId].delay(3000).start();
            
        });

        TWEENS.runners.runnersContainer.push(currentTween);
    });         
}  
