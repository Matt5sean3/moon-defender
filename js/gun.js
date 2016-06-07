
function Gun(mass, pos, angle) {
    Mass.call(this, mass, pos, new Victor(0,0), new BoundingCircle(10));
    this.angle = (angle === undefined) ? 0 : angle;
}

Gun.prototype = new Mass();

Gun.prototype.setAngle = function(angle){
    this.angle = angle;
}

Gun.prototype.getAngle = function() {
    return this.angle;
}

Gun.prototype.pointAt = function(pos) {
    this.setAngle(pos.clone().subtract(this.pos).angle() + Math.PI / 2);
}

Gun.prototype.draw = function(ctx) {
    this.renderStand(ctx);
    this.renderTurret(ctx, this.angle);
}

Gun.prototype.renderStand = function(ctx) {
// #layer1
    ctx.save();
    ctx.translate(-10,-51);
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 242.924070, -158.196400);
    
// #path1576
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-222.466360, 189.830410);
    ctx.translate(-232.465124, 202.499773);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 16.139642, -0.902671, -1.45919777, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.465124, -202.499773);
    ctx.translate(-232.473439, 206.799650);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 20.419121, -1.482247, -1.90219943, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.473439, -206.799650);
    ctx.translate(-231.659753, 203.553075);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 17.708321, -2.005484, -2.25499229, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(231.659753, -203.553075);
    ctx.stroke();
    
// #path1578
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-242.852300, 189.830410);
    ctx.lineTo(-222.466360, 189.830410);
    ctx.stroke();
    
// #path1580
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-230.150780, 189.830410);
    ctx.lineTo(-230.150780, 177.846560);
    ctx.stroke();
    
// #path1582
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-235.167890, 189.830410);
    ctx.lineTo(-235.167890, 177.846560);
    ctx.stroke();
    
// #path1584
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-230.150780, 177.846560);
    ctx.translate(-232.659335, 177.842430);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 2.508558, 0.001646, -3.14323908, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.659335, -177.842430);
    ctx.translate(-232.659335, 177.850690);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 2.508558, -3.139946, -6.28483173, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.659335, -177.850690);
    ctx.stroke();
    
// #path1586
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-231.715250, 177.846560);
    ctx.translate(-232.659340, 177.844800);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.944092, 0.001864, -3.14345658, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.659340, -177.844800);
    ctx.translate(-232.659340, 177.848320);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.944092, -3.139729, -6.28504924, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.659340, -177.848320);
    ctx.stroke();
    
// #path1588
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-235.167890, 177.846560);
    ctx.lineTo(-237.552120, 187.022190);
    ctx.stroke();
    
// #path1590
    ctx.beginPath();
    ctx.miterLimit = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 0.227098;
    ctx.moveTo(-230.150780, 177.846560);
    ctx.lineTo(-226.776990, 187.395700);
    ctx.stroke();
}

Gun.prototype.renderTurret = function(ctx, gunangle) {
    
    var turretcolor = 'rgb(255, 0, 0)';
    
// #g4208
    ctx.translate(-232.418380, 176.778286);
    
    
    
    ctx.rotate(gunangle);
    
    ctx.translate(232.418380, -176.778286);
// #path1592
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-233.748460, 175.586780);
    ctx.lineTo(-233.748460, 170.685080);
    ctx.translate(-232.418380, 168.778286);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 2.324860, 2.179875, 0.96171797, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.418380, -168.778286);
    ctx.lineTo(-231.088300, 175.890860);
    ctx.fill();
    ctx.stroke();
    
// #path1594
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-233.748460, 170.685080);
    ctx.translate(-232.418343, 172.591848);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 2.324860, -2.179894, -1.81848729, 0);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.418343, -172.591848);
    ctx.fill();
    ctx.stroke();
    
// #path1596
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-231.848450, 171.032200);
    ctx.lineTo(-231.848450, 159.591560);
    ctx.fill();
    ctx.stroke();
    
// #path1598
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.988320, 171.032200);
    ctx.lineTo(-232.988320, 159.591560);
    ctx.fill();
    ctx.stroke();
    
// #path1600
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-231.848450, 170.337940);
    ctx.translate(-232.418411, 172.591852);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 2.324860, -1.323112, -0.96170165, 0);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.418411, -172.591852);
    ctx.fill();
    ctx.stroke();
    
// #path1602
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.988320, 159.591560);
    ctx.translate(-232.418385, 159.109891);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.746211, 2.439933, 0.70166006, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.418385, -159.109891);
    ctx.fill();
    ctx.stroke();
    
// #path1604
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.988320, 159.591560);
    ctx.translate(-232.418385, 160.073229);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.746211, -2.439933, -0.70166006, 0);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.418385, -160.073229);
    ctx.fill();
    ctx.stroke();
    
// #path1606
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.259880, 159.511580);
    ctx.lineTo(-232.259880, 158.889470);
    ctx.fill();
    ctx.stroke();
    
// #path1608
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.582560, 159.511580);
    ctx.lineTo(-232.582560, 158.909430);
    ctx.fill();
    ctx.stroke();
    
// #path1610
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.582560, 159.511580);
    ctx.translate(-232.421220, 159.459161);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.169642, 2.827451, 0.31414212, 1);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.421220, -159.459161);
    ctx.fill();
    ctx.stroke();
    
// #path1612
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-232.163730, 158.682470);
    ctx.translate(-232.434655, 158.681299);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.270928, 0.004322, 3.13727101, 0);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.434655, -158.681299);
    ctx.translate(-232.434655, 158.594730);
    ctx.rotate(0.000000);
    ctx.scale(1.000000, 1.000000);
    ctx.arc(0.000000, 0.000000, 0.284778, 2.828399, 6.59637931, 0);
    ctx.scale(1.000000, 1.000000);
    ctx.rotate(-0.000000);
    ctx.translate(232.434655, -158.594730);
    ctx.fill();
    ctx.stroke();
    
// #path1614
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-235.167890, 177.846560);
    ctx.lineTo(-237.612910, 177.846560);
    ctx.lineTo(-237.612910, 167.580090);
    ctx.lineTo(-234.667930, 169.474040);
    ctx.lineTo(-234.667930, 175.349600);
    ctx.lineTo(-234.231680, 175.891930);
    ctx.fill();
    ctx.stroke();
    
// #path1616
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-230.150780, 177.846560);
    ctx.lineTo(-227.242750, 177.846560);
    ctx.lineTo(-227.224550, 167.580090);
    ctx.lineTo(-230.169530, 169.474040);
    ctx.lineTo(-230.169530, 175.349600);
    ctx.lineTo(-231.088980, 175.820690);
    ctx.fill();
    ctx.stroke();
    
// #path1618
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-237.022430, 170.852970);
    ctx.lineTo(-236.381610, 169.378930);
    ctx.lineTo(-236.381610, 177.210030);
    ctx.lineTo(-237.022430, 177.210030);
    ctx.lineTo(-237.022430, 170.852970);
    ctx.fill();
    ctx.stroke();
    
// #path1620
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.miterLimit = 4;
    ctx.lineWidth = 0.227098;
    ctx.fillStyle = turretcolor;
    ctx.moveTo(-227.907850, 170.852970);
    ctx.lineTo(-228.548690, 169.378930);
    ctx.lineTo(-228.548690, 177.210030);
    ctx.lineTo(-227.907850, 177.210030);
    ctx.lineTo(-227.907850, 170.852970);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
