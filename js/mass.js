"use strict";


function Mass(mass, pos, vel, bbox) {
    Entity.call(this, pos, vel, bbox);
    this.mass = (mass === undefined)? 0: mass;
    this.attractions = [];
}

Mass.prototype = new Entity();

Mass.prototype.addGravity = function(mass) {
    this.attractions.push(mass);
}

Mass.prototype.step = function(currentTime, dt) {
    // apply gravity
    var acceleration = Vector.create(0, 0);
    for(var i= 0; i < this.attractions.length; i++) {
        // need to work on this part a little
        var vector = this.attractions[i].pos.subtract(this.pos);
        acceleration = acceleration.add(vector.normalize().scalarMultiply(this.attractions[i].mass / vector.radiusSq()));
    }
    // Go through kinematic equations approximation
    // x = 0.5 * a * t^2 + v0 * t + x0
    // v = a * t + v0
    this.pos = this.pos.add(this.vel.scalarMultiply(dt)).add(acceleration.scalarMultiply(0.5 * dt * dt));
    this.vel = this.vel.add(acceleration.scalarMultiply(dt));
}
