"use strict";

var valueToString = require("./util/core/value-to-string");
var hasOwnProperty = Object.prototype.hasOwnProperty;

function stubNonFunctionProperty(object, property, value) {
    var original = object[property];

    if (!hasOwnProperty.call(object, property)) {
        throw new TypeError("Cannot stub non-existent own property " + valueToString(property));
    }

    object[property] = value;

    return {
        restore: function restore() {
            object[property] = original;
        }
    };
}

module.exports = stubNonFunctionProperty;
