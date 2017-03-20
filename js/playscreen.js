"use strict";

// === START PLAY SCREEN
function PlayScreen(canvas, game) {
    Screen.call(this, canvas);
    this.game = game;
    this.next = null;

    this.pause_screen = new PauseScreen(canvas, this);
    this.addHandler(canvas, "mousedown", this.handleMouseDown.bind(this));
    this.addHandler(canvas, "mouseup", this.handleMouseUp.bind(this));
    this.addHandler(canvas, "mousemove", this.handleMove.bind(this));
    this.addHandler(canvas, "contextmenu", this.handleContext.bind(this));
    this.addHandler(window, "keydown", this.handleKeyDown.bind(this));
    this.addHandler(window, "keyup", this.handleKeyUp.bind(this));

    this.addHandler(window, "blur", (function() {
        this.next = this.pause_screen;
    }).bind(this));

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

PlayScreen.prototype.handleKeyDown = function(e) {
    switch(e.keyCode) {
    case this.game.muteKey:
        this.game.toggleMusic();
        break;
    case this.game.cwKey:
        this.game.cw = true;
        break;
    case this.game.ccwKey:
        this.game.ccw = true;
        break;
    case this.game.pauseKey:
        this.next = this.pause_screen;
        break;
    case this.game.suicideKey:
        this.game.lose();
        break;
    }
}
PlayScreen.prototype.handleKeyUp = function(e) {
    switch(e.keyCode) {
    case this.game.cwKey:
        this.game.cw = false;
        break;
    case this.game.ccwKey:
        this.game.ccw = false;
        break;
    }
}

PlayScreen.prototype.handleContext = function(e) {
    if(e.button == 2) {
        e.preventDefault();
        return false;
    }
}

PlayScreen.prototype.handleMove = function(e) {
    this.game.updateMouse(e);
    return false;
}

PlayScreen.prototype.handleMouseDown = function(e) {
    e.preventDefault();
    this.game.updateMouse(e);
    if(e.button == 0) {
        // left mouse, fire lasers
        this.game.firingLaser = true;
    } else {
        // right mouse, fire bullets
        this.game.firingBullets = true;
    }
    return false;
}

PlayScreen.prototype.handleMouseUp = function(e) {
    this.game.firingBullets = false;
    this.game.firingLaser = false;
}

PlayScreen.prototype.open = function() {
    Screen.prototype.open.call(this);
    this.next = null;
    this.game.start();
}

PlayScreen.prototype.step = function(currentTime) {
    Screen.prototype.step.call(this, currentTime);
    this.game.step(this.elapsedTime, this.dt);
    return this.next;
}

PlayScreen.prototype.draw = function(ctx, currentTime) {
    Screen.prototype.draw.call(this, ctx, currentTime);
    // draw the background of stars
    this.drawBackground(ctx);
    // draw the play entities
    ctx.save();
    ctx.translate(this.game.origin.x, this.game.origin.y);
    var entities = this.game.getEntities();

    for(var i = 0; i < entities.length; i++)
        entities[i].draw(ctx);

    ctx.restore();

    // draw the number of fighters spawned this level
    ctx.save();
    ctx.fillStyle = "#FF0000";
    ctx.font = "24px joystix";
    ctx.fillText("SCORE: " + Math.round(this.game.score * 1000), 200, 550);
    ctx.restore();

    // draw the HUD
    this.drawHud(ctx);

    // Draw the cursor
    ctx.save();
    ctx.translate(
        this.game.mouse.x + this.game.origin.x,
        this.game.mouse.y + this.game.origin.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.restore();
}

PlayScreen.prototype.drawBackground = function(ctx) {
    animate(ctx, this.elapsedTime / 1000);
}

PlayScreen.prototype.drawHud = function(ctx) {
    // draw the lifebar of the moon
    this.lifeBar.draw(ctx);

    // Draw Moon Defender up in the left corner
    ctx.save();
    ctx.fillStyle = "#FF0000";
    ctx.font = "24px joystix";
    ctx.fillText("Moon Defender", 10, 50);
    ctx.restore();
}
// === END PLAY SCREEN

// The pause screen opens when "P" is pressed and when the window loses focus
function PauseScreen(ctx, parent_screen) {
    MenuScreen.call(this, ctx);
    this.parent_screen = parent_screen;
    this.option_screen = new OptionScreen(ctx, this, this.parent_screen.game);
    this.addOption(
        new TextButton(
            Vector2.create(300, 300),
            "continue",
            "24px joystix",
            "#CCCCCC",
            (function() {
                this.next = this.parent_screen;
            }).bind(this)));
    this.addOption(
        new TextButton(
            Vector2.create(300, 350),
            "options",
            "24px joystix",
            "#CCCCCC",
            (function() {
                this.next = this.option_screen;
            }).bind(this)));
    this.addOption(
        new TextButton(
            Vector2.create(300, 400),
            "quit",
            "24px joystix",
            "#CCCCCC",
            (function() {
                this.parent_screen.game.lose();
                this.next = this.parent_screen;
            }).bind(this)));
}

PauseScreen.prototype = new MenuScreen();

PauseScreen.prototype.open = function() {
    MenuScreen.prototype.open.call(this);
    this.parent_screen.pause();
}

