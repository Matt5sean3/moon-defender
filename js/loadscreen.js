"use strict";

function LoadScreen(ctx, images, media, nextScreen) {
    Screen.call(this, ctx);
    this.images = images;
    this.media = media;
    this.next = nextScreen;
}

LoadScreen.prototype = new Screen();

LoadScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    var numerator = 0;
    var denominator = this.images.length + this.media.length;
    for(var i = 0; i < this.images.length; i++)
        if(this.images[i].complete)
            numerator += 1;
    for(var i = 0; i < this.media.length; i++)
        if(this.media[i].readyState == 4)
            numerator += 1;
    if(numerator == denominator) {
        this.close();
        this.next.open();
    } else {
        this.render(this.ctx, numerator / denominator, this.elapsedTime, this.dt);
    }
}

LoadScreen.prototype.render = function(ctx, fraction, currentTime, dt) {
    // placeholder
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("%" + Math.floor(100 * fraction), 40, 40);
    ctx.restore();
}
