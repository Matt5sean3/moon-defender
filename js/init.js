"use strict";

function init() {
    // Everything is so nice and highly abstracted now
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var display = new Display(ctx);

    var game = new Game(display);
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

    // Use prototype well enough
    function MainLevel(canvas, next, request, render) {
        SplashScreen.call(this, canvas, next);
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
        SplashScreen.prototype.close.call(this);
        // Set the level
        this.game.playLevel(new Level(this.level_request.response));
        // Set the win screen
        this.game.setWinScreen(this.nextScreen);
    }

    var playScreen = new PlayScreen(canvas, game);
    // We'll have ten levels for some reason
    var levelScreens = new Array(10);
    for(var c = 0; c < levelScreens.length; c++) {
        levelScreens[c] = new MainLevel(canvas, playScreen, media[5 + c]);
    }
    for(var c = 0; c < levelScreens.length - 1; c++) {
        levelScreens[c].nextScreen = levelScreens[c + 1];
    }
    levelScreens[levelScreens.length - 1].nextScreen = victoryScreen;
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

    game.setScreen(playScreen);

    // Allow just clicking through splash screens

    var menuScreen = new TitleScreen(canvas, images[13], [
        {
            "text": "Marathon Mode",
            "next": playScreen,
            "cb": game.playLevel.bind(game, marathon)
        },
        {
            "text": "Story Mode",
            "next": levelScreens[0]
        }]);

    var scoreScreen = new ScoreBoardScreen(canvas, menuScreen, []);
    var gameoverScreen = new TimedSplashScreen(canvas, 3, scoreScreen);
    var victoryScreen = new SplashScreen(canvas, splashScreen);

    var optionScreen = new OptionScreen(canvas, menuScreen, game);
    menuScreen.addScreen({
        "text": "Options",
        "next": optionScreen
    });

    var creditsScreen = new CreditScreen(canvas, menuScreen);
    menuScreen.addScreen({
        "text": "Credits",
        "next": creditsScreen
    });

    var splashScreen = new TimedSplashScreen(canvas, 3, menuScreen);

    gameoverScreen.image = images[1];

    game.setScoreScreen(scoreScreen);

    victoryScreen.render = function(ctx, currentTime, dt) {
        ctx.drawImage(images[14], 0, 0, 800, 600);
    }

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

        var parts = this.text.split(" ");
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

    var loadScreen = new LoadScreen(images, media, splashScreen);

    display.setScreen(loadScreen);
    display.step(0);
}

window.addEventListener("load", init, false);
