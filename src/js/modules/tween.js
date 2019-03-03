import TWEEN from "@tweenjs/tween.js";
import { convertLatLonToVec3 } from "./loader";

let runner	= {
    runnersContainer : [],
    processId : 0,
    transitionSpaceSpeed : 4000,
    transitionToTargetSpeed : 1000
}

export function tweenContainer(){
    return runner;
}

export function createRunners(dataList, cameraContainer, controls) {
	
	let radiusToTarget = 1.3, radiusSpaceView = 3.5;

    dataList.forEach(function(element) {
  
        let targetPosition = convertLatLonToVec3(element.latitude,element.longitude, radiusToTarget, radiusSpaceView);

        let goToSpaceView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.spaceViewTarget, runner.transitionSpaceSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onStart(function(){enableControl(controls)})
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix()
        })
        .onComplete(function(){disableControl(controls)});


        let gotToTargetView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.targetView, runner.transitionToTargetSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix();
        })
        .onStart(function(){
            enableControl(controls);
            if(element.img === undefined){
                document.getElementById('target-img').src = "https://bulma.io/images/placeholders/96x96.png";
            }else{
                document.getElementById('target-img').src = element.img;
            }
        })
        .onComplete(function(){
            disableControl(controls);
            document.getElementById('target-title').innerHTML = element.city;
            document.getElementById('target-description').innerHTML = element.description;
            document.getElementById('target-qt').innerHTML = element.qt;
            document.getElementById('target-extra').innerHTML = element.extra;

            let parent = document.getElementById("app");
            parent.querySelectorAll('.data-container')[0].classList.remove("fade-out");
            parent.querySelectorAll('.data-container')[0].classList.add("fade-in");
            
        });

        let backToSpaceView = new TWEEN.Tween(cameraContainer.camera.position).to(targetPosition.spaceViewTarget, runner.transitionToTargetSpeed ).easing(TWEEN.Easing.Quadratic.Out)
        .onStart(function(){
            enableControl(controls);
            let parent = document.getElementById("app");
            parent.querySelectorAll('.data-container')[0].classList.remove("fade-in");
            parent.querySelectorAll('.data-container')[0].classList.add("fade-out");
            
        })
        .onUpdate(function(){
            cameraContainer.camera.updateProjectionMatrix();
        })
        .onComplete(function(){
            disableControl(controls);
            runner.processId += 1;
            
            if(runner.processId >= dataList.length){
                runner.processId = 0;
            }
            runner.runnersContainer[runner.processId].start();
        });
        
        goToSpaceView.chain(gotToTargetView.chain(backToSpaceView.delay(10000)));

        runner.runnersContainer.push(goToSpaceView);
        
    }); 

    function enableControl(controls){
        controls.enabled = true;
    }
    function disableControl(controls){
        controls.enabled = false;
    }

}