"use strict";

function LoadScreen(images, media, nextScreen) {
    Screen.call(this);
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
    if(numerator == denominator)
        return this.next;
    return null;
}

LoadScreen.prototype.draw = function(ctx, currentTime) {
    // placeholder
    Screen.prototype.draw.call(this, ctx, currentTime);
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("%" + Math.floor(100 * this.fraction), 40, 40);
    ctx.restore();
}
