"use strict";

function Entity(pos, vel, bbox) {
    this.pos = (pos === undefined) ? Vector.create(0, 0) : pos;
    this.vel = (vel === undefined) ? Vector.create(0, 0) : vel;
    this.bbox = (bbox === undefined) ? new BoundingCircle(0) : bbox;
    this.destroyed = false; // treat as protected
}

Entity.prototype = new Object();

Entity.prototype.getPosition = function() {
    return this.pos;
}

Entity.prototype.getVelocity = function() {
    return this.vel;
}

Entity.prototype.destroy = function() {
    this.destroyed = true;
}

Entity.prototype.isDestroyed = function() {
    return this.destroyed;
}

Entity.prototype.draw = function(ctx, currentTime, dt) {
    
}
