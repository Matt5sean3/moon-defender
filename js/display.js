
function Display(ctx) {
    this.screen = null;
    /* Only the GL version can support WebVR */
    this.vrDisplay = null;
    if(ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
    }
}

Display.prototype = new Object();

Display.prototype.getWidth = function() {
    return this.width;
}

Display.prototype.getHeight = function() {
    return this.height;
}

Display.prototype.setScreen = function(screen) {
    if(this.screen)
        this.screen.close();
    this.screen = screen;
    this.screen.open();
}

Display.prototype.step = function(currentTime) {
    if(!this.screen)
        return;

    var next = this.screen.step(currentTime);

    this.frame = window.requestAnimationFrame(this.step.bind(this));
    this.screen.draw(this.ctx, currentTime);

    if(next)
        this.setScreen(next);
}

/* Can't enable VR except on a GL canvas */
Display.prototype.enableVR = function() {
    return false;
}

Display.prototype.disableVR = function() {
    return false;
}

