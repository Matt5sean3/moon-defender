"use strict";

// === START PLAY SCREEN
function PlayScreen(ctx, game) {
    Screen.call(this, ctx);

    this.pause_screen = new PauseScreen(ctx, this);

    this.game = game;
    this.addHandler(ctx.canvas, "mousedown", game.handleMouseDown.bind(game));
    this.addHandler(ctx.canvas, "mouseup", game.handleMouseUp.bind(game));
    this.addHandler(ctx.canvas, "mousemove", game.handleMove.bind(game));
    this.addHandler(ctx.canvas, "contextmenu", game.handleContext.bind(game));
    this.addHandler(window, "keydown", game.handleKeyDown.bind(game));
    this.addHandler(window, "keyup", game.handleKeyUp.bind(game));
    this.addHandler(window, "blur", 
        this.pause_screen.open.bind(this.pause_screen));

    var width = ctx.canvas.width - 10;
    var height = 20;
    this.lifeBar = new Bar(Vector.create(10, 10), Vector.create(width, height));
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

// The pause screen opens when "P" is pressed and when the window loses focus
function PauseScreen(ctx, parent_screen) {
    MenuScreen.call(this, ctx);
    this.parent_screen = parent_screen;
    this.addOption(
        new TextButton(
            Vector.create(300, 300),
            "continue",
            "24px joystix",
            "#CCCCCC",
            this.close.bind(this)));
}

PauseScreen.prototype = new MenuScreen();

PauseScreen.prototype.open = function() {
    MenuScreen.prototype.open.call(this);
    this.parent_screen.pause();
}

PauseScreen.prototype.close = function() {
    MenuScreen.prototype.close.call(this);
    this.parent_screen.unpause();
}

