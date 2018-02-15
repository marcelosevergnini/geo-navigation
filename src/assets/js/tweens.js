var TWEENS = TWEENS || {}

TWEENS.runners	= {}
TWEENS.runners.runnersContainer = [];
TWEENS.runners.processId = 0;
TWEENS.runners.transitionSpaceSpeed = 4000;
TWEENS.runners.transitionToTargetSpeed = 1000;

TWEENS.runners.createTweensByGeoPosition = function(dataList, cameraContainer){

    var radiusToTarget = 1.3, radiusSpaceView = 3.5;

    dataList.forEach(function(element) {
        
        var targetPosition = UTIL.Functions.convertLatLonToVec3(element.latitude,element.longitude, radiusToTarget, radiusSpaceView);

        var goToSpaceView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.spaceViewTarget, TWEENS.runners.transitionSpaceSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix()
        });

        var gotToTargetView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.targetView, TWEENS.runners.transitionToTargetSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix();
        })
        .onStart(function(){
            if(element.img === undefined){
                document.getElementById('target-img').src = "https://bulma.io/images/placeholders/96x96.png";
            }else{
                document.getElementById('target-img').src = element.img;
            }
        })
        .onComplete(function(){

            document.getElementById('target-title').innerHTML = element.nameBranch;
            document.getElementById('target-description').innerHTML = element.description;
            document.getElementById('target-qt').innerHTML = element.qt;
            document.getElementById('target-extra').innerHTML = element.extra;

            var parent = document.getElementById("app");
            parent.querySelectorAll('.data-container')[0].classList.remove("fade-out");
            parent.querySelectorAll('.data-container')[0].classList.add("fade-in");
        });

        var backToSpaceView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.spaceViewTarget, TWEENS.runners.transitionToTargetSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix();
        })
        .onStart(function(){
            var parent = document.getElementById("app");
            parent.querySelectorAll('.data-container')[0].classList.remove("fade-in");
            parent.querySelectorAll('.data-container')[0].classList.add("fade-out");
        })
        .onComplete(function(){
            TWEENS.runners.processId += 1;
            
            if(TWEENS.runners.processId >= dataList.length){
                TWEENS.runners.processId = 0;
            }
            console.log("ProcessId-> " + TWEENS.runners.processId);
            TWEENS.runners.runnersContainer[TWEENS.runners.processId].start();
        });
        
        goToSpaceView.chain(gotToTargetView.chain(backToSpaceView.delay(4000)));

        TWEENS.runners.runnersContainer.push(goToSpaceView);
    });  
} 

TWEENS.runners.createTweensObjectByGeoPosition = function(dataList, objectToMove){

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
