
function Fighter(mass, pos, vel) {
    Mass.call(this, mass, pos, vel, new BoundingCircle(10));
}

Fighter.prototype = new Mass();


Fighter.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.vel.angle()+Math.PI/2);
    this.render(ctx);
    ctx.restore();
}

Fighter.prototype.render = function(ctx) {
// #layer1
    ctx.save();
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -0.361287, -1042.136700);
    
// #path1474
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgb(237, 167, 1)';
    ctx.lineCap = 'round';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.362000;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.moveTo(4.774027, 1050.079600);
    ctx.lineTo(5.019737, 1051.376400);
    ctx.bezierCurveTo(5.232283, 1051.493700, 5.490151, 1051.493700, 5.702697, 1051.376400);
    ctx.lineTo(5.948407, 1050.079600);
    ctx.lineTo(9.819037, 1051.594400);
    ctx.lineTo(6.379037, 1047.136700);
    ctx.lineTo(5.361267, 1042.678900);
    ctx.lineTo(4.343547, 1047.136700);
    ctx.lineTo(0.903537, 1051.594400);
    ctx.lineTo(4.774177, 1050.079600);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
