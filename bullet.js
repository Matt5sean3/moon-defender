"use strict";

function Bullet(mass, pos, vel) {
	Mass.call(this, mass, pos, vel, new BoundingCircle(5));
	this.vel = vel;
	this.age = 0;
}

Bullet.prototype = new Mass();

Bullet.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.pos.x, this.pos.y);
	ctx.rotate(this.vel.angle()+Math.PI/2);
	renderBullet(ctx);
	ctx.restore();
}

Bullet.prototype.step = function(currentTime, dt) {
    Mass.prototype.step.call(this, currentTime, dt);
    this.age += dt;
    if(this.age > this.lifetime)
    	this.destroy();
}

function renderBullet(ctx) {
    // #layer1
	// #layer1
	ctx.save();
	ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -465.254100, -410.795740);
	
// #g8132
	ctx.save();
	ctx.transform(0.400016, 0.000000, 0.000000, 0.400016, 279.144890, 251.407030);
	
// #g8128
	
// #path8118
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(129, 129, 129)';
	ctx.miterLimit = 4;
	ctx.lineWidth = 0.304000;
	ctx.moveTo(475.101560, 403.468750);
	ctx.lineTo(465.406250, 403.468750);
	ctx.lineTo(465.406250, 418.871090);
	ctx.lineTo(475.101560, 418.871090);
	ctx.lineTo(475.101560, 403.468750);
	ctx.fill();
	ctx.stroke();
	
// #path1538
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(179, 83, 83)';
	ctx.miterLimit = 4;
	ctx.lineWidth = 0.304247;
	ctx.fillStyle = 'rgb(181, 91, 91)';
	ctx.moveTo(470.126950, 398.609380);
	ctx.translate(470.254102, 403.455582);
	ctx.rotate(0.000000);
	ctx.scale(1.000000, 1.000000);
	ctx.arc(0.000000, 0.000000, 4.847870, -1.597028, -3.14430882, 1);
	ctx.scale(1.000000, 1.000000);
	ctx.rotate(-0.000000);
	ctx.translate(-470.254102, -403.455582);
	ctx.lineTo(475.101560, 403.468750);
	ctx.translate(470.253708, 403.455593);
	ctx.rotate(0.000000);
	ctx.scale(1.000000, 1.000000);
	ctx.arc(0.000000, 0.000000, 4.847870, 0.002714, -1.59694639, 1);
	ctx.scale(1.000000, 1.000000);
	ctx.rotate(-0.000000);
	ctx.translate(-470.253708, -403.455593);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
	ctx.restore();
}