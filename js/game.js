"use strict";

function Game(display) {
    this.display = display;

    this.vrEnabled = false;

    /* */
    this.origin = Vector2.create(this.display.getWidth() / 2, this.display.getHeight() / 2);
    // Adjust the mouse position

    this.moon = null;
    this.gun = null;
    this.life = 10;
    this.bullets = [];
    this.fighters = [];
    this.collisions = new CollisionGroup();

    this.mouse = Vector2.create(0, 0);

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
    this.scoreScreen = null;
    this.lossScreen = null;
    this.wonScreen = null;

    this.firingBullets = false;
    this.lastBullet = 0;
    this.bulletPeriod = 0.5;

    this.ccwKey = "A".charCodeAt(0);
    this.cwKey = "D".charCodeAt(0);

    this.muteKey = "M".charCodeAt(0);
    this.pauseKey = "P".charCodeAt(0);
    this.suicideKey = "Q".charCodeAt(0);

    this.ccw = false;
    this.cw = false;
    this.bounds = new BoundingBox(1600, 1200);
    this.upperXBound = 800;
    this.lowerXBound = -800;
    this.upperYBound = 600;
    this.lowerYBound = -600;
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

Game.prototype.hasVR = function() {
    return this.vrEnabled;
}

Game.prototype.toggleVR = function() {
    this.vrEnabled = !this.vrEnabled;
    if(this.vrEnabled)
        this.display.enableVR();
    else
        this.display.disableVR();
}

Game.prototype.setScreen = function(screen) {
    this.screen = screen;
}

Game.prototype.setScoreScreen = function(screen) {
    this.scoreScreen = screen;
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

Game.prototype.reset = function() {
    this.moon = new Moon(300000, Vector2.create(0, 0), this.life, this.lose.bind(this));
    this.gun = new Gun(20, Vector2.create(0, -30), 0, this.blaster_audio, this.torpedo_audio);
    this.theme_audio.loop = true;
    this.theme_audio.currentTime = 0;
    this.collisions = new CollisionGroup();
    this.bullets = [];
    this.fighters = [];
    this.score = 0;
}

Game.prototype.start = function() {
    // reset the stage
    this.firingLaser = false;
    this.firingBullets = false;
    this.ccw = false;
    this.cw = false;
    this.theme_audio.play();
}

Game.prototype.lose = function() {
    this.scoreScreen.setScore(this.score);
    this.scoreScreen.getScores();
    this.theme_audio.pause();
    this.screen.next = this.lossScreen;
}

Game.prototype.win = function() {
    this.theme_audio.pause();
    this.screen.next = this.winScreen;
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

Game.prototype.addShot = function(bullet) {
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
    this.mouse = getMousePosition(e, this.display.ctx.canvas).subtract(this.origin);
}

Game.prototype.hasNoFighters = function() {
    return !this.fighters.length;
}

Game.prototype.toggleMute = function() {
    if(this.hasMusic() == this.hasEffects()) {
        this.toggleMusic();
        this.toggleEffects();
    } else {
        this.toggleMusic();
    }
}

Game.prototype.step = function(currentTime, dt) {
    this.score += dt;
    if(this.firingLaser && this.gun.ready(this.screen.elapsedTime))
        this.addShot(this.gun.shootLaser(this.screen.elapsedTime));
    if(this.firingBullets && this.gun.ready(this.screen.elapsedTime))
        this.addShot(this.gun.shootBullet(this.screen.elapsedTime));
    if(this.level)
        this.level.step(currentTime, dt);
    if(this.cw || this.ccw)
        this.gun.rotate(dt * (this.ccw - this.cw));
    this.gun.pointAt(this.mouse);
    var entities = this.getEntities();
    var killed_entity = false;
    for (var i = 0; i < entities.length; i++)
        if(!this.bounds.check(entities[i].getPosition().subtract(
                Vector2.create(-800, -600)))) {
            entities[i].destroy();
            killed_entity = true;
        }
    if (killed_entity) {
        // clean collisions
        this.collisions.clean();
        // clean fighters
        this.cleanFighters();
        // clean bullets
        this.cleanBullets();
    }

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
    this.reset();
}
