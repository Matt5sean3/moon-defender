"use strict";
// Clicking through is a fundamental splash screen option
// Some splash screens are timed though

// START SPLASH SCREEN
function SplashScreen(ctx, nextScreen, media) {
    Screen.call(this, ctx);
    this.next = (nextScreen === undefined)? null: nextScreen;
    this.media = (media === undefined)? []: media;
    if(ctx !== undefined)
        this.addHandler(ctx.canvas, "mousedown", this.close.bind(this));
}

SplashScreen.prototype = new Screen();

SplashScreen.prototype.open = function() {
    Screen.prototype.open.call(this);
    // Reset the start of the accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].currentTime = 0;
}

SplashScreen.prototype.unpause = function() {
    Screen.prototype.unpause.call(this);
    // start or resume playing the accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].play();
}

SplashScreen.prototype.draw = function(currentTime) {
    Screen.prototype.draw.call(this, currentTime);
    this.ctx.save();
    this.render(this.ctx, this.elapsedTime, this.dt);
    this.ctx.restore();
}

SplashScreen.prototype.pause = function() {
    Screen.prototype.pause.call(this);
    // pause accompanying media
    for(var i = 0; i < this.media.length; i++)
        this.media[i].pause();
}

SplashScreen.prototype.close = function() {
    Screen.prototype.close.call(this);
    this.next.open();
}

SplashScreen.prototype.render = function(ctx, currentTime, dt) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("SPLASH PLACEHOLDER", 40, 40);
}
// === END SPLASH SCREEN

function TimedSplashScreen(ctx, duration, nextScreen, media) {
    SplashScreen.call(this, ctx, nextScreen, media);
    this.duration = duration;
}

TimedSplashScreen.prototype = new SplashScreen();

TimedSplashScreen.prototype.draw = function(currentTime) {
    SplashScreen.prototype.draw.call(this, currentTime);
    if(this.elapsedTime > this.duration)
        this.close();
}

function ScoreBoardScreen(ctx, nextScreen, media) {
  SplashScreen.call(this, ctx, nextScreen, media);
  this.name = "";
  this.score = 0;
  this.scores = [];
  this.addHandler(window, "keydown", (function(e) {
    if( e.key.length == 1 && 
        this.name.length < 20 && 
        ((e.key >= "a" && e.key <= "z") || (e.key >= "A" && e.key <= "Z")))
      this.name = this.name + e.key;
    else if(e.key == "Backspace")
      this.name = this.name.slice(0, this.name.length - 1);
    else if(e.key == "Enter" && this.name != "")
      this.submitScore(this.name, this.score);
  }).bind(this));
}

ScoreBoardScreen.prototype = new SplashScreen();

ScoreBoardScreen.prototype.getScores = function() {
  // Retrieves the current leaderboard
  var req = new XMLHttpRequest();
  req.addEventListener("readystatechange", (function(){
    if(req.readyState == 4 && req.status == 200) {
      this.scores = req.responseText.split(";");
    }
  }).bind(this));
  req.open("GET", "../cgi-bin/getscores.py", true);
  req.send();
}

ScoreBoardScreen.prototype.submitScore = function(name, score) {
  var req = new XMLHttpRequest();
  req.addEventListener("readystatechange", (function(){
    if(req.readyState == 4 && req.status == 200) {
      var readback = req.responseText.split(",");
      if(name != readback[0] || score != parseInt(readback[1])) {
        alert(req.responseText);
      }
    }
  }).bind(this));
  req.open("GET", "../cgi-bin/addscore.py?name=" + name +"&score=" + score, true);
  req.send();
}

ScoreBoardScreen.prototype.setScore = function(score) {
  this.score = score;
}

ScoreBoardScreen.prototype.render = function(currentTime) {
  this.ctx.save();
  this.ctx.font = "18px joystix";
  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.fillText("Enter your name: ", 100, 50);
  if(this.name != "")
    this.ctx.fillText("Press enter to submit your score.", 100, 75);
  this.ctx.fillText(this.name, 400, 50);
  this.ctx.fillText("LEADERBOARD", 100, 125);
  for(var c = 0; c < this.scores.length; c++)
    this.ctx.fillText(this.scores[c], 100, 150 + c * 20);
  this.ctx.restore();
}

