"use strict";
var match = require("./match");

var div = typeof document !== "undefined" && document.createElement("div");

function isDOMNode(obj) {
    var success = false;

    try {
        obj.appendChild(div);
        success = div.parentNode == obj;
    } catch (e) {
        return false;
    } finally {
        try {
            obj.removeChild(div);
        } catch (e) {
            // Remove failed, not much we can do about that
        }
    }

    return success;
}

function isReallyNaN(val) {
    return typeof val === "number" && isNaN(val);
}

function isElement(obj) {
    return div && obj && obj.nodeType === 1 && isDOMNode(obj);
}

module.exports = function deepEqual(a, b) {
    if (match.isMatcher(a)) {
        return a.test(b);
    }

    if (typeof a !== "object" || typeof b !== "object") {
        if (isReallyNaN(a) && isReallyNaN(b)) {
            return true;
        }
        return a === b;
    }

    if (isElement(a) || isElement(b)) {
        return a === b;
    }

    if (a === b) {
        return true;
    }

    if ((a === null && b !== null) || (a !== null && b === null)) {
        return false;
    }

    if (a instanceof RegExp && b instanceof RegExp) {
        return (a.source === b.source) && (a.global === b.global) &&
            (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);
    }

    var aString = Object.prototype.toString.call(a);
    if (aString !== Object.prototype.toString.call(b)) {
        return false;
    }

    if (aString === "[object Date]") {
        return a.valueOf() === b.valueOf();
    }

    var prop, aLength = 0, bLength = 0;

    if (aString == "[object Array]" && a.length !== b.length) {
        return false;
    }

    for (prop in a) {
        aLength += 1;

        if (!(prop in b)) {
            return false;
        }

        if (!deepEqual(a[prop], b[prop])) {
            return false;
        }
    }

    for (prop in b) {
        bLength += 1;
    }

    return aLength == bLength;
};
