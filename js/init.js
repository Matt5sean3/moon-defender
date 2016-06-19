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
    var optionScreen = new MenuScreen(ctx);
    // Allow just clicking through splash screens
    var splashScreen = new SplashScreen(ctx, 3, menuScreen);
    var gameoverScreen = new SplashScreen(ctx, 3, menuScreen);


    // Use prototype well enough
    function MainLevel(request, render) {
        if(render !== undefined)
            this.render = render;
        this.level_request = request;
    }
    MainLevel.prototype = new SplashScreen(ctx, 5, playScreen);
    MainLevel.prototype.game = game;
    MainLevel.prototype.nextScreen = null;
    MainLevel.prototype.render = function(ctx, currentTime, dt) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.fillText("Level Intro Placeholder", 200, 200);
    }
    MainLevel.prototype.close = function() {
        SplashScreen.prototype.close.call(this);
        this.game.playLevel(new Level(this.level_request.response));
        // Set the win screen
        this.game.setWinScreen(this.nextScreen);
    }

    // We'll have ten levels for some reason
    var levelScreens = new Array(10);
    for(var c = 0; c < levelScreens.length; c++) {
        levelScreens[c] = new MainLevel(media[5 + c]);
    }
    for(var c = 0; c < levelScreens.length - 1; c++) {
        levelScreens[c].nextScreen = levelScreens[c + 1];
    }
    gameoverScreen.image = images[1];

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
    
    // Add a play button to the menuScreen
    menuScreen.addOption(
        new TextButton(
            Vector.create(200, 300), 
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
            Vector.create(200, 350),
            "Story Mode",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.close();
                levelScreens[0].open();
            }));

    menuScreen.addOption(
        new TextButton(
            Vector.create(200, 400),
            "Options",
            "24px joystix",
            "#CCCCCC",
            function() {
                menuScreen.pause();
                optionScreen.open();
            }));

    // not a very deep menu tree, so it's manually implemented
    optionScreen.addOption(
        new TextButton(
            Vector.create(100, 100),
            "Back",
            "24px joystix",
            "#CCCCCC",
            function() {
                optionScreen.close();
                menuScreen.unpause();
            }));

    optionScreen.addOption(
        new TextButton(
            Vector.create(100, 150),
            "Effects",
            "24px joystix",
            "#CCCCCC",
            function() {
                game.effects[0].play();
            }));

    optionScreen.addSlider(
        Vector.create(100, 200), 
        game.getEffectsVolume.bind(game),
        game.setEffectsVolume.bind(game),
        600,
        50,
        100);

    optionScreen.addOption(
        new TextButton(
            Vector.create(100, 250),
            "Music",
            "24px joystix",
            "#CCCCCC",
            function() {
            }));

    optionScreen.addSlider(
        Vector.create(100, 300),
        game.getMusicVolume.bind(game),
        game.setMusicVolume.bind(game),
        600,
        50,
        100);
    
    loadScreen.open();
}

window.addEventListener("load", init, false);

