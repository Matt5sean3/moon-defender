"use strict";

function getMousePosition(e, canvas) {
    var ret;
    if ("offsetX" in e && "offsetY" in e)
        ret = Vector2.create(e.offsetX, e.offsetY);
    else if (
            "pageX" in e && 
            "pageY" in e && 
            "offsetLeft" in canvas && 
            "offsetTop" in canvas)
        ret = Vector2.create(
            e.pageX - canvas.offsetLeft, 
            e.pageY - canvas.offsetTop);
    // adjust position due to crosshair issues
    return ret.add(Vector2.create(10, 10));
}

function makeVRDisplay() {
    return {
        /* Using ES5 properties */
        get isConnected() {
            return true;
        },
        get isPresenting() {
            /* TODO how does this work? */
            return false;
        },
        get capabilities() {
            return {
                "hasPosition": true,
                "hasOrientation": true,
                "hasExternalDisplay": true,
                "canPresent": true,
                "maxLayers": 1
            };
        },
        get stageParameters() {
            return {
                get sittingToStandingTransform() { 
                    return [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]
                },
                get sizeX() {
                    return 5.0;
                },
                get sizeY() {
                    return 5.0;
                }
            };
        },
        "getEyeParameters": function(which) {
            /* TODO fill in reasonable offset shim values */
            if(which == "left") {
                return {
                    "offset": [],
                    "renderWidth": 800,
                    "renderHeight": 600
                };
            } else if(which == "right") {
                return {
                    "offset": [],
                    "renderWidth": 800,
                    "renderHeight": 600
                };
            } else {
                return null;
            }
        },
        "requestPresent": function() {
            var promise = new Promise(function(resolve, reject) {
                window.requestAnimationFrame(resolve);
            });
            return promise;
        },
        get displayId() {
            return -1;
        },
        get displayName() {
            return "Canvas VR Emulator";
        },
        "getFrameData": function(frameData) {
            frameData.leftProjectionMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
                ];
            frameData.leftViewMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
                ];
            frameData.rightProjectionMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
                ];
            frameData.rightViewMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
                ];
        },
        "submitFrame": function() {
            /* Does nothing in the emulator */
        },
        "requestAnimationFrame": window.requestAnimationFrame.bind(window),
        "cancelAnimationFrame": window.cancelAnimationFrame.bind(window)
    };
}

function makeFrameData() {
    return {
        "leftProjectionMatrix": null,
        "leftViewMatrix": null,
        "rightProjectionMatrix": null,
        "rightViewMatrix": null,
        "pose": null
    };
}
