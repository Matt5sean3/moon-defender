"use strict";

// Does vector mathematics

// These are meant to be essentially immutable objects
// With a weak compiler this could be inefficient memory-wise
// With a good compiler this can be very lean

// The main point here is that there are no side-effects
// This makes reasoning about the code much-much easier
// Whereas Victor.js was ALL side-effects

var Mat;
var Vector;
var Vector2;
var Vector4;
var PolarVector2;
var WrapVector2;
var WrapPolarVector2;

Mat = Object.create(null, {
    "create": {
        "writable": false,
        "configurable": false,
        "value": function() {
            var created = Object.create(this);
            created.basis = this;
            created.init.apply(created, arguments);
            return created;
        }
    },
    "copy": {
        "writable": true,
        "configurable": true,
        "value": function() {
            /* This might be blowing up the prototype stack */
            /* var created = Object.create(this); */
            /* This shouldn't blow up the prototype stack */
            var created = Object.create(this.basis);
            created.basis = this.basis;
            /* Makes a copy with dimensions and data decoupled from the original */
            created.data = new Float64Array(this.dims[0] * this.dims[1]);
            created.dims = [this.dims[0], this.dims[1]];
            return created;
        }
    },
    "init": {
        "writable": true,
        "configurable": true,
        "value": function(rows, cols, data) {
            this.data = (data === undefined)? new Float64Array(rows * cols) : data;
            this.dims = [rows, cols];
        }
    },
    "rows": {
        "configurable": false,
        "get": function() {
            return this.dims[0];
        }
    },
    "cols": {
        "configurable": false,
        "get": function() {
            return this.dims[1];
        }
    },
    "get": {
        "writable": true,
        "configurable": true,
        "value": function(row, col) {
            return this.data[row + ((col === undefined)? 0 : (this.rows * col))];
        }
    },
    "set": {
        "writable": true,
        "configurable": true,
        "value": function(value, row, col) {
            if(col === undefined)
                col = 0;
            this.data[row + this.rows * col] = value;
        }
    },
    "sameDims": {
        "writable": true,
        "configurable": true,
        "value": function(other) {
            return this.rows == other.rows && this.cols == other.cols;
        }
    },
    "inverse": {
        "get": function () {
            var ans = this.copy();
            for(var i = 0; i < this.rows; i++)
                for(var j = 0; j < this.cols; j++)
                    ans.set(-this.get(i, j), i, j);
            return ans;
        }
    },
    "add": {
        "configurable": true,
        "writable": true,
        "value": function(other) {
            if(this.sameDims(other)) {
                var ans = this.copy();
                for(var i = 0; i < this.rows; i++)
                    for(var j = 0; j < this.cols; j++)
                        ans.set(this.get(i, j) + other.get(i, j), i, j);
                return ans;
            } else {
                /* Mostly for debug, shouldn't happen in production */
                alert("Matrix addition dimensional mismatch");
                return null;
            }
        }
    },
    "subtract": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            return this.add(that.inverse);
        }
    },
    "multiply": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            if(this.cols == that.rows) {
                var ans = Mat.create(this.rows, that.cols);
                for(var i = 0; i < this.rows; i++)
                    for(var j = 0; j < that.cols; j++) {
                        var sum = 0;
                        for(var k = 0; k < this.cols; k++)
                            sum += this.get(i, k) * that.get(k, j);
                        ans.set(sum, i, j);
                    }
                return ans;
            } else {
                alert("Matrix multiplication dimensional mismatch");
                return null;
            }
        }
    },
    "scalarMultiply": {
        "configurable": true,
        "writable": true,
        "value": function(v) {
            var ans = this.copy();
            for(var i = 0; i < this.rows; i++)
                for(var j = 0; j < this.cols; j++)
                    ans.set(this.get(i, j) * v, i, j);
            return ans;
        }
    },
    "scalarDivide": {
        "configurable": true,
        "writable": true,
        "value": function(v) {
            return this.scalarMultiply(1 / v);
        }
    },
    "elementMultiply": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            var ans = this.copy();
            for(var i = 0; i < this.rows; i++)
                for(var j = 0; j < this.cols; j++)
                    ans.set(this.get(i, j) * that.get(i, j), i, j);
            return ans;
        }
    },
    "elementDivide": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            var ans = this.copy();
            for(var i = 0; i < this.rows; i++)
                for(var j = 0; j < this.cols; j++)
                    ans.set(this.get(i, j) / that.get(i, j), i, j);
            return ans;
        }
    },
    "equals": {
        "configurable": true,
        "writable": true,
        "value": function(that, e) {
            if(e === undefined)
                e = 1e-10;
            for(var i = 0; i < this.rows; i++)
                for(var j = 0; j < this.cols; j++)
                    if(Math.abs(this.get(i, j) - that.get(i, j)) > e) {
                         console.log("slot: " + i + ", " + j);
                         console.log("this: " + this.get(i, j));
                         console.log("that: " + that.get(i, j));
                         return false;
                    }
            return true;
        }
    },
    "toString": {
        "configurable": true,
        "writable": true,
        "value": function() {
            var str = "[";
            for(var i = 0; i < this.rows; i++) {
                str += "[";
                for(var j = 0; j < this.cols; j++) {
                    str += this.get(i, j);
                    if(j + 1 < this.cols)
                        str += ", ";
                }
                str += "]";
                if(i + 1 < this.rows)
                    str += "\n";
            }
            str += "]";
            return str;
        }
    }
});

Vector = Object.create(Mat, {
    "init": {
        "configurable": true,
        "writable": true,
        "value": function(size) {
            Mat.init.call(this, size, 1);
        }
    },
    "x": {
        "configurable": true,
        "get": function() {
            return this.get(0);
        },
        "set": function(value) {
            this.set(value, 0);
        }
    },
    "y": {
        "configurable": true,
        "get": function() {
            return this.get(1);
        },
        "set": function(value) {
            this.set(value, 1);
        }
    },
    "z": {
        "configurable": true,
        "get": function() {
            return this.get(2);
        },
        "set": function(value) {
            this.set(value, 2);
        }
    },
    "w": {
        "configurable": true,
        "get": function() {
            return this.get(3);
        },
        "set": function(value) {
            this.set(value, 3);
        }
    },
    "add": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            var ans = this.copy();
            if(this.sameDims(that)) {
                for(var i = 0; i < this.rows; i++)
                    ans.set(this.get(i) + that.get(i), i);
                return ans;
            } else {
                alert("add, Dimensional mismatch");
                return null;
            }
        }
    },
    "radiusSq": {
        "configurable": true,
        "get": function() {
            return this.dot(this);
        }
    },
    "radius": {
        "configurable": true,
        "get": function() {
            return Math.sqrt(this.radiusSq);
        }
    },
    "dot": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            if(this.sameDims(that)) {
                var ans = 0;
                for(var i = 0; i < this.rows; i++)
                    ans += this.get(i) * that.get(i);
                return ans;
            } else {
                alert("Vector dot product dimension mismatch");
                return null;
            }
        }
    },
    "distance": {
        "configurable": true,
        "writable": true,
        "value": function(v) {
            return this.subtract(v).radius;
        }
    },
    "normal": {
        "configurable": true,
        "get": function() {
            return this.scalarDivide(this.radius);
        }
    }
});

Vector2 = Object.create(Vector, {
    "init": {
        "configurable": true,
        "writable": true,
        "value": function(x, y) {
            Vector.init.call(this, 2);
            this.x = x;
            this.y = y;
        }
    },
    "angle": {
        "configurable": true,
        "get": function() {
            return Math.atan2(this.y, this.x);
        }
    },
    "addX": {
        "configurable": true,
        "value": function(v) {
            return Vector2.create(this.x + v, this.y);
        }
    },
    "addY": {
        "configurable": true,
        "value": function(v) {
            return Vector2.create(this.x, this.y + v);
        }
    },
    "rotate": {
        "configurable": true,
        "value": function(angle) {
            return PolarVector2.create(this.angle + angle, this.radius);
        }
    },
    "wrap": {
        "configurable": true,
        "value": function(wrapped) {
            if("x" in wrapped && "y" in wrapped) {
                return WrapVector.create(wrapped);
            } else if("angle" in wrapped && "radius" in wrapped) {
                return WrapPolarVector2.create(wrapped);
            } else {
                throw "Failed to wrap object: " + wrapped;
            }
        }
    }
});

// Supports getting and setting in both a polar and xy style
// More efficient for xy style

// Methods defined in terms of the other functions

// For compiler efficiency reasons, doing it this way is better.
PolarVector2 = Object.create(Vector2, {
    "init": {
        "configurable": true,
        "writable": true,
        "value": function(angle, radius) {
            this.polarData = [angle, radius];
            Vector2.init.call(
                this,
                radius * Math.cos(angle),
                radius * Math.sin(angle));
        }
    },
    "copy": {
        "configurable": true,
        "writable": true,
        "value": function() {
            var created = Object.create(this);
            created.polarData = [this.angle, this.radius];
            return created;
        }
    },
    "get": {
        "configurable": true,
        "value": function(row) {
            switch(row) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            }
        }
    },
    "set": {
        "configurable": true,
        "value": function(value, row) {
            switch(row) {
            case 0:
                this.x = value;
            case 1:
                this.y = value;
            }
        }
    },
    "add": {
        "configurable": true,
        "writable": true,
        "value": function(that) {
            return Vector2.create(this.x + that.get(0), this.y + that.get(1));
        }
    },
    "angle": {
        "configurable": true,
        "get": function() {
            return this.polarData[0];
        },
        "set": function(value) {
            this.polarData[0] = value;
        }
    },
    "radius": {
        "configurable": true,
        "get": function() {
            return this.polarData[1];
        },
        "set": function(value) {
            this.polarData[1] = value;
        }
    },
    "x": {
        "configurable": true,
        "get": function() {
            return Math.cos(this.angle) * this.radius;
        },
        "set": function(value) {
            /* Retain the y-position */
            var basis = Vector2.create(value, this.y);
            this.angle = basis.angle;
            this.radius = basis.radius;
        }
    },
    "y": {
        "configurable": true,
        "get": function() {
            return Math.sin(this.angle) * this.radius;
        },
        "set": function(value) {
            /* Retain the y-position */
            var basis = Vector2.create(this.x, value);
            this.angle = basis.angle;
            this.radius = basis.radius;
        }
    },
    "radiusSq": {
        "configurable": true,
        "get": function() {
            return this.radius * this.radius;
        }
    },
    "scalarMultiply": {
        "configurable": true,
        "writable": true,
        "value": function(v) {
            var created = this.copy();
            created.radius = this.radius * v;
            return created;
        }
    },
    "toString": {
        "configurable": true,
        "value": function() {
            return "PolarVector2<angle: = " + this.angle + ", radius = " + this.radius + ">";
        }
    }
});
// More efficient for radius-angle vectors

// Not really recommended since stupid things can potentially happen here
WrapVector2 = Object.create(Vector2, {
    "init": {
        "configurable": true,
        "writable": true,
        "value": function(wrapped) {
            this.wrapped = wrapped;
        }
    },
    "x": {
        "configurable": true,
        "get": function() {
            return this.wrapped.x;
        },
        "set": function(value) {
            this.wrapped.x = value;
        }
    },
    "y": {
        "get": function() {
            return this.wrapped.y;
        },
        "set": function(value) {
            this.wrapped.y = value;
        }
    }
});

WrapPolarVector2 = Object.create(PolarVector2, {
    "init": {
        "configurable": true,
        "writable": true,
        "value": function(wrapped) {
            PolarVector2.init.call(this, wrapped.angle, wrapped.radius);
            this.wrapped = wrapped;
        }
    },
    "radius": {
        "configurable": true,
        "get": function() {
            return this.wrapped.radius;
        }
    },
    "angle": {
        "configurable": true,
        "get": function() {
            return this.wrapped.angle;
        }
    }
});

function test_vectors() {
    function test_identity(v, i, n) {
        var e = 1e-10;
        if(!v.equals(i))
            alert(n + ".equals fails");
        if(Math.abs(v.x - i.x) > e || Math.abs(v.y - i.y) > e)
            alert(n + ".x or .y fails: " + v.x + ", " + v.y());
        if(v.radius != i.radius)
            alert(n + ".radius fails: " + v.radius);
        if(v.radiusSq != i.radiusSq)
            alert(n + ".radiusSq fails: " + v.radiusSq);
        if(Math.abs(v.angle - i.angle) > e)
            alert(n + ".angle fails: " + v.angle + "; diff: " + (v.angle - i.angle));
        if(!v.addX(1).equals(i.addX(1)))
            alert(n + ".addX fails: " + v.addX(1));
        if(!v.addY(1).equals(i.addY(1)))
            alert(n + ".addY fails: " + v.addY(1));
        if(!v.add(Vector2.create(1, 1)).equals(i.add(Vector2.create(1, 1))))
            alert(n + ".add fails: " + v.add(Vector2.create(1, 1)));
        if(!v.subtract(Vector2.create(1, 1)).equals(Vector2.create(2, 3)))
            alert(n + ".subtract fails: " + v.subtract(Vector2.create(1, 1)));
        if(!v.elementMultiply(Vector2.create(2, 3)).equals(Vector2.create(6, 12)))
            alert(n + ".elementMultiply fails: " + v.elementMultiply(Vector2.create(2, 3)));
        if(!v.elementDivide(Vector2.create(3, 4)).equals(Vector2.create(1, 1)))
            alert(n + ".elementDivide fails: " + v.elementDivide(Vector2.create(3, 4)));
        if(!v.scalarMultiply(2).equals(Vector2.create(6, 8)))
            alert(n + ".scalarMultiply fails: " + v.scalarMultiply(2));
        if(!v.scalarDivide(2).equals(Vector2.create(1.5, 2)))
            alert(n + ".scalarDivide fails: " + v.scalarDivide(2));
        if(!v.inverse.equals(Vector2.create(-3, -4)))
            alert(n + ".inverse fails: " + v.inverse);
        if(!v.rotate(Math.PI / 2).equals(Vector2.create(-4, 3)))
            alert(n + ".rotate fails: " + v.rotate(Math.PI / 2).x + ", " + v.rotate(Math.PI / 2).y());
        if(!v.normal.equals(Vector2.create(0.6, 0.8)))
            alert(n + ".normal fails: " + v.normal.x + ", " + v.normal.y());
        if(v.dot(Vector2.create(2, 3)) != 18)
            alert(n + ".dot fails: " + v.dot(Vector2.create(2, 3)));
        if(v.distance(Vector2.create(0, 0)) != 5)
            alert(n + ".distance fails: " + v.distance(Vector2.create(0, 0)));
    }
    var i = Object.create(null);
    i.x = 3;
    i.y = 4;
    i.angle = Math.atan2(4, 3);
    i.radius = 5;
    i.radiusSq = 25;
    i.addX = function(v) { return Vector2.create(3 + v, this.y); };
    i.addY = function(v) { return Vector2.create(3, 4 + v); };
    i.add = function(v) { return Vector2.create(3 + v.x, 4 + v.y); };
    i.elementMultiply = function(v) { return Vector2.create(3 * v.x, 4 * v.y); };
    i.divide = function(v) { return Vector2.create(3 / v.x, 4 / v.y); };
    i.scalarMultiply = function(v) { return Vector2.create(3 * v, 4 * v); };
    i.scalarDivide = function(v) { return Vector2.create(3 / v, 4 / v); };
    i.inverse = function(v) { return Vector2.create(-3, -4); };
    i.rotate = function(v) { return Vector2.create(3 * Math.cos(v) - 4 * Math.sin(v), Math.cos(v) * 4 + 3 * Math.sin(v)); };
    i.normalize = function(v) { return Vector2.create(3 / 5, 4 / 5); };
    i.dot = function(v) { return 3 * v.x + 4 * v.y; };
    i.distance = function(v) { return Math.sqrt((3 - v.x) * (3 - v.x) + (4 - v.y) * (4 - v.y)); };
    i.get = function(row, col) {
        if(row == 0)
            return this.x;
        else
            return this.y;
    }

    try {
        test_identity(Vector2.create(3, 4), i, "Vector2");
        test_identity(PolarVector2.create(Math.atan2(4, 3), 5), i, "PolarVector2");
/*
        test_identity(Vector2.wrap({"x": 3, "y": 4}), i, "WrapVector2");
        test_identity(Vector2.wrap({"angle": Math.atan2(4, 3), "radius": 5}), i, "WrapPolarVector2");
*/
    } catch(e) {
        alert("Error while testing: " + e);
    }
}

test_vectors();

