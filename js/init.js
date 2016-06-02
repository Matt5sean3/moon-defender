"use strict";

function init() {
    // Everything is so nice and highly abstracted now
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    var game = new Game(ctx);
    var marathon = new MarathonLevel();

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
        new Audio(),
        new XMLHttpRequest(),
        new XMLHttpRequest()];
    media[0].src = 'resources/theme1.ogg';
    media[1].src = 'resources/blaster.ogg';
    media[2].src = 'resources/ambient.ogg';
    media[3].src = 'resources/torpedo.ogg';
    media[4].responseType = "json";
    media[4].open('GET', 'resources/random_text.json', true);
    media[4].send();
    media[5].responseType = "json";
    media[5].open('GET', 'resources/level_one.json', true);
    media[5].send();

    var playScreen = new PlayScreen(ctx, game);
    game.setScreen(playScreen);

    var menuScreen = new MenuScreen(ctx);
    // Allow just clicking through splash screens
    var splashScreen = new SplashScreen(ctx, 3, menuScreen);
    var gameoverScreen = new SplashScreen(ctx, 3, menuScreen);
    var levelOneScreen = new SplashScreen(ctx, 5, playScreen);
    // create level one screen
    levelOneScreen.render = function(ctx, currentTime, dt) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.fillText("Level One Intro Placeholder", 200, 200);
    }
    levelOneScreen.close = function() {
        SplashScreen.prototype.close.call(this);
        game.playLevel(new Level(media[5].response));
    }
    gameoverScreen.image = images[1];

    game.setNextScreen(gameoverScreen);

    splashScreen.image = images[2];
    splashScreen.text_request = media[4];
    splashScreen.open = function() {
        SplashScreen.prototype.open.call(this);
        var texts = this.text_request.response;
        // 60 characters per line, 3 lines
        this.text = texts[Math.floor(Math.random() * texts.length)];
    }
    splashScreen.render = function(ctx, currentTime, dt) {
        ctx.save();
        ctx.fillStyle = "#999999";
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = "#000000";

        // Rather than just Created by
        // Add text based on things from our #random slack channel
        var presentText = "Created at";
        // Flavor text gets loaded from a JSON file
        var belowText = this.text;
            
        
        ctx.drawImage(this.image, 0, 0, 800, 600);

        // above text
        ctx.font = "40px joystix";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";

        ctx.fillText(presentText, 400, 40);

        // below text
        // Try wrapping the text if it's too long
        ctx.font = "16px joystix";
        ctx.textBaseline = "bottom";

        var parts = belowText.split(" ");
        var line = 0;
        var lineText = [];
        var maxLineLength = 60;
        var lineLength = 0;
        // Feels like this could be more elegant somehow
        for(var i = 0; i < parts.length; i++) {
          if(lineLength + parts[i].length + 1 > maxLineLength) {
            ctx.fillText(lineText.join(" "), 400, 550 + 16 * line);
            lineText = [];
            lineLength = 0;
            line += 1;
          }
          lineText.push(parts[i]);
          lineLength += 1 + parts[i].length;
        }
        ctx.fillText(lineText.join(" "), 400, 550 + 16 * line);

        ctx.restore();
    }

    gameoverScreen.render = function(ctx, currentTime, dt) {
        ctx.drawImage(this.image, 0, 0, 800, 600);
    }

    var loadScreen = new LoadScreen(
        ctx, images, media, splashScreen);
    
    // Add a play button to the menuScreen
    menuScreen.addOption(
        new TextButton(
            new Victor(200, 300), 
            "Marathon Mode",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.close();
                game.playLevel(marathon);
                playScreen.open();
            }));

    menuScreen.addOption(
        new TextButton(
            new Victor(200, 350),
            "Story Mode",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.close();
                levelOneScreen.open();
            }));
    
    loadScreen.open();
}

window.addEventListener("load", init, false);

