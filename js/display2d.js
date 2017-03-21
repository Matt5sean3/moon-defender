
/* A variant of display using the 2d canvas */
function Display2D(ctx) {
    Display.call(this, ctx);
}

Display2D.prototype = new Display();

