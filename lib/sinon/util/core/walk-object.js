"use strict";

var valueToString = require("@sinonjs/commons").valueToString;

var getPropertyDescriptor = require("./get-property-descriptor");
var walk = require("./walk");

var reFunctionName = /^function\s*([^\s(]+)/;

function walkObject(predicate, object, filter) {
    var called = false;
    // IE11 doesn't support fn.name
    var name = predicate.name || (valueToString(predicate).match(reFunctionName) || [null, ""])[1];

    if (!object) {
        throw new Error("Trying to " + name + " object but received " + String(object));
    }

    walk(object, function(prop, propOwner) {
        // we don't want to stub things like toString(), valueOf(), etc. so we only stub if the object
        // is not Object.prototype
        if (
            propOwner !== Object.prototype &&
            prop !== "constructor" &&
            typeof getPropertyDescriptor(propOwner, prop).value === "function"
        ) {
            if (filter) {
                if (filter(object, prop)) {
                    called = true;
                    predicate(object, prop);
                }
            } else {
                called = true;
                predicate(object, prop);
            }
        }
    });

    if (!called) {
        throw new Error("Expected to " + name + " methods on object but found none");
    }

    return object;
}

module.exports = walkObject;
