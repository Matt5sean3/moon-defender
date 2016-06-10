"use strict";

// === START MENU SCREEN
function MenuScreen(ctx) {
    Screen.call(this, ctx);
    this.options = [];
    this.clickHandler = this.handleClick.bind(this);
    this.addCanvasHandler("mousedown", this.handleClick.bind(this));
}

MenuScreen.prototype = new Screen();

MenuScreen.prototype.handleClick = function(e) {
    var mouseLocation = getMousePosition(e, this.ctx.canvas);
    for(var i = 0; i < this.options.length; i++)
        this.options[i].check(mouseLocation);
}

MenuScreen.prototype.addOption = function(loc, renderFunction, bbox, event) {
    if(loc instanceof Button) {
        this.options.push(loc);
        return loc;
    } else {
        var button = new Button(loc, renderFunction, bbox, event)
        this.options.push(button);
        return button;
    }
}

MenuScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    this.ctx.save();
    this.render(this.ctx);
    this.ctx.restore();
    
    for(var i = 0; i < this.options.length; i++) {
        this.ctx.save();
        this.options[i].draw(this.ctx, this.lastTime, this.dt);
        this.ctx.restore();
    }
}

MenuScreen.prototype.render = function(ctx, currentTime, dt) {
    // placeholder
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("MENU PLACEHOLDER", 40, 40);
}

function Button(loc, bbox, event) {
    this.loc = loc;
    this.bbox = bbox;
    this.event = event;
}

Button.prototype = new Object();

Button.prototype.draw = function(ctx, currentTime, dt) {
    ctx.save();
    ctx.translate(this.loc.x(), this.loc.y());
    this.render(ctx, currentTime, dt);
    ctx.restore();
}

Button.prototype.check = function(loc) {
    if(this.bbox.check(loc.subtract(this.loc)))
        this.event();
}

Button.prototype.render = function(ctx, currentTime, dt) {
    // placeholder
    ctx.fillStyle = "#00FF00";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = this.bbox.height + "px Arial";
    ctx.fillText("PLAY", 0, 0);
}

function TextButton(loc, text, font, style, event) {
    // Calculate the bounding box
    Button.call(this, loc, new BoundingBox(0, 0), event);
    this.v_offset = 0;
    this.font = font;
    this.style = style;
    this.text = text;
}

TextButton.prototype = new Button();

TextButton.prototype.measure = function(ctx) {
    // measure the text
    var metrics = ctx.measureText(this.text);
    var width = metrics.width;
    var height;
    // Only works with fonts with size specified in pixels
    height = ctx.font.split("px")[0];
    // console.log("font: " + width + ", " + height);
    this.bbox = new BoundingBox(width, height);
}

TextButton.prototype.render = function(ctx, currentTime, dt) {
    ctx.font = this.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = this.style;
    this.measure(ctx);
    ctx.fillText(this.text, 0, 0);
}

