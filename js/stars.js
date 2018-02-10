"use strict";
let stars = [];
let numStars = 87;

window.addEventListener("load", function() {
  let canvas = document.getElementById('canvas');

  // Add stars to the stars array
  for (let i = 0; i < numStars; i++) {
    let star = new Star;
    stars.push(star);
  }

}, false);


let animate = (con) => {
    con.save();
    stars.map((star)=>star.draw(con))
    con.restore();
}

function Star() {
  this.length = 1 + Math.random() * 1.8;
  this.period = Math.random() * 1.6 + 10;
  this.pos = {x:Math.round(Math.random() * canvas.width),y:Math.round(Math.random() * canvas.height)};
}

Star.prototype.draw = function(con) {
    // Save the context
    con.save();

    // move into the middle of the canvas, just to make room
    con.translate(this.pos.x+this.pos.x/2, this.pos.y);

    this.opacity = 0.5 + 0.5 * Math.sin(3 * Math.PI);

    con.beginPath()
    for (let i = 5; i > 0 ; i--) {
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

    con.fill();

    con.restore();
}
