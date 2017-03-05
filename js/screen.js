"use strict";

/**
 * The life cycle of a screen
 * 
 * Screen(ctx)
 * open()
 * -> performs initialization for the screen
 * -> Sets time progression to zero
 * -> calls unpause internally
 * 
 * pause()
 * -> freezes time progression and rendering of the screen
 * 
 * unpause()
 * -> Resumes time progression at the time when it paused
 * 
 * ... pause and unpause as many times as desired, whenever desired ...
 * 
 * close()
 * -> pauses the screen internally
 * -> performs cleanup and final actions for the screen
 **/

function Screen(ctx) {
    this.ctx = (ctx === undefined)? 0 : ctx;
    this.frameRequest = null;
    this.lastTime = 0;
    this.elapsedTime = 0;
    this.dt = 0;
    this.handlers = [];
    /* For now, this stubs out functionality */
    this.vr = false;
    this.vrDisplay = {
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
        "cancelAnimationFrame": window.cancelAnimationFrame.bind(window),
    };
}

Screen.prototype = new Object();

Screen.prototype.addHandler = function(object, event_name, handler) {
    this.handlers.push(new Handler(object, event_name, handler));
}

Screen.prototype.draw = function(currentTime) {
    // clear the canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

Screen.prototype.step = function(currentTime) {
    if(this.vr)
        this.frameRequest = this.vrDisplay.requestAnimationFrame(this.step.bind(this));
    else
        this.frameRequest = window.requestAnimationFrame(this.step.bind(this));
    /* Allow for multiple drawing */
    if(this.lastTime == 0)
        this.dt = 0;
    else
        this.dt = (currentTime - this.lastTime) / 1000;
    this.elapsedTime += this.dt;
    this.lastTime = currentTime;

    if(this.vr) {
      var width = this.ctx.canvas.width;
      var height = this.ctx.canvas.height;

      /* Retrieve the frame data */
      this.vrDisplay.getFrameData(this.frame);
      /* Set the left eye transform */
      this.ctx.save();
      /* Render within the defined bounds */
      this.ctx.transform(
          this.vrLayer.leftBounds[2] * width / 800, 0,
          0, this.vrLayer.leftBounds[3] * height / 600,
          this.vrLayer.leftBounds[0] * width,
          this.vrLayer.leftBounds[1] * height);
      /* Clip rendering to within those bounds */
      this.ctx.beginPath();
      this.ctx.rect(0, 0, 800, 600);
      this.ctx.clip();
      /* Apply the perspective transform */
      /* */
      this.draw(currentTime);
      this.ctx.restore();

      /* Set the right eye transform */
      this.ctx.save();
      this.ctx.transform(
          this.vrLayer.rightBounds[2] * width / 800, 0,
          0, this.vrLayer.rightBounds[3] * height / 600,
          this.vrLayer.rightBounds[0] * width,
          this.vrLayer.rightBounds[1] * height);
      this.draw(currentTime);
      this.ctx.restore();

      /* Submit the frame to the VR device */
      this.vrDisplay.submitFrame();
    } else 
      this.draw(currentTime);
}

Screen.prototype.open = function() {
    this.elapsedTime = 0;
    this.unpause();
}

Screen.prototype.close = function() {
    this.pause();
    // unpausing after closing should be undefined but will work
    // sometimes
}

Screen.prototype.pause = function() {
    // cancelAnimationFrame is experimental
    // TODO: add a workaround for non-compatible browsers
    if(this.vr)
        this.vrDisplay.cancelAnimationFrame(this.frameRequest);
    else
        window.cancelAnimationFrame(this.frameRequest);
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].disable();
}

Screen.prototype.unpause = function() {
    this.lastTime = 0;
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].enable();

    if(this.vr)
        this.initVR(this.step.bind(this));
    else
        this.frameRequest = window.requestAnimationFrame(this.step.bind(this));
}

Screen.prototype.initVR = function(complete) {
  this.vr = true;
  var left = this.vrDisplay.getEyeParameters("left");
  var right = this.vrDisplay.getEyeParameters("right");

  if(!this.vrDisplay.isPresenting) {
    /* Resize the canvas */
    this.ctx.canvas.width = 
        left.renderWidth + right.renderWidth;
    this.ctx.canvas.height = 
      Math.max(left.renderHeight, right.renderHeight);
    this.vrLayer = {
        "source": this.ctx.canvas,
        "leftBounds": [
            0.0, 
            0.0, 
            left.renderWidth / this.ctx.canvas.width, 
            left.renderHeight / this.ctx.canvas.height],
        "rightBounds": [
            left.renderWidth / this.ctx.canvas.width, 
            0.0,
            right.renderWidth / this.ctx.canvas.width, 
            right.renderHeight / this.ctx.canvas.height]
    };
    this.vrDisplay.requestPresent([this.vrLayer]).then(complete);
  }
  if(typeof VRFrameData !== "undefined")
      this.frame = new VRFrameData();
  else
      this.frame = {
          "leftProjectionMatrix": null,
          "leftViewMatrix": null,
          "rightProjectionMatrix": null,
          "rightViewMatrix": null,
          "pose": null
      };
}

Screen.prototype.disableVR = function() {
  this.vr = false;
  this.vrDisplay = null;
  this.vrLayer = null;
  this.frame = null;
  this.ctx.canvas.width = 800;
  this.ctx.canvas.height = 600;
}

Screen.prototype.enableVR = function(display) {
  this.vr = true;
  this.vrDisplay = display;
}

function Handler(object, name, event) {
    this.object = object;
    this.name = name;
    this.event = event;
}

Handler.prototype.enable = function() {
    this.object.addEventListener(this.name, this.event, false);
}

Handler.prototype.disable = function() {
    this.object.removeEventListener(this.name, this.event);
}
