"use strict";

var arrayProto = require("@sinonjs/commons").prototypes.array;
var toString = require("@sinonjs/commons").prototypes.object.toString;
var samsam = require("@sinonjs/samsam");

var every = arrayProto.every;
var join = arrayProto.join;
var sort = arrayProto.sort;

function isReallyNaN(val) {
    return val !== val;
}

var deepEqual = module.exports = function deepEqual(a, b, matcher) {
    if (a === null && b === null) {
        return true;
    }

    if (typeof a !== "object" || typeof b !== "object") {
        return isReallyNaN(a) && isReallyNaN(b) || a === b;
    }

    if (a instanceof Error && b instanceof Error) {
        return a === b;
    }

    if (toString(a) !== toString(b)) {
        return false;
    }

    if (join(sort(Object.keys(a))) !== join(sort(Object.keys(b)))) {
        return false;
    }

    if (samsam.deepEqual(a, b)) {
        return true;
    }

    if (matcher) {
        var keys = Object.keys(a);
        var allKeysMatch = every(keys, function (key) {
            return matcher(a[key], b[key]);
        });

        return keys.length > 0 && allKeysMatch;
    }

    return false;
};

deepEqual.use = function (match) {
    return function deepEqual$matcher(a, b) {
        // If both are matchers they must be the same instance in order to be considered equal
        // If we didn't do that we would end up running one matcher against the other
        if (match.isMatcher(a)) {
            if (match.isMatcher(b)) {
                return a === b;
            }
            return a.test(b);
        }


        return deepEqual(a, b, deepEqual$matcher);
    };
};
