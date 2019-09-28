"use strict";

var getPropertyDescriptor = require("./get-property-descriptor");
var walk = require("./walk");

function walkObject(predicate, object) {
    var called = false;

    if (!object) {
        throw new Error("Trying to " + predicate.name + " object but received " + String(object));
    }

    walk(object, function(prop, propOwner) {
        // we don't want to stub things like toString(), valueOf(), etc. so we only stub if the object
        // is not Object.prototype
        if (
            propOwner !== Object.prototype &&
            prop !== "constructor" &&
            typeof getPropertyDescriptor(propOwner, prop).value === "function"
        ) {
            called = true;
            predicate(object, prop);
        }
    });

    if (!called) {
        throw new Error("Expected to " + predicate.name + " methods on object but found none");
    }

    return object;
}

module.exports = walkObject;
