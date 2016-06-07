"use strict";

// === START PLAY SCREEN
function PlayScreen(ctx, game) {
    Screen.call(this, ctx);
    this.game = game;
    this.clickHanlder = game.handleClick.bind(game);
    this.moveHandler = game.handleMove.bind(game);
    this.contextHandler = game.handleContext.bind(game);
    this.addCanvasHandler("mousedown", game.handleClick.bind(game));
    this.addCanvasHandler("mousemove", game.handleMove.bind(game));
    this.addCanvasHandler("contextmenu", game.handleContext.bind(game));

    var width = ctx.canvas.width - 10;
    var height = 20;
    this.lifeBar = new Bar(new Victor(10, 10), new Victor(width, height));
    this.lifeBar.setBorder("#DDDDDD", 3);
    this.lifeBar.setFill("#00CC00");
    this.lifeBar.getMax = (function() {
        return this.game.moon.getMaxLife();
    }).bind(this);
    this.lifeBar.getCurrent = (function() {
        return this.game.moon.getLife();
    }).bind(this);
}

PlayScreen.prototype = new Screen();

PlayScreen.prototype.open = function() {
    Screen.prototype.open.call(this);
    this.game.start();
}

PlayScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    // draw the background of stars
    this.drawBackground();
    // update the play entities
    this.game.step(this.elapsedTime, this.dt);
    // draw the play entities
    this.ctx.save();
    this.ctx.translate(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    var entities = this.game.getEntities();

    for(var i = 0; i < entities.length; i++)
        entities[i].draw(this.ctx);

    this.ctx.restore();

    // draw the HUD
    this.drawHud();
    
}

PlayScreen.prototype.drawBackground = function() {
    animate(this.ctx, this.elapsedTime / 1000);
}

PlayScreen.prototype.drawHud = function() {
    // draw the lifebar of the moon
    this.lifeBar.draw(this.ctx);

    // Draw Moon Defender up in the left corner
    this.ctx.save();
    this.ctx.fillStyle = "#FF0000";
    this.ctx.font = "24px joystix";
    this.ctx.fillText("Moon Defender", 10, 50);
    this.ctx.restore();
}
// === END PLAY SCREEN
