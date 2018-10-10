"use strict";

var arrayProto = require("@sinonjs/commons").prototypes.array;
var hasOwnProperty = require("@sinonjs/commons").prototypes.object.hasOwnProperty;

var join = arrayProto.join;
var push = arrayProto.push;
var slice = arrayProto.slice;

// Adapted from https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
var hasDontEnumBug = (function() {
    var obj = {
        constructor: function() {
            return "0";
        },
        toString: function() {
            return "1";
        },
        valueOf: function() {
            return "2";
        },
        toLocaleString: function() {
            return "3";
        },
        prototype: function() {
            return "4";
        },
        isPrototypeOf: function() {
            return "5";
        },
        propertyIsEnumerable: function() {
            return "6";
        },
        hasOwnProperty: function() {
            return "7";
        },
        length: function() {
            return "8";
        },
        unique: function() {
            return "9";
        }
    };

    var result = [];
    for (var prop in obj) {
        if (hasOwnProperty(obj, prop)) {
            push(result, obj[prop]());
        }
    }
    return join(result, "") !== "0123456789";
})();

/* Public: Extend target in place with all (own) properties from sources in-order. Thus, last source will
 *         override properties in previous sources.
 *
 * target - The Object to extend
 * sources - Objects to copy properties from.
 *
 * Returns the extended target
 */
module.exports = function extend(target /*, sources */) {
    var sources = slice(arguments, 1);
    var source, i, prop;

    for (i = 0; i < sources.length; i++) {
        source = sources[i];

        for (prop in source) {
            if (hasOwnProperty(source, prop)) {
                target[prop] = source[prop];
            }
        }

        // Make sure we copy (own) toString method even when in JScript with DontEnum bug
        // See https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
        if (hasDontEnumBug && hasOwnProperty(source, "toString") && source.toString !== target.toString) {
            target.toString = source.toString;
        }
    }

    return target;
};
