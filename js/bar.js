"use strict"

function Bar(pos, size) {
    this.pos = pos;
    this.size = size;
    this.fillColor = null;
    this.backColor = null;
    this.borderColor = null;
    this.borderWidth = null;
}

Bar.prototype = new Object();

Bar.prototype.setBorder = function(color, width) {
    this.borderColor = color;
    this.borderWidth = width;
}

Bar.prototype.setFill = function(color) {
    this.fillColor = color;
}

Bar.prototype.setBackground = function(color) {
    this.backColor = color;
}

Bar.prototype.getMax = function() {
    return 1.0;
}

Bar.prototype.getCurrent = function() {
    return 1.0;
}

Bar.prototype.draw = function(ctx) {
    ctx.save();
    if(this.backColor) {
        ctx.fillStyle = this.backColor;
        ctx.fillRect(
            this.pos.x(), 
            this.pos.y(), 
            this.size.x(), 
            this.size.y());
    }
    if(this.fillColor) {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(
            this.pos.x(), 
            this.pos.y(), 
            this.size.x() * this.getCurrent() / this.getMax(), 
            this.size.y());
    }
    if(this.borderColor && this.borderWidth) {
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(
            this.pos.x(), 
            this.pos.y(), 
            this.size.x(), 
            this.size.y());
    }
    ctx.restore();
}

