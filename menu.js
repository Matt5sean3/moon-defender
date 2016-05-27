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
    this.options.push(new MenuOption(loc, renderFunction, bbox, event));
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

function MenuOption(loc, bbox, event) {
    this.loc = loc;
    this.bbox = bbox;
    this.event = event;
}

MenuOption.prototype = new Object();

MenuOption.prototype.draw = function(ctx, currentTime, dt) {
    ctx.save();
    ctx.translate(this.loc.x, this.loc.y);
    this.render(ctx, currentTime, dt);
    ctx.restore();
}

MenuOption.prototype.check = function(loc) {
    var diffloc = loc.clone().subtract(this.loc);
    if(this.bbox.check(diffloc))
        this.event();
}

MenuOption.prototype.render = function(ctx, currentTime, dt) {
    // placeholder
    ctx.font = "20px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.fillText("PLAY", 0, 20);
}

