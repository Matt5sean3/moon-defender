"use strict";

// sort of governs the game object
// Contains information about when fighters are supposed to spawn
function Level(info, game) {
    this.data = (info === undefined)? 0: info; // should contain a large array
    this.game = (game === undefined)? null: game;
    this.index = 0;
}

Level.prototype.useGame = function(game) {
    this.game = game; 
}

Level.prototype.reset = function() {
    this.index = 0;
}

Level.prototype.step = function(currentTime, dt) {
    for(; !this.finished() &&
            this.data[this.index].time < currentTime; this.index++) {
        var entry = this.data[this.index];
        var pos = new Victor(
            entry.position[0], 
            entry.position[1]);
        var vel = new Victor(
            entry.velocity[0],
            entry.velocity[1]);
        this.game.addFighter(pos, vel);
    }
}

Level.prototype.finished = function() {
    return this.index >= this.data.length;
}

Level.prototype.won = function() {
    return this.finished() && this.game.hasNoFighters();
}

// A level that keeps spawning fighters ~900 pixels from the moon
function MarathonLevel() {
    Level.call(this);
}

MarathonLevel.prototype = new Level();

MarathonLevel.prototype.step = function(currentTime, dt) {
    // rate of spawning fighters should grow logarithmically
    // integral(ln(x + 1)) == (x + 1) * ln(x + 1) - x
    var num_spawned = (currentTime + 1) * Math.log(currentTime + 1) - currentTime;
    if(num_spawned > this.index) {
        var nfighters = num_spawned - this.index;
        for(var i = 0; i < nfighters; i++) {
            this.generateFighter();
            this.index++;
        }
    }
}

MarathonLevel.prototype.generateFighter = function() {
    // spawns the fighter at 450 pixels from the moon's center
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
