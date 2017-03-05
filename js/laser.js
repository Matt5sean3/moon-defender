"use strict";

function Laser(mass, pos, vel) {
    Mass.call(this, mass, pos, vel, new BoundingCircle(5));
    this.vel = vel;
    this.age = 0;
}

Laser.prototype = new Mass();

Laser.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.vel.angle + Math.PI/2);
    this.render(ctx);
    ctx.restore();
}

Laser.prototype.step = function(currentTime, dt) {
    Mass.prototype.step.call(this, currentTime, dt);
    this.age += dt;
    if(this.age > this.lifetime)
        this.destroy();
}

Laser.prototype.render = function(ctx) {
  // #layer1
  // #layer1
  var x1 = 0;
  var y1 = 0;
  var r =  50;
  var theta = 75;
  ctx.save();
  ctx.scale(3.000000, 3.000000);
  ctx.moveTo(0, 0);
  ctx.strokeStyle = '#ff0000';
  ctx.lineTo(0, 0 + r * Math.sin(theta));
  ctx.stroke();
  ctx.restore();
}

