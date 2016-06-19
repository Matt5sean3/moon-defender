"use strict";

function Game(ctx) {
    this.ctx = ctx;

    this.origin = Vector.create(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    // Adjust the mouse position
    this.crosshairAdjustment = Vector.create(-10, -10);

    this.moon = null;
    this.gun = null;
    this.life = 10;
    this.bullets = [];
    this.fighters = [];
    this.collisions = new CollisionGroup();

    this.mouse = Vector.create(0, 0);

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

    this.music = [this.theme_audio];
    this.effects = [
        this.blaster_audio,
        this.ambient_audio,
        this.torpedo_audio];

    this.level = null;

    this.screen = null;
    this.lossScreen = null;
    this.wonScreen = null;

    this.firingBullets = false;
    this.lastBullet = 0;
    this.bulletPeriod = 0.5;

    this.ccwKey = "A".charCodeAt(0);
    this.cwKey = "D".charCodeAt(0);
    this.muteKey = "M".charCodeAt(0);
    this.pauseKey = "P".charCodeAt(0);
    this.ccw = false;
    this.cw = false;
}

Game.prototype.setLife = function(v) {
    this.life = v;
}

Game.prototype.toggleEffects = function() {
    for (var c = 0; c < this.effects.length; c++) {
        this.effects[c].muted = !this.effects[c].muted;
    }
}

Game.prototype.setEffectsVolume = function(level) {
    for (var c = 0; c < this.effects.length; c++) {
        this.effects[c].volume = level;
    }
}

Game.prototype.getEffectsVolume = function() {
    return this.effects[0].volume;
}

Game.prototype.hasEffects = function() {
    return !this.effects[0].muted;
}

Game.prototype.toggleMusic = function() {
    for (var c = 0; c < this.music.length; c++) {
        this.music[c].muted = !this.music[c].muted;
    }
}

Game.prototype.hasMusic = function() {
    return !this.music[0].muted;
}

Game.prototype.setMusicVolume= function(level) {
    for (var c = 0; c < this.music.length; c++) {
        this.music[c].volume = level;
    }
}

Game.prototype.getMusicVolume = function() {
    return this.music[0].volume;
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
    this.moon = new Moon(300000, Vector.create(0, 0), this.life, this.lose.bind(this));
    this.gun = new Gun(20, Vector.create(0, -30), 0);
    this.bullets = [];
    this.fighters = [];
    this.collisions = new CollisionGroup();

    //this.addFighter(Vector.create(100, 50), Vector.create(0, 0));  // this is creating one fighter on every level.

    this.firingLaser = false;
    this.firingBullets = false;
    this.ccw = false;
    this.cw = false;

    this.theme_audio.loop = true;
    this.theme_audio.currentTime = 0;
    this.theme_audio.play();
}

Game.prototype.lose = function() {
    if(this.screen)
        this.screen.close();
    if(this.lossScreen)
        this.lossScreen.open();
    this.theme_audio.pause();
}

Game.prototype.win = function() {
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
Game.prototype.addLaserBeam = function(bullet){
  for (var i = 0; i < this.fighters.length; i++) {
      var fighter = this.fighters[i];
      this.collisions.addCollisionEvent(
          bullet,
          fighter,
          this.bulletCollideFighter.bind(this, bullet, fighter));
  }
  this.bullets.push(bullet);
  this.blaster_audio.pause();
  this.blaster_audio.currentTime = 0;
  this.blaster_audio.play();
}
Game.prototype.addBullet = function(bullet) {
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
    moon.damage(1);
    fighter.destroy();
    // clean collisions
    this.collisions.clean();
    // clean fighters
    this.cleanFighters();
}

Game.prototype.updateMouse = function(e) {
    // Keep the mouse position in game coordinates
    // needs to account for the
    this.mouse = getMousePosition(e, this.ctx.canvas).subtract(this.crosshairAdjustment).subtract(this.origin);
}

Game.prototype.handleMouseDown = function(e) {
    e.preventDefault();

    // again emulates offsetX and offsetY, need a shim function for this somewhere
    this.updateMouse(e);

    var missile_power = 200;
    // create a new bullet

    var gunAngle = this.gun.getAngle() + Math.PI;
    var v = PolarVector.create(0, 10 * Math.sqrt(2)).rotate(gunAngle).addY(-30);

    // left mouse - bullet
    if(e.button === 0){
        this.firingLaser = true;
    }
    // right mouse - laser beam
    else{
        // TODO: what of middle mouse clicks?
        this.firingBullets = true;

    }

    return false;
}

Game.prototype.handleMouseUp = function(e) {
    if(e.button == 0) {

    }
    this.firingBullets = false;
    this.firingLaser = false;
}

Game.prototype.hasNoFighters = function() {
    return !this.fighters.length;
}

Game.prototype.handleMove = function(e) {
    this.updateMouse(e);
    return false;
}

Game.prototype.handleContext = function(e) {
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
}

Game.prototype.handleKeyDown = function(e) {
    switch(e.keyCode) {
    case this.muteKey:
        if(this.hasMusic() == this.hasEffects()) {
            this.toggleMusic();
            this.toggleEffects();
        } else {
            this.toggleMusic();
        }
        break;
    case this.cwKey:
        this.cw = true;
        break;
    case this.ccwKey:
        this.ccw = true;
        break;
    case this.pauseKey:
        console.log("PAUSING");
        this.screen.pause_screen.open();
        break;
    }
}

Game.prototype.handleKeyUp = function(e) {
    switch(e.keyCode) {
    case this.cwKey:
        this.cw = false;
        break;
    case this.ccwKey:
        this.ccw = false;
        break;
    }
}

Game.prototype.step = function(currentTime, dt) {
    if(this.firingLaser && this.gun.ready(this.screen.elapsedTime))
        this.addLaserBeam(this.gun.shootLaser(this.screen.elapsedTime));
    if(this.firingBullets && this.gun.ready(this.screen.elapsedTime))
        this.addBullet(this.gun.shoot(this.screen.elapsedTime));
    if(this.level)
        this.level.step(currentTime, dt);
    if(this.cw || this.ccw)
        this.gun.rotate(dt * (this.ccw - this.cw));
    this.gun.pointAt(this.mouse);
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
