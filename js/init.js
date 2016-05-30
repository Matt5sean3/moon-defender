"use strict";

function init() {
    // Everything is so nice and highly abstracted now
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    var game = new Game(ctx);
    var marathon = new MarathonLevel(game);
    
    var images = [
        new Image(), 
        new Image(), 
        new Image()];
    images[0].src = 'resources/40px_Moon.png';
    images[1].src = 'resources/gameover.png';
    images[2].src = 'resources/hackrva.png';
    
    var media = [
        new Audio(), 
        new Audio(), 
        new Audio(), 
        new Audio()];
    media[0].src = 'resources/theme1.ogg';
    media[1].src = 'resources/blaster.ogg';
    media[2].src = 'resources/ambient.ogg';
    media[3].src = 'resources/torpedo.ogg';
    
    var playScreen = new PlayScreen(ctx, game);
    game.setScreen(playScreen);

    var menuScreen = new MenuScreen(ctx);
    var splashScreen = new SplashScreen(ctx, 3, menuScreen);
    var gameoverScreen = new SplashScreen(ctx, 3, menuScreen);
    gameoverScreen.image = images[1];

    game.setNextScreen(gameoverScreen);

    splashScreen.image = images[2];
    splashScreen.render = function(ctx, currentTime, dt) {
        ctx.save();
        ctx.fillStyle = "#999999";
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = "#000000";
        var presentText = "Presented By";
        
        ctx.drawImage(this.image, 0, 0, 800, 600);

        ctx.font = "40px joystix";
        ctx.textBaseline = "top";

        var metrics = ctx.measureText(presentText);
        var widthOffset = metrics.width / 2;

        ctx.fillText(presentText, 400 - widthOffset, 40);
        ctx.restore();
    }

    gameoverScreen.render = function(ctx, currentTime, dt) {
        ctx.drawImage(this.image, 0, 0, 800, 600);
    }

    var loadScreen = new LoadScreen(
        ctx, images, media, splashScreen);
    
    // Add a play button to the menuScreen
    menuScreen.addOption(
        new Victor(200, 300), 
        new BoundingBox(100, 20), 
        function() {
            menuScreen.close();
            game.playLevel(marathon);
            playScreen.open();
        });
    
    loadScreen.open();
}

window.addEventListener("load", init, false);

