"use strict";
var screenH;
var screenW;
var stars = [];
var fps = 50;
var numStars = 200;

$('document').ready(function() {

  // Calculate the screen size
  screenH = 600;
  screenW = 800;

  // Get the canvas
  //canvas = document.getElementById("#space");

  // Fill out the canvas

  // Create all the stars
  for (var i = 0; i < numStars; i++) {
    var x = Math.round(Math.random() * screenW);
    var y = Math.round(Math.random() * screenH);
    var length = 1 + Math.random() * 2;
    var opacity = Math.random();

    // Create a new star and draw
    var star = new Star(x, y, length, opacity);

    // Add the the stars array
    stars.push(star);
  }

  
});

/**
 * Animate the canvas
 */

 
  
function animate(con, currentTime) {
  con.save();
  $.each(stars, function() {
    this.draw(con, currentTime);
  });
  con.restore();
}

/**
 * Star
 * 
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
function Star(x, y, length, opacity) {
  /*
  this.x = parseInt(x);
  this.y = parseInt(y);
  this.length = parseInt(length);
  */
  this.x = x;
  this.y = y;
  this.length = length;
  this.opacity = opacity;
  this.factor = 1;
  this.period = Math.random() * 1.6 + 10;
  this.cycle = 0;
}

/**
 * Draw a star
 * 
 * This function draws a start.
 * You need to give the contaxt as a parameter 
 * 
 * @param context
 */
Star.prototype.draw = function(con, currentTime) {
  
  var frameTime = (currentTime % this.period) / this.period;
  
  var passedCycles = Math.floor(currentTime / this.period);

  con.rotate((Math.PI * 1 / 10));

  // Save the context
  con.save();

  // move into the middle of the canvas, just to make room
  con.translate(this.x, this.y);

  if(this.cycle < passedCycles) {
    this.x = Math.round(Math.random() * screenW);
    this.y = Math.round(Math.random() * screenH);
    this.cycle = passedCycles;
  }
  this.opacity = 0.5 + 0.5 * Math.sin(2 * Math.PI * frameTime);

  con.beginPath()
  for (var i = 5; i > 0 ; i--) {
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