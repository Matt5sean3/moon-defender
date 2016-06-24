
function OptionScreen(ctx, parent_screen, game) {
    MenuScreen.call(this, ctx);
    this.game = game;
    this.parent_screen = parent_screen;
    this.addOption(
        new TextButton(
            Vector.create(50, 50),
            "Back",
            "24px joystix",
            "#CCCCCC",
            this.close.bind(this)));

    function renderMuteButton(state_function, ctx, time, dt) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#EEEEEE";
        ctx.lineWidth = 2;
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        if(!state_function()) {
            var p = 25 / Math.sqrt(2);
            ctx.moveTo(-p, -p);
            ctx.lineTo(p, p);
        }
        ctx.stroke();
        ctx.restore();
    }

    var muteEffectsButton = new Button(
        Vector.create(675, 170),
        new BoundingCircle(25),
        game.toggleEffects.bind(game));
    muteEffectsButton.render = 
        renderMuteButton.bind(null, game.hasEffects.bind(game));
    this.addOption(muteEffectsButton);

    var muteMusicButton = new Button(
        Vector.create(675, 320),
        new BoundingCircle(25),
        game.toggleMusic.bind(game));
    muteMusicButton.render = 
        renderMuteButton.bind(null, game.hasMusic.bind(game));
    this.addOption(muteMusicButton);

    this.addOption(
        new TextButton(
            Vector.create(100, 150),
            "Effects",
            "24px joystix",
            "#CCCCCC",
            function() {
                game.effects[0].play();
            }));

    this.addSlider(
        Vector.create(100, 200),
        game.getEffectsVolume.bind(game),
        game.setEffectsVolume.bind(game),
        600,
        50,
        100);

    this.addOption(
        new TextButton(
            Vector.create(100, 300),
            "Music",
            "24px joystix",
            "#CCCCCC",
            function() {}));

    this.addSlider(
        Vector.create(100, 350),
        game.getMusicVolume.bind(game),
        game.setMusicVolume.bind(game),
        600,
        50,
        100);
}

OptionScreen.prototype = new MenuScreen();

OptionScreen.prototype.render = function() {
}

