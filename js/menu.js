"use strict";

// === START MENU SCREEN
function MenuScreen(canvas) {
    Screen.call(this);
    this.canvas = canvas;
    this.options = [];
    this.sliders = [];
    this.mouseLocation = Vector2.create(0, 0);
    this.next = null;

    if(canvas !== undefined) {
        this.addHandler(canvas, "mousedown", this.handleClick.bind(this));
        this.addHandler(canvas, "mouseup", this.handleLift.bind(this));
        this.addHandler(canvas, "mousemove", this.handleMove.bind(this));
    }
}

MenuScreen.prototype = new Screen();

MenuScreen.prototype.open = function() {
    Screen.prototype.open.call(this);
    this.next = null;
}

MenuScreen.prototype.handleClick = function(e) {
    this.mouseLocation = getMousePosition(e, this.canvas);
    for(var i = 0; i < this.options.length; i++)
        this.options[i].check(this.mouseLocation);
    for(var i = 0; i < this.sliders.length; i++)
        this.sliders[i].down(this.mouseLocation);
}

MenuScreen.prototype.handleMove = function(e) {
    this.mouseLocation = getMousePosition(e, this.canvas);
    for(var i = 0; i < this.sliders.length; i++)
        this.sliders[i].move(this.mouseLocation);
}

MenuScreen.prototype.handleLift = function(e) {
    this.mouseLocation = getMousePosition(e, this.canvas);
    for(var i = 0; i < this.sliders.length; i++)
        this.sliders[i].lift(this.mouseLocation);
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

MenuScreen.prototype.addSlider = function(loc, get_function, set_function, width, height, slider_width) {
    var slider = new Slider(loc, width, height, slider_width);
    slider.getValue = get_function;
    slider.setValue = set_function;
    this.sliders.push(slider);
}

MenuScreen.prototype.step = function(currentTime) {
    Screen.prototype.step.call(this, currentTime);
    return this.next;
}

MenuScreen.prototype.draw = function(ctx, currentTime) {
    Screen.prototype.draw.call(this, ctx, currentTime);
    ctx.save();
    this.render(ctx);
    ctx.restore();
    
    for(var i = 0; i < this.options.length; i++) {
        ctx.save();
        this.options[i].draw(ctx, this.lastTime, this.dt);
        ctx.restore();
    }
    for(var i = 0; i < this.sliders.length; i++) {
        ctx.save();
        this.sliders[i].draw(ctx, this.lastTime, this.dt);
        ctx.restore();
    }
    /* Draw the mouse */
    ctx.save();
    ctx.strokeStyle = "#FF0000";
    ctx.strokeWidth = 2;
    ctx.beginPath();
    ctx.translate(this.mouseLocation.x, this.mouseLocation.y);
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.restore();
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
    ctx.translate(this.loc.x, this.loc.y);
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

function Slider(loc, width, height, slider_width) {
    this.loc = loc;
    this.width = width;
    this.height = height;
    this.slider_width = slider_width;
    this.slider_pos = 0;
    this.sliding = false;
}

Slider.prototype = new Object();

Slider.prototype.draw = function(ctx, time, dt) {
    ctx.save();
    ctx.translate(this.loc.x, this.loc.y);
    this.render(ctx, time, dt);
    ctx.restore();
}

Slider.prototype.render = function(ctx, time, dt) {
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(this.getValue() * (this.width - this.slider_width), 0, this.slider_width, this.height);
}

Slider.prototype.getValue = function() {
    return this.slider_value;
}

Slider.prototype.setValue = function(value) {
    this.slider_value = value;
}

Slider.prototype.down = function(pos) {
    //
    var relpos = pos.subtract(this.loc);
    if(relpos.x > 0 && 
        relpos.x <= this.width && 
        relpos.y > 0 && 
        relpos.y <= this.height) {
        this.sliding = true;
        this.setSliderPosition(relpos.x);
    }
}

Slider.prototype.lift = function(pos) {
    if(this.sliding)
        this.setSliderPosition(pos.subtract(this.loc).x);
    this.sliding = false;
}

Slider.prototype.move = function(pos) {
    if(this.sliding)
        this.setSliderPosition(pos.subtract(this.loc).x);
}

Slider.prototype.setSliderPosition = function(xpos) {
    var floatpos = (xpos - this.slider_width / 2) / (this.width - 
        this.slider_width);
    // clamp between 0 and 1
    this.setValue(Math.min(1.0, Math.max(0.0, floatpos)));
}

