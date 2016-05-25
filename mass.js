"use strict";


function Mass(mass, pos, vel, bbox) {
	Entity.call(this, pos, vel, bbox);
	this.mass = (mass == undefined)? 0: mass;
	this.attractions = [];
}

Mass.prototype = new Entity();

Mass.prototype.addGravity = function(mass) {
	this.attractions.push(mass);
}

Mass.prototype.step = function(currentTime, dt) {
	// apply gravity
	var acceleration = new Victor(0, 0);
	for(var i= 0; i < this.attractions.length; i++) {
		var vector = this.pos.clone().subtract(this.attractions[i].pos);
		var distSq = vector.lengthSq();
		vector.invert();
		vector.normalize();
		// calculate the magnitude of the acceleration
		var mag = this.attractions[i].mass / distSq;
		acceleration.add(vector.multiply(new Victor(mag, mag)));
	}
	// Go through kinematic equations approximation
	// 0.5 * a * t^2 + v0 * t
	this.pos.add(this.vel.clone().multiply(new Victor(dt, dt)));
	this.pos.add(acceleration.clone().multiply(new Victor(0.5 * dt * dt, 0.5 * dt * dt)));
	this.vel.add(acceleration.clone().multiply(new Victor(dt, dt)));
}
