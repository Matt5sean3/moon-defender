"use strict";
// Clicking through is a fundamental splash screen option
// Some splash screens are timed though

// START SPLASH SCREEN
function SplashScreen(ctx, nextScreen, media) {
    Screen.call(this, ctx);
    this.next = (nextScreen === undefined)? null: nextScreen;
    this.media = (media === undefined)? []: media;
    if(ctx !== undefined)
        this.addHandler(ctx.canvas, "mousedown", this.close.bind(this));
}

SplashScreen.prototype = new Screen();

SplashScreen.prototype.open = function() {
    Screen.prototype.open.call(this);
    // Reset the start of the accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].currentTime = 0;
}

SplashScreen.prototype.unpause = function() {
    Screen.prototype.unpause.call(this);
    // start or resume playing the accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].play();
}

SplashScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    this.ctx.save();
    this.render(this.ctx, this.elapsedTime, this.dt);
    this.ctx.restore();
}

SplashScreen.prototype.pause = function() {
    Screen.prototype.pause.call(this);
    // pause accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].pause();
}

SplashScreen.prototype.close = function() {
    Screen.prototype.close.call(this);
    this.next.open();
}

SplashScreen.prototype.render = function(ctx, currentTime, dt) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("SPLASH PLACEHOLDER", 40, 40);
}
// === END SPLASH SCREEN

function TimedSplashScreen(ctx, duration, nextScreen, media) {
    SplashScreen.call(this, ctx, nextScreen, media);
    this.duration = duration;
}

TimedSplashScreen.prototype = new SplashScreen();

TimedSplashScreen.prototype.draw = function(currentTime) {
    SplashScreen.prototype.draw.call(this, currentTime);
    if(this.elapsedTime > this.duration)
        this.close();
}

