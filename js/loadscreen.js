"use strict";

function LoadScreen(ctx, images, media, nextScreen) {
    Screen.call(this, ctx);
    this.images = images;
    this.media = media;
    this.next = nextScreen;
    this.fraction = 0;
}

LoadScreen.prototype = new Screen();

LoadScreen.prototype.step = function(currentTime) {
    Screen.prototype.step.call(this, currentTime);
    var numerator = 0;
    var denominator = this.images.length + this.media.length;
    for(var i = 0; i < this.images.length; i++)
        if(this.images[i].complete)
            numerator += 1;
    for(var i = 0; i < this.media.length; i++)
        if(this.media[i].readyState == 4)
            numerator += 1;
    if(this.images.length + this.media.length == denominator)
    this.fraction = numerator / denominator;
    if(numerator == denominator) {
        this.close();
        this.next.open();
    }
}

LoadScreen.prototype.draw = function(currentTime) {
    // placeholder
    Screen.prototype.draw.call(this, currentTime);
    this.ctx.save();
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("%" + Math.floor(100 * this.fraction), 40, 40);
    this.ctx.restore();
}
