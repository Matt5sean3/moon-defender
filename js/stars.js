"use strict";
let stars = [];

window.addEventListener("load", () => {
  stars = populateStars(87)
  // console.log(stars)
}, false);

let animate = (con, currentTime) => {
  con.save();
  stars.map((star) => star.draw(con, currentTime))
  con.restore();
}

let populateStars = (numStars) => {
  let arr = Array.apply(null, Array(numStars)).map(() => Star.init())
  return arr;
}

let Star = {
  init() {
    let newStar = Object.create(this);
    newStar.length = 1 + Math.random() * 1.8;
    newStar.period = Math.random() * 1.6 + 10;
    newStar.factor = 1;
    newStar.period = Math.random() * 1.6 + 10;
    newStar.cycle = 0;
    newStar.pos = {
      x: Math.round(Math.random() * canvas.width),
      y: Math.round(Math.random() * canvas.height)
    }
    return newStar;
  },
  draw(con, currentTime) {

    let frameTime = (currentTime % this.period) / this.period;

    let passedCycles = Math.floor(currentTime / this.period);

    // Save the context
    con.save();

    // move into the middle of the canvas, just to make room
    con.translate(this.pos.x + this.pos.x / 2, this.pos.y);

    if (this.cycle < passedCycles) {
      this.pos.x = Math.round(Math.random() * con.width);
      this.pos.y = Math.round(Math.random() * con.width);
      this.cycle = passedCycles;
    }

    //TODO: have opacity change slowly between .2 and .5
    //TODO: make opacity transition smoother between frames
    this.opacity = 0.5 + 0.5 * Math.sin(2 * Math.PI * frameTime);


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
}
