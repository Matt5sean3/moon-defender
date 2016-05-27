"use strict";

// sort of governs the game object
// Contains information about when fighters are supposed to spawn
function Level(game, info) {
    this.data = (info === undefined)? 0: info; // should contain a large array
    this.game = (game === undefined)? null: game;
    this.prevDelay = 0;
    this.prevIndex = 0;
}

Level.prototype.useGame = function(game) {
    
}

Level.prototype.reset = function() {
    this.prevDelay = 0;
    this.prevIndex = 0;
}

Level.prototype.step = function(currentTime, dt) {
    for(; this.data[i].delay < currentTime  - this.prevDelay && 
            this.finished(); this.prevIndex++) {
        var entry = this.data[this.prevIndex];
        this.prevDelay += entry.delay;
        var radius = entry.radius;
        var pos = new Victor(
            entry.position[0], 
            entry.position[1]);
        var vel = new Victor(
            entry.velocity[0],
            entry.velocity[1]);
        this.game.addFighter();
    }
}

Level.prototype.finished = function() {
    return this.prevIndex < this.data.length;
}

// A level that keeps spawning fighters ~900 pixels from the moon
function MarathonLevel(game) {
    Level.call(this, game, null);
}

MarathonLevel.prototype = new Level();

MarathonLevel.prototype.step = function(currentTime, dt) {
    // number of spawning fighters will grow logarithmically over time
    if(currentTime > this.prevIndex) {
        this.prevIndex++;
        var nfighters = Math.floor(Math.log(this.prevIndex));
        for(var i = 0; i < nfighters; i++)
            this.generateFighter();
    }
}

MarathonLevel.prototype.generateFighter = function() {
    var angle = 2 * Math.PI * Math.random();
    var distance = 450;
    var velocity = 10;
    var pos = new Victor(
        distance * Math.sin(angle), 
        distance * Math.cos(angle));
    var vel = new Victor(
        -velocity * Math.sin(angle), 
        -velocity * Math.cos(angle));
    this.game.addFighter(pos, vel);
}

MarathonLevel.prototype.finished = function() {
    return false;
}
