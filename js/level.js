"use strict";

// sort of governs the game object
// Contains information about when fighters are supposed to spawn
function Level(info, game) {
    this.data = (info === undefined)? 0: info; // should contain a large array
    this.game = (game === undefined)? null: game;
    if(this.data != 0 && "life" in this.data)
        this.max_life = this.data.life;
    else
        this.max_life = 10;
    this.index = 0;
}

Level.prototype.useGame = function(game) {
    this.game = game; 
    this.game.setLife(this.max_life);
}

Level.prototype.reset = function() {
    this.index = 0;
}

Level.prototype.step = function(currentTime, dt) {
    for(; !this.finished() &&
            this.data[this.index].time < currentTime; this.index++) {
        var entry = this.data[this.index];
        this.game.addFighter(
            Vector2.create.apply(Vector2, entry.position), 
            Vector2.create.apply(Vector2, entry.velocity));
    }
}

Level.prototype.finished = function() {
    return this.index >= this.data.length;
}

Level.prototype.won = function() {
    return this.finished() && this.game.hasNoFighters();
}

// A level that keeps spawning fighters 450 pixels from the moon
function MarathonLevel() {
    Level.call(this);
    // Start with a lot more life for the marathon
    this.max_life = 100;
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
    this.game.addFighter(
        PolarVector2.create(angle, distance), 
        PolarVector2.create(angle, -velocity));
}

MarathonLevel.prototype.finished = function() {
    return false;
}

