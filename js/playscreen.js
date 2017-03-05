"use strict";

// === START PLAY SCREEN
function PlayScreen(ctx, game) {
    Screen.call(this, ctx);
    this.game = game;

    this.pause_screen = new PauseScreen(ctx, this);
    this.addHandler(ctx.canvas, "mousedown", game.handleMouseDown.bind(game));
    this.addHandler(ctx.canvas, "mouseup", game.handleMouseUp.bind(game));
    this.addHandler(ctx.canvas, "mousemove", game.handleMove.bind(game));
    this.addHandler(ctx.canvas, "contextmenu", game.handleContext.bind(game));
    this.addHandler(window, "keydown", game.handleKeyDown.bind(game));
    this.addHandler(window, "keyup", game.handleKeyUp.bind(game));
    this.addHandler(window, "blur", 
        this.pause_screen.open.bind(this.pause_screen));

    /* TODO make base width and base height gathered externally somehow */
    this.baseWidth = 800;
    this.baseHeight = 600;

    this.lifeBar = new Bar(Vector2.create(10, 10), Vector2.create(this.baseWidth - 10, 20));
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

PlayScreen.prototype.step = function(currentTime) {
    Screen.prototype.step.call(this, currentTime);
    this.game.step(this.elapsedTime, this.dt);
}

PlayScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    // draw the background of stars
    this.drawBackground();
    // draw the play entities
    this.ctx.save();
    this.ctx.translate(this.game.origin.x, this.game.origin.y);
    var entities = this.game.getEntities();

    for(var i = 0; i < entities.length; i++)
        entities[i].draw(this.ctx);

    this.ctx.restore();

    // draw the number of fighters spawned this level
    this.ctx.save();
    this.ctx.fillStyle = "#FF0000";
    this.ctx.font = "24px joystix";
    this.ctx.fillText("SCORE: " + Math.round(this.elapsedTime * 1000), 200, 550);
    this.ctx.restore();

    // draw the HUD
    this.drawHud();

    // Draw the cursor
    this.ctx.save();
    this.ctx.translate(
        this.game.mouse.x + this.game.origin.x,
        this.game.mouse.y + this.game.origin.y);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#FF0000";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    this.ctx.moveTo(0, -8);
    this.ctx.lineTo(0, 8);
    this.ctx.moveTo(-8, 0);
    this.ctx.lineTo(8, 0);
    this.ctx.stroke();
    this.ctx.restore();
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
    this.option_screen = new OptionScreen(this.ctx, this, this.parent_screen.game);
    this.addOption(
        new TextButton(
            Vector2.create(300, 300),
            "continue",
            "24px joystix",
            "#CCCCCC",
            this.close.bind(this)));
    this.addOption(
        new TextButton(
            Vector2.create(300, 350),
            "options",
            "24px joystix",
            "#CCCCCC",
            this.option_screen.open.bind(this.option_screen)));
    this.addOption(
        new TextButton(
            Vector2.create(300, 400),
            "quit",
            "24px joystix",
            "#CCCCCC",
            (function() {
                this.close();
                this.parent_screen.game.lose();
            }).bind(this)));
}

PauseScreen.prototype = new MenuScreen();

PauseScreen.prototype.open = function() {
    MenuScreen.prototype.open.call(this);
    this.parent_screen.pause();
}

