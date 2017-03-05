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
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image()
      ];
    images[0].src = 'resources/40px_Moon.png';
    images[1].src = 'resources/gameover.png';
    images[2].src = 'resources/hackrva.png';
    images[3].src = 'resources/cutScene1.png';
    images[4].src = 'resources/cutScene2.png';
    images[5].src = 'resources/cutScene3.png';
    images[6].src = 'resources/cutScene4.png';
    images[7].src = 'resources/cutScene5.png';
    images[8].src = 'resources/cutScene6.png';
    images[9].src = 'resources/cutScene7.png';
    images[10].src = 'resources/cutScene8.png';
    images[11].src = 'resources/cutScene9.png';
    images[12].src = 'resources/cutScene10.png';
    images[13].src = 'resources/menuBackground.png';
    images[14].src = 'resources/victory.png';

    var media = [
        new Audio(),
        new Audio(),
        new Audio(),
        new Audio(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest(),
        new XMLHttpRequest()];
    media[0].src = 'resources/theme1.ogg';
    media[1].src = 'resources/blaster.ogg';
    media[2].src = 'resources/ambient.ogg';
    media[3].src = 'resources/torpedo.ogg';
    var requests = [
        "resources/random_text.json",
        "resources/level_one.json",
        "resources/level_two.json",
        "resources/level_three.json",
        "resources/level_four.json",
        "resources/level_five.json",
        "resources/level_six.json",
        "resources/level_seven.json",
        "resources/level_eight.json",
        "resources/level_nine.json",
        "resources/level_ten.json"];
    var jsonStart = 4;
    for(var c = jsonStart; c < media.length; c++) {
        media[c].open("GET", requests[c - jsonStart], true);
        media[c].responseType = "json";
        media[c].send();
    }

    var playScreen = new PlayScreen(ctx, game);
    game.setScreen(playScreen);

    var menuScreen = new MenuScreen(ctx);
    var optionScreen = new OptionScreen(ctx, menuScreen, game);
    // Allow just clicking through splash screens
    var scoreScreen = new ScoreBoardScreen(ctx, menuScreen, []);
    var gameoverScreen = new TimedSplashScreen(ctx, 3, scoreScreen);
    var splashScreen = new TimedSplashScreen(ctx, 3, menuScreen);
    var victoryScreen = new SplashScreen(ctx, splashScreen);
    var creditsScreen = new SplashScreen(ctx, menuScreen);

    game.setScoreScreen(scoreScreen);

    victoryScreen.render = function(ctx, currentTime, dt) {
        ctx.drawImage(images[14], 0, 0, 800, 600);
    }

    creditsScreen.render = function(ctx, currentTime, dt) {
        ctx.fillStyle = "#CCCCCC";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        ctx.save();
        ctx.translate(160, 100);
        ctx.font = "40px joystix";
        ctx.fillText("Art", 0, 0);
        ctx.font = "32px joystix";
        ctx.fillText("Aaron Nipper", 5, 44);
        ctx.fillText("Eli Woods", 5, 80);
        ctx.fillText("Dustin Firebaugh", 5, 116);
        ctx.restore();

        ctx.save();
        ctx.translate(160, 300);
        ctx.font = "40px joystix";
        ctx.fillText("Code", 0, 0);
        ctx.font = "32px joystix";
        ctx.fillText("Matthew Balch", 5, 44);
        ctx.fillText("Eli Woods", 5, 80);
        ctx.fillText("Dustin Firebaugh", 5, 116);
        ctx.restore();

        ctx.font = "12px joystix";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText("click to return to the menu screen", 400, 580);
    }

    // Use prototype well enough
    function MainLevel(ctx, next, request, render) {
        SplashScreen.call(this, ctx, next);
        if(render !== undefined)
            this.render = render;
        this.level_request = request;
    }
    MainLevel.prototype = new SplashScreen();
    MainLevel.prototype.game = game;
    MainLevel.prototype.nextScreen = null;
    MainLevel.prototype.render = function(ctx, currentTime, dt) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        if("image" in this){
            ctx.drawImage(this.image,0,0,800,600);
        }
        else{
            ctx.fillText("Level Intro Placeholder", 200, 200);
        }
        ctx.font = "12px joystix";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#000000";
        ctx.fillText("click to proceed", 20, 580);
    }
    MainLevel.prototype.close = function() {
        this.game.playLevel(new Level(this.level_request.response));
        // Set the win screen
        this.game.setWinScreen(this.nextScreen);
        SplashScreen.prototype.close.call(this);
    }

    // We'll have ten levels for some reason
    var levelScreens = new Array(10);
    for(var c = 0; c < levelScreens.length; c++) {
        levelScreens[c] = new MainLevel(ctx, playScreen, media[5 + c]);
    }
    for(var c = 0; c < levelScreens.length - 1; c++) {
        levelScreens[c].nextScreen = levelScreens[c + 1];
    }
    levelScreens[levelScreens.length - 1].nextScreen = victoryScreen;
    gameoverScreen.image = images[1];
    levelScreens[0].image = images[3];
    levelScreens[1].image = images[4];
    levelScreens[2].image = images[5];
    levelScreens[3].image = images[6];
    levelScreens[4].image = images[7];
    levelScreens[5].image = images[8];
    levelScreens[6].image = images[9];
    levelScreens[7].image = images[10];
    levelScreens[8].image = images[11];
    levelScreens[9].image = images[12];

    game.setLossScreen(gameoverScreen);

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

    menuScreen.render = function(ctx, currentTime, dt) {
        ctx.drawImage(images[13], 0, 0);
        ctx.font = "60px joystix";
        ctx.fillStyle = "#EE1111";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.translate(160, 80);
        ctx.fillText("Moon", 0, 0);
        ctx.fillText("Defender", 60, 80);
    }

    // Add a play button to the menuScreen
    menuScreen.addOption(
        new TextButton(
            Vector2.create(200, 300),
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
            Vector2.create(200, 350),
            "Story Mode",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.close();
                levelScreens[0].open();
            }));


    menuScreen.addOption(
        new TextButton(
            Vector2.create(200, 400),
            "Options",
            "24px joystix",
            "#CCCCCC",
            optionScreen.open.bind(optionScreen)));

    menuScreen.addOption(
        new TextButton(
            Vector2.create(200, 450),
            "Credits",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.close();
                creditsScreen.open();
            }));

    loadScreen.open();
}

window.addEventListener("load", init, false);
