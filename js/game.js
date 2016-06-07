"use strict";

function Game(ctx) {
    this.ctx = ctx;

    this.origin = new Victor(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    // Adjust the mouse position
    this.crosshairAdjustment = new Victor(-10, -10);
    
    this.moon = null;
    this.gun = null;
    this.bullets = [];
    this.fighters = [];
    this.collisions = new CollisionGroup();
    
    this.mouse = new Victor(0, 0);
    
    // more game resources
    this.moon_img = new Image();
    this.moon_img.src = 'resources/40px_Moon.png';

    this.gameover_img = new Image();
    this.gameover_img.src = 'resources/gameover.png';
    
    this.theme_audio = new Audio();
    this.theme_audio.src = 'resources/theme1.ogg';
    
    this.blaster_audio = new Audio();
    this.blaster_audio.src = 'resources/blaster.ogg';
    
    this.ambient_audio = new Audio();
    this.ambient_audio.src = 'resources/ambient.ogg';
    
    this.torpedo_audio = new Audio();
    this.torpedo_audio.src = 'resources/torpedo.ogg';
    
    this.level = null;

    this.screen = null;
    this.lossScreen = null;
    this.wonScreen = null;
}

Game.prototype.setScreen = function(screen) {
    this.screen = screen;
}

Game.prototype.setLossScreen = function(screen) {
    this.lossScreen = screen;
}

Game.prototype.setWinScreen = function(screen) {
    this.winScreen = screen;
}

Game.prototype.getEntities = function() {
    var entities = [];
    entities.push(this.moon);
    entities.push(this.gun);
    entities.push.apply(entities, this.bullets);
    entities.push.apply(entities, this.fighters);
    return entities;
}

Game.prototype.start = function() {
    // reset the stage
    this.moon = new Moon(300000, new Victor(0, 0), 100, this.lose.bind(this));
    this.gun = new Gun(20, new Victor(0, -31), 0);
    this.bullets = [];
    this.fighters = [];
    this.collisions = new CollisionGroup();
    
    this.theme_audio.loop = true;
    this.theme_audio.currentTime = 0;
    this.theme_audio.play();
}

Game.prototype.lose = function() {
    console.log("LOST GAME!");
    if(this.screen)
        this.screen.close();
    if(this.lossScreen)
        this.lossScreen.open();
    this.theme_audio.pause();
}

Game.prototype.win = function() {
    console.log("WON LEVEL!");
    if(this.screen)
        this.screen.close();
    if(this.winScreen)
        this.winScreen.open();
    this.theme_audio.pause();
}


Game.prototype.addFighter = function(pos, vel) {
    var fighter = new Fighter(100, pos, vel);
    fighter.addGravity(this.moon);
    this.fighters.push(fighter);
    for (var i = 0; i < this.bullets.length; i++) {
        var bullet = this.bullets[i];
        this.collisions.addCollisionEvent(
            bullet,
            fighter,
            this.bulletCollideFighter.bind(this, bullet, fighter));
    }
    this.collisions.addCollisionEvent(
        this.moon,
        fighter,
        this.fighterCollideMoon.bind(this, fighter, this.moon));
}

Game.prototype.cleanFighters = function(fighter) {
    // remove the fighter from the list of fighters
    for(var i = 0; i < this.fighters.length; i++)
        if(this.fighters[i].isDestroyed()) {
            this.fighters.splice(i, 1);
            i--;
        }
}

Game.prototype.cleanBullets = function() {
    for(var i = 0; i < this.bullets.length; i++)
        if(this.bullets[i].isDestroyed()) {
            this.bullets.splice(i, 1);
            i--;
        }
}

Game.prototype.addBullet = function(pos, vel) {
    var bullet = new Bullet(5, pos, vel);
    bullet.addGravity(this.moon);
    // add collision events between the bullet and all current fighters
    for (var i = 0; i < this.fighters.length; i++) {
        var fighter = this.fighters[i];
        this.collisions.addCollisionEvent(
            bullet, 
            fighter, 
            this.bulletCollideFighter.bind(this, bullet, fighter));
    }
    this.bullets.push(bullet);
    this.torpedo_audio.pause();
    this.torpedo_audio.currentTime = 0;
    this.torpedo_audio.play();
}

Game.prototype.bulletCollideFighter = function(bullet, fighter) {
    console.log("Fighter destroyed!");
    // destroy the bullet
    bullet.destroy();
    fighter.destroy();
    // clean collisions
    this.collisions.clean();
    // clean fighters
    this.cleanFighters();
    // clean bullets
    this.cleanBullets();
}

Game.prototype.fighterCollideMoon = function(fighter, moon) {
    console.log("Fighter landed!");
    moon.damage(1);
    fighter.destroy();
    // clean collisions
    this.collisions.clean();
    // clean fighters
    this.cleanFighters();
}

Game.prototype.shootLaser = function() {
    this.blaster_audio.pause();
    this.blaster_audio.currentTime = 0;
    this.blaster_audio.play();
}

Game.prototype.updateMouse = function(e) {
    // Keep the mouse position in game coordinates
    // needs to account for the 
    this.mouse = getMousePosition(e, this.ctx.canvas).clone().subtract(this.crosshairAdjustment).subtract(this.origin);
}

Game.prototype.handleClick = function(e) {
    e.preventDefault();

    // again emulates offsetX and offsetY, need a shim function for this somewhere
    this.updateMouse(e);

    var missile_power = 200;
    // create a new bullet
    
    var gunAngle = this.gun.getAngle() + Math.PI * 5 / 4;
    var v = new Victor(10,10).rotate(gunAngle);
    v.add(new Victor(0,-30));

    //left mouse - bullet
    if(e.button === 0){
//        console.log("LEFT MOUSE CLICK!");
        this.addBullet(v, new Victor(missile_power / 2, missile_power / 2).rotate(gunAngle));
    }
    //right mouse - laser beam
    else{
        // TODO: what of middle mouse clicks?
        console.log("RIGHT MOUSE CLICK!");
        this.shootLaser();
    }
//    console.log(v);
//    console.log(this.mouse);

    //do something with mouse position here
    
    return false;
}

Game.prototype.hasNoFighters = function() {
    return !this.fighters.length;
}

Game.prototype.handleMove = function(e) {
    this.updateMouse(e);
    return false;
}

Game.prototype.handleContext = function(e) {
    //console.log("Right Mouse CLICK!!!");
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
}

Game.prototype.step = function(currentTime, dt) {
    if(this.level)
        this.level.step(currentTime, dt);
    this.gun.pointAt(this.mouse.clone());
    for (var i = 0; i < this.bullets.length; i++)
        this.bullets[i].step(currentTime, dt);
    for (var i = 0; i < this.fighters.length; i++)
        this.fighters[i].step(currentTime, dt);
    // check collisions
    this.collisions.checkCollisions();
    if(this.level.won())
        this.win();
}

Game.prototype.playLevel = function(level) {
    this.level = level;
    this.level.useGame(this);
}
