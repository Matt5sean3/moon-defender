
function TitleScreen(canvas, image, options) {
    MenuScreen.call(this, canvas);
    this.image = image;
    this.screenCount = 0;
    for(var i = 0; i < options.length; i++) {
        this.addScreen(options[i]);
    }
}

TitleScreen.prototype = new MenuScreen();

TitleScreen.prototype.addScreen = function(option) {
    var callback;
    if("cb" in option) {
        callback = (function(next, cb) {
            this.next = next;
            cb();
        }).bind(this, option.next, option.cb);
    } else {
        callback = (function(next) {
            this.next = next;
        }).bind(this, option.next);
    }
    this.addOption(
        new TextButton(
            Vector2.create(200, 300 + this.screenCount * 50),
            option.text,
            "24px joystix",
            "#FFFFFF",
            callback));

    this.screenCount++;
}


TitleScreen.prototype.render = function(ctx, currentTime) {
    /* Draw the background */
    ctx.drawImage(this.image, 0, 0);
    ctx.save();
    ctx.font = "60px joystix";
    ctx.fillStyle = "#EE1111";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.translate(160, 80);
    ctx.fillText("Moon", 0, 0);
    ctx.fillText("Defender", 60, 80);
    ctx.restore();
}

