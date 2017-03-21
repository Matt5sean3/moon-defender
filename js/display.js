
function Display(ctx) {
    this.width = 800;
    this.height = 600;
    this.ctx = ctx;
    this.screen = null;
    this.vr = false;
    this.vrDisplay = null;
    this.collectDisplay();
}

Display.prototype = new Object();

Display.prototype.getWidth = function() {
    return this.width;
}

Display.prototype.getHeight = function() {
    return this.height;
}

Display.prototype.processDisplays = function(displays) {
    if(displays.length > 0) {
        /* Found a VR display */
        this.vrDisplay = displays[0];
    } else {
        /* Found no VR displays */
        this.vrDisplay = makeVRDisplay();
    }
}

Display.prototype.collectDisplay = function() {
    /* Retrieves the display */
    if("getVRDisplays" in navigator) {
        navigator.getVRDisplays().then(this.processDisplays.bind(this));
    } else {
        /* Use the shim */
        this.vrDisplay = makeVRDisplay();
    }
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

    if(this.vr) {
        this.frame = this.vrDisplay.requestAnimationFrame(this.step.bind(this));

        var width = this.ctx.canvas.width;
        var height = this.ctx.canvas.height;

        this.vrDisplay.getFrameData(this.frameData);

        this.ctx.save();

        var screenTransform;
        /* Clip into the space to draw */
        /* Apply the total 3D transform */

        /* Draws into a 2 x 2 square centered at 0, 0, 20 */
        screenTransform =
            Mat.create(4, 4, Float64Array.from([
                this.vrLayer.leftBounds[2] * width / 2.0, 0.0, 0.0, 0.0,
                0.0, this.vrLayer.leftBounds[3] * height / 2.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                this.vrLayer.leftBounds[0] * width + this.vrLayer.leftBounds[2] * width / 2.0,
                this.vrLayer.leftBounds[1] * height + this.vrLayer.leftBounds[3] * height / 2.0,
                0.0, 1.0])).multiply(/* GL to 2D conversion */
            Mat.create(4, 4, this.frameData.leftProjectionMatrix)).multiply( /* Projection matrix */
            Mat.create(4, 4, this.frameData.leftViewMatrix)).multiply( /* Eye Position matrix */
            Mat.create(4, 4, Float64Array.from([ /* 2D to GL conversion */
                2.0 / this.getWidth(), 0.0, 0.0, 0.0,
                0.0, 2.0 / this.getHeight(), 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                -1.0, -1.0, 20.0, 1.0])));

        this.ctx.transform(
            screenTransform.get(0, 0), screenTransform.get(1, 0),
            screenTransform.get(0, 1), screenTransform.get(1, 1),
            screenTransform.get(0, 3), screenTransform.get(1, 3)
            );

        this.ctx.beginPath();
        this.ctx.rect(0, 0, 800, 600);
        this.ctx.clip();
        this.screen.draw(this.ctx, currentTime);
        this.ctx.restore();

        this.ctx.save();

        screenTransform =
            Mat.create(4, 4, Float64Array.from([
                this.vrLayer.rightBounds[2] * width / 2.0, 0.0, 0.0, 0.0,
                0.0, this.vrLayer.rightBounds[3] * height / 2.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                this.vrLayer.rightBounds[0] * width + this.vrLayer.rightBounds[2] * width / 2.0,
                this.vrLayer.rightBounds[1] * height + this.vrLayer.rightBounds[3] * height / 2.0, 
                0.0, 1.0])).multiply(/* GL to 2D conversion */
            Mat.create(4, 4, this.frameData.leftProjectionMatrix)).multiply( /* Projection matrix */
            Mat.create(4, 4, this.frameData.leftViewMatrix)).multiply(/* Eye Position matrix */
            Mat.create(4, 4, Float64Array.from([ /* 2D to GL conversion, 2x2 square 20 meters away */
                2.0 / this.getWidth(), 0.0, 0.0, 0.0,
                0.0, 2.0 / this.getHeight(), 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                -1.0, -1.0, 20.0, 1.0])));

        this.ctx.transform(
            screenTransform.get(0, 0), screenTransform.get(1, 0),
            screenTransform.get(0, 1), screenTransform.get(1, 1),
            screenTransform.get(0, 3), screenTransform.get(1, 3)
            );

        this.ctx.beginPath();
        this.ctx.rect(0, 0, 800, 600);
        this.ctx.clip();
        this.screen.draw(this.ctx, currentTime);
        this.ctx.restore();

        this.vrDisplay.submitFrame();
    } else {
        this.frame = window.requestAnimationFrame(this.step.bind(this));
        this.screen.draw(this.ctx, currentTime);
    }

    if(next)
        this.setScreen(next);
}

Display.prototype.enableVR = function() {

    if(this.vrDisplay == null) {
        return;
    }
    this.vr = true;

    window.cancelAnimationFrame(this.frame);

    var left = this.vrDisplay.getEyeParameters("left");
    var right = this.vrDisplay.getEyeParameters("right");
    this.ctx.canvas.width = left.renderWidth + right.renderWidth;
    this.ctx.canvas.height = Math.max(left.renderHeight, right.renderHeight);

    this.vrLayer = {
        "source": this.ctx.canvas,
        "leftBounds": [
            0.0, 0.0,
            left.renderWidth / this.ctx.canvas.width,
            left.renderHeight / this.ctx.canvas.height],
        "rightBounds": [
            left.renderWidth / this.ctx.canvas.width,
            0.0,
            right.renderWidth / this.ctx.canvas.width,
            right.renderHeight / this.ctx.canvas.height]
    };

    this.vrDisplay.requestPresent([this.vrLayer]).then();
    if(typeof VRFrameData !== "undefined")
        this.frameData = new VRFrameData();
    else
        this.frameData = makeFrameData();

    this.vrDisplay.requestAnimationFrame(this.step.bind(this));
}

Display.prototype.disableVR = function() {
    this.vr = false;

    /* Cancel on the VR request rate */
    this.vrDisplay.cancelAnimationFrame(this.frame);

    this.frameData = null;
    this.vrLayer = null;

    this.ctx.canvas.width = 800;
    this.ctx.canvas.height = 600;

    /* Restart on the window request rate */
    this.frame = window.requestAnimationFrame(this.step.bind(this));
}

