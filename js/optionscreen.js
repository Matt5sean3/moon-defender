
function OptionScreen(ctx, parent_screen, game) {
    MenuScreen.call(this, ctx);
    this.game = game;
    this.parent_screen = parent_screen;
    this.addOption(
        new TextButton(
            Vector2.create(50, 50),
            "Back",
            "24px joystix",
            "#CCCCCC", 
            (function() {
                this.next = this.parent_screen;
            }).bind(this)));

    function renderToggleButton(state_function, ctx, time, dt) {
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
        Vector2.create(675, 170),
        new BoundingCircle(25),
        game.toggleEffects.bind(game));
    muteEffectsButton.render = 
        renderToggleButton.bind(null, game.hasEffects.bind(game));
    this.addOption(muteEffectsButton);

    var muteMusicButton = new Button(
        Vector2.create(675, 320),
        new BoundingCircle(25),
        game.toggleMusic.bind(game));
    muteMusicButton.render = 
        renderToggleButton.bind(null, game.hasMusic.bind(game));
    this.addOption(muteMusicButton);

    var vrButton = new Button(
        Vector2.create(675, 475),
        new BoundingCircle(25),
        game.toggleVR.bind(game));
    vrButton.render = renderToggleButton.bind(null, game.hasVR.bind(game));
    this.addOption(vrButton);

    this.addOption(
        new TextButton(
            Vector2.create(100, 150),
            "Effects",
            "24px joystix",
            "#CCCCCC",
            function() {
                game.effects[0].play();
            }));

    this.addSlider(
        Vector2.create(100, 200),
        game.getEffectsVolume.bind(game),
        game.setEffectsVolume.bind(game),
        600,
        50,
        100);

    this.addOption(
        new TextButton(
            Vector2.create(100, 300),
            "Music",
            "24px joystix",
            "#CCCCCC",
            function() {}));

    this.addSlider(
        Vector2.create(100, 350),
        game.getMusicVolume.bind(game),
        game.setMusicVolume.bind(game),
        600,
        50,
        100);

    this.addOption(
        new TextButton(
            Vector2.create(100, 450),
            "VR",
            "24px joystix",
            "#CCCCCC",
            function() {}));

}

OptionScreen.prototype = new MenuScreen();

