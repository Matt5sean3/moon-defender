
function CreditScreen(canvas, next) {
    SplashScreen.call(this, canvas, next);
}

CreditScreen.prototype = new SplashScreen();

CreditScreen.prototype.render = function(ctx, currentTime, dt) {
    ctx.fillStyle = "#CCCCCC";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.save();
    ctx.translate(160, 100);
    ctx.font = "40px joystix";
    ctx.fillText("Art", 0, 0);
    ctx.font = "32px joystix";
    ctx.fillText("Aaron Nipper", 5, 44);
    ctx.fillText("Eli Woods", 5, 80);
    ctx.fillText("Dustin Firebaugh", 5, 116);
    ctx.restore();

    ctx.save();
    ctx.translate(160, 300);
    ctx.font = "40px joystix";
    ctx.fillText("Code", 0, 0);
    ctx.font = "32px joystix";
    ctx.fillText("Matthew Balch", 5, 44);
    ctx.fillText("Eli Woods", 5, 80);
    ctx.fillText("Dustin Firebaugh", 5, 116);
    ctx.restore();

    ctx.font = "12px joystix";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText("click to return to the menu screen", 400, 580);
}

