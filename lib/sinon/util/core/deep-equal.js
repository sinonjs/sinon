"use strict";

var samsam = require("@sinonjs/samsam");

function isReallyNaN(val) {
    return val !== val;
}

var deepEqual = module.exports = function deepEqual(a, b) {
    if (typeof a !== "object" || typeof b !== "object") {
        return isReallyNaN(a) && isReallyNaN(b) || a === b;
    }

    if (a instanceof Error && b instanceof Error) {
        return a === b;
    }

    var aString = Object.prototype.toString.call(a);
    if (aString !== Object.prototype.toString.call(b)) {
        return false;
    }

    var matcher = arguments[2];
    if (!matcher) {
        return samsam.deepEqual(a, b);
    }

    var prop;
    var aLength = 0;
    var bLength = 0;

    for (prop in a) {
        if (Object.prototype.hasOwnProperty.call(a, prop)) {
            aLength += 1;

            if (!(prop in b)) {
                return false;
            }

            // allow alternative function for recursion
            if (!(matcher || deepEqual)(a[prop], b[prop])) {
                return false;
            }
        }
    }

    for (prop in b) {
        if (Object.prototype.hasOwnProperty.call(b, prop)) {
            bLength += 1;
        }
    }

    return aLength === bLength;
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
