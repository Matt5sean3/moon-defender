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

function Screen() {
    this.frameRequest = null;
    this.lastTime = 0;
    this.elapsedTime = 0;
    this.dt = 0;
    this.handlers = [];
    /* For now, this stubs out functionality */
    this.vr = false;
}

Screen.prototype = new Object();

Screen.prototype.addHandler = function(object, event_name, handler) {
    this.handlers.push(new Handler(object, event_name, handler));
}

Screen.prototype.draw = function(ctx, currentTime) {
    // clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

Screen.prototype.step = function(currentTime) {
    /* Allow for multiple drawing */
    if(this.lastTime == 0)
        this.dt = 0;
    else
        this.dt = (currentTime - this.lastTime) / 1000;
    this.elapsedTime += this.dt;
    this.lastTime = currentTime;
    /* Return the next screen to switch to */
    return null;
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
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].disable();
}

Screen.prototype.unpause = function() {
    this.lastTime = 0;
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].enable();
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
