"use strict";
let stars = [];
let numStars = 87;

window.addEventListener("load", function() {
  let canvas = document.getElementById('canvas');

  // Add stars to the stars array
  stars = Array.apply(null, Array(numStars)).map(()=>new Star());

}, false);

let animate = (con, currentTime) => {
  con.save();
  stars.map((star) => star.draw(con, currentTime))
  con.restore();
}

function Star() {
  this.length = 1 + Math.random() * 1.8;
  this.period = Math.random() * 1.6 + 10;
  this.factor = 1;
  this.period = Math.random() * 1.6 + 10;
  this.cycle = 0;
  this.pos = {
    x: Math.round(Math.random() * canvas.width),
    y: Math.round(Math.random() * canvas.height)
  };
}

Star.prototype.draw = function(con, currentTime) {
  let frameTime = (currentTime % this.period) / this.period;

  let passedCycles = Math.floor(currentTime / this.period);

  // Save the context
  con.save();

  // move into the middle of the canvas, just to make room
  con.translate(this.pos.x + this.pos.x / 2, this.pos.y);

  if(this.cycle < passedCycles) {
        this.pos.x = Math.round(Math.random() * con.width);
        this.pos.y = Math.round(Math.random() * con.width);
        this.cycle = passedCycles;
    }

  //TODO: have opacity change slowly between .2 and .5
  //TODO: make opacity transition smoother between frames
  this.opacity =  0.5 + 0.5 * Math.sin(2 * Math.PI * frameTime);


  con.beginPath()
  for (let i = 5; i > 0; i--) {
    con.lineTo(0, this.length);
    con.translate(0, this.length);
    con.rotate((Math.PI * 2 / 10));
    con.lineTo(0, -this.length);
    con.translate(0, -this.length);
    con.rotate(-(Math.PI * 6 / 10));
  }
  con.lineTo(0, this.length);
  con.closePath();
  con.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
  con.shadowBlur = 5;
  con.shadowColor = '#ffff33';
  con.fill();

  con.restore();
}
