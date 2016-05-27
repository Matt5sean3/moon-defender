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
}

Screen.prototype = new Object();

Screen.prototype.addCanvasHandler = function(event_name, handler) {
    this.handlers.push(new CanvasHandler(event_name, handler));
}

Screen.prototype.draw = function(currentTime) {
    if(this.lastTime == 0)
        this.dt = 0;
    else
        this.dt = (currentTime - this.lastTime) / 1000;
    this.elapsedTime += this.dt;
    this.lastTime = currentTime;
    this.frameRequest = window.requestAnimationFrame(this.draw.bind(this));
    // clear the canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
    window.cancelAnimationFrame(this.frameRequest);
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].disable(this.ctx.canvas);
}

Screen.prototype.unpause = function() {
    this.lastTime = 0;
    this.frameRequest = window.requestAnimationFrame(this.draw.bind(this));
    for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].enable(this.ctx.canvas);
}

function CanvasHandler(name, event) {
    this.name = name;
    this.event = event;
}

CanvasHandler.prototype.enable = function(canvas) {
    canvas.addEventListener(this.name, this.event, false);
}

CanvasHandler.prototype.disable = function(canvas) {
    canvas.removeEventListener(this.name, this.event);
}
