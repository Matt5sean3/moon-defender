"use strict";

function BoundingShape() {
}

BoundingShape.prototype = new Object();

BoundingShape.prototype.check = function(relpos) {
	return false;
}

function BoundingBox(width, height) {
	this.width = width;
	this.height = height;
}

BoundingBox.prototype = new BoundingShape();

BoundingBox.prototype.check = function(relpos) {
	return relpos.x > 0 && relpos.x < this.width &&
		relpos.y > 0 && relpos.y < this.height;
}

function BoundingCircle(r) {
	this.radius = r;
}

BoundingCircle.prototype = new BoundingShape();

BoundingCircle.prototype.checkCollision = function(relpos, circle) {
	// needs to use right comparison based on each object's type
	var centerToCenter = circle.radius + this.radius;
	return relpos.lengthSq() < centerToCenter * centerToCenter;
}

// Checks whether a location is within a bounding circle
BoundingCircle.prototype.check = function(relpos) {
	return this.radius * this.radius > relpos.lengthSq()
}

function CollisionEvent(item1, item2, event) {
	this.item1 = item1;
	this.item2 = item2;
	this.event = event;
}

CollisionEvent.prototype = new Object();

CollisionEvent.prototype.check = function() {
	var relpos = this.item1.pos.clone().subtract(this.item2.pos);
	if(this.item1.bbox.checkCollision(relpos, this.item2.bbox))
		this.event();
}

// A collision event is dead if one or the other entities is destroyed
CollisionEvent.prototype.dead = function() {
	return this.item1.isDestroyed() || this.item2.isDestroyed();
}

function CollisionGroup() {
	this.collisionEvents = [];
}

CollisionGroup.prototype = new Object();

CollisionGroup.prototype.checkCollisions = function() {
	// Check the collisions for which events exist
	for(var i = 0; i < this.collisionEvents.length; i++)
		this.collisionEvents[i].check();
}

CollisionGroup.prototype.clean = function() {
	// cleans out dead collision events
	for(var i = 0; i < this.collisionEvents.length; i++)
		if(this.collisionEvents[i].dead()) {
			this.collisionEvents.splice(i, 1);
			i--;
		}
}

CollisionGroup.prototype.addCollisionEvent = function(item1, item2, evt) {
	this.collisionEvents.push(new CollisionEvent(item1, item2, evt));
}

CollisionGroup.prototype.removeCollision = function(event) {
	// Not the fastest thing but this shouldn't happen too often
	for(var i = 0; i < this.collisionEvents.length; i++)
		if(this.collisionEvents[i] == event) {
			this.collisionEvents.splice(i, 1);
			break;
	  }
}

