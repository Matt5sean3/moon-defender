"use strict";
// Does vector mathematics

// These are meant to be essentially immutable objects
// With a weak compiler this could be inefficient memory-wise
// With a good compiler this can be very lean

// The main point here is that there are no side-effects
// This makes reasoning about the code much-much easier
// Whereas Victor.js was ALL side-effects

var Vector;
var PolarVector;
var WrapVector;
var WrapPolarVector;

// Supports getting and setting in both a polar and xy style
// More efficient for xy style
Vector = Object.create(null);
Vector.create = function(x, y) {
    var created = Object.create(Vector);
    created.data =  new Float64Array(2);
    created.data[0] = x;
    created.data[1] = y;
    return created;
};
Vector.data = new Float64Array(2);
// Methods that must be defined in a subclass
Vector.x = function() {
    return this.data[0];
};
Vector.y = function() {
    return this.data[1];
};
Vector.radius = function() {
    return Math.sqrt(this.radiusSq());
};
Vector.radiusSq = function() {
    return this.x() * this.x() + this.y() * this.y();
};
Vector.angle = function() {
    return Math.atan2(this.y(), this.x());
};
// Methods defined in terms of the other functions
Vector.add = function(v) {
    return Vector.create(this.x() + v.x(), this.y() + v.y());
};
Vector.addX = function(v) {
    return Vector.create(this.x() + v, this.y());
};
Vector.addY = function(v) {
    return Vector.create(this.x(), this.y() + v);
};
Vector.subtract = function(v) {
    return Vector.create(this.x() - v.x(), this.y() - v.y());
};
Vector.multiply = function(v) {
    return Vector.create(this.x() * v.x(), this.y() * v.y());
};
Vector.divide = function(v) {
    return Vector.create(this.x() / v.x(), this.y() / v.y());
};
Vector.scalarMultiply = function(v) {
    return Vector.create(this.x() * v, this.y() * v);
};
Vector.scalarDivide = function(v) {
    return Vector.create(this.x() / v, this.y() / v);
};
Vector.invert = function() {
    return Vector.create(-this.x(), -this.y());
};
Vector.rotate = function(angle) {
    return PolarVector.create(this.angle() + angle, this.radius());
};
Vector.normalize = function() {
    return PolarVector.create(this.angle(), 1);
};
Vector.dot = function(v) {
    return this.x() * v.x() + this.y() * v.y();
};
Vector.distance = function(v) {
    return this.subtract(v).radius();
};
Vector.equals = function(v, e) {
    if(e === undefined)
        e = 1e-10;
    return Math.abs(this.x() - v.x()) < e && Math.abs(this.y() - v.y()) < e;
};
Vector.toString = function() {
    return "Vector<" + this.x() + ", " + this.y() + ">";
};
Vector.wrap = function(wrapped) {
    if("x" in wrapped && "y" in wrapped) {
        return WrapVector.create(wrapped);
    } else if("angle" in wrapped && "radius" in wrapped) {
        return WrapPolarVector.create(wrapped);
    } else {
        throw "Failed to wrap object: " + wrapped;
    }
};

// For compiler efficiency reasons, doing it this way is better.
PolarVector = Object.create(Vector);
// More efficient for radius-angle vectors
PolarVector.create = function(angle, radius) {
    var created = Object.create(this);
    created.data = new Float64Array(2);
    created.data[0] = angle;
    created.data[1] = radius;
    return created;
};
PolarVector.angle = function() {
    return this.data[0];
};
PolarVector.radius = function() {
    return this.data[1];
};
PolarVector.x = function() {
    return this.radius() * Math.cos(this.angle());
};
PolarVector.y = function() {
    return this.radius() * Math.sin(this.angle());
};
// A few faster implementations
PolarVector.radiusSq = function() {
    return this.radius() * this.radius();
};
PolarVector.scalarMultiply = function(v) {
    return PolarVector.create(this.angle(), this.radius() * v);
};
PolarVector.scalarDivide = function(v) {
    return PolarVector.create(this.angle(), this.radius() / v);
};
// An implementation for debug purposes
PolarVector.toString = function() {
    return "PolarVector<angle: = " + this.angle() + ", radius = " + this.radius() + ">";
};

// Not really recommended since stupid things can potentially happen here
WrapVector = Object.create(Vector);

WrapVector.create = function(wrapped) {
    var created = Object.create(this);
    this.wrapped = wrapped;
    return created;
};

WrapVector.x = function() {
    return this.wrapped.x;
};

WrapVector.y = function() {
    return this.wrapped.y;
};

WrapPolarVector = Object.create(PolarVector);
WrapPolarVector.create = function(wrapped) {
    var created = Object.create(this);
    created.wrapped = wrapped;
    return created;
};
WrapPolarVector.radius = function() {
    return this.wrapped.radius;
};
WrapPolarVector.angle = function() {
    return this.wrapped.angle;
};

function test_vectors() {
    function test_identity(v, i, n) {
        var e = 1e-10;
        if(!v.equals(i))
            alert(n + ".equals fails");
        if(Math.abs(v.x() - i.x()) > e || Math.abs(v.y() - i.y()) > e)
            alert(n + ".x or .y fails: " + v.x() + ", " + v.y());
        if(v.radius() != i.radius())
            alert(n + ".radius fails: " + v.radius());
        if(v.radiusSq() != i.radiusSq())
            alert(n + ".radiusSq fails: " + v.radiusSq());
        if(v.angle() != i.angle())
            alert(n + ".angle fails: " + v.angle());
        if(!v.addX(1).equals(i.addX(1)))
            alert(n + ".addX fails: " + v.addX(1));
        if(!v.addY(1).equals(i.addY(1)))
            alert(n + ".addY fails: " + v.addY(1));
        if(!v.add(Vector.create(1, 1)).equals(i.add(Vector.create(1, 1))))
            alert(n + ".add fails: " + v.add(Vector.create(1, 1)));
        if(!v.subtract(Vector.create(1, 1)).equals(Vector.create(2, 3)))
            alert(n + ".subtract fails: " + v.subtract(Vector.create(1, 1)));
        if(!v.multiply(Vector.create(2, 3)).equals(Vector.create(6, 12)))
            alert(n + ".multiply fails: " + v.multiply(Vector.create(2, 3)));
        if(!v.divide(Vector.create(3, 4)).equals(Vector.create(1, 1)))
            alert(n + ".divide fails: " + v.divide(Vector.create(3, 4)));
        if(!v.scalarMultiply(2).equals(Vector.create(6, 8)))
            alert(n + ".scalarMultiply fails: " + v.scalarMultiply(2));
        if(!v.scalarDivide(2).equals(Vector.create(1.5, 2)))
            alert(n + ".scalarDivide fails: " + v.scalarDivide(2));
        if(!v.invert().equals(Vector.create(-3, -4)))
            alert(n + ".invert fails: " + v.invert());
        if(!v.rotate(Math.PI / 2).equals(Vector.create(-4, 3)))
            alert(n + ".rotate fails: " + v.rotate(Math.PI / 2).x() + ", " + v.rotate(Math.PI / 2).y());
        if(!v.normalize().equals(Vector.create(0.6, 0.8)))
            alert(n + ".normalize fails: " + v.normalize().x() + ", " + v.normalize().y());
        if(v.dot(Vector.create(2, 3)) != 18)
            alert(n + ".dot fails: " + v.dot(Vector.create(2, 3)));
        if(v.distance(Vector.create(0, 0)) != 5)
            alert(n + ".distance fails: " + v.distance(Vector.create(0, 0)));
    }
    var i = Object.create(null);
    i.x = function() { return 3; };
    i.y = function() { return 4; };
    i.angle = function() { return Math.atan2(4, 3); };
    i.radius = function() { return 5; };
    i.radiusSq = function() { return 25; };
    i.addX = function(v) { return Vector.create(3 + v, this.y()); };
    i.addY = function(v) { return Vector.create(3, 4 + v); };
    i.add = function(v) { return Vector.create(3 + v.x(), 4 + v.y()); };
    i.multiply = function(v) { return Vector.create(3 * v.x(), 4 * v.y()); };
    i.divide = function(v) { return Vector.create(3 / v.x(), 4 / v.y()); };
    i.scalarMultiply = function(v) { return Vector.create(3 * v, 4 * v); };
    i.scalarDivide = function(v) { return Vector.create(3 / v, 4 / v); };
    i.invert = function(v) { return Vector.create(-3, -4); };
    i.rotate = function(v) { return Vector.create(3 * Math.cos(v) - 4 * Math.sin(v), Math.cos(v) * 4 + 3 * Math.sin(v)); };
    i.normalize = function(v) { return Vector.create(3 / 5, 4 / 5); };
    i.dot = function(v) { return 3 * v.x() + 4 * v.y(); };
    i.distance = function(v) { return Math.sqrt((3 - v.x()) * (3 - v.x()) + (4 - v.y()) * (4 - v.y())); };

    try {
        test_identity(Vector.create(3, 4), i, "Vector");
        test_identity(PolarVector.create(Math.atan2(4, 3), 5), i, "PolarVector");
        test_identity(Vector.wrap({"x": 3, "y": 4}), i, "WrapVector");
        test_identity(Vector.wrap({"angle": Math.atan2(4, 3), "radius": 5}), i, "WrapPolarVector");
    } catch(e) {
        alert("Error while testing: " + e);
    }
}

test_vectors();

