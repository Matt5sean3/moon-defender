"use strict";

function getMousePosition(e, canvas) {
    if ("offsetX" in e && "offsetY" in e)
        return Vector.create(e.offsetX, e.offsetY);
    else if (
            "pageX" in e && 
            "pageY" in e && 
            "offsetLeft" in canvas && 
            "offsetTop" in canvas)
        return Vector.create(
            e.pageX - canvas.offsetLeft, 
            e.pageY - canvas.offsetTop);
}
