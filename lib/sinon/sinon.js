/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global require, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var div = typeof document != "undefined" && document.createElement("div");
var hasOwn = Object.prototype.hasOwnProperty;

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

function isElement(obj) {
    return div && obj && obj.nodeType === 1 && isDOMNode(obj);
}

function isFunction(obj) {
    return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
}

function mirrorProperties(target, source) {
    for (var prop in source) {
        if (!hasOwn.call(target, prop)) {
            target[prop] = source[prop];
        }
    }
}

exports.wrapMethod = function wrapMethod(object, property, method) {
        if (!object) {
            throw new TypeError("Should wrap property of object");
        }

        if (typeof method != "function") {
            throw new TypeError("Method wrapper should be function");
        }

        var wrappedMethod = object[property],
            error;

        if (!isFunction(wrappedMethod)) {
            error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                property + " as function");
        }

        if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
            error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
        }

        if (wrappedMethod.calledBefore) {
            var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
            error = new TypeError("Attempted to wrap " + property + " which is already " + verb);
        }

        if (error) {
            if (wrappedMethod._stack) {
                error.stack += '\n--------------\n' + wrappedMethod._stack;
            }
            throw error;
        }

        // IE 8 does not support hasOwnProperty on the window object.
        var owned = hasOwn.call(object, property);
        object[property] = method;
        method.displayName = property;
        // Set up a stack trace which can be used later to find what line of
        // code the original method was created on.
        method._stack = (new Error('Stack Trace for original')).stack;

        method.restore = function () {
            // For prototype properties try to reset by delete first.
            // If this fails (ex: localStorage on mobile safari) then force a reset
            // via direct assignment.
            if (!owned) {
                delete object[property];
            }
            if (object[property] === method) {
                object[property] = wrappedMethod;
            }
        };

        method.restore.sinon = true;
        mirrorProperties(method, wrappedMethod);

        return method;
    };

exports.extend = function extend(target) {
    for (var i = 1, l = arguments.length; i < l; i += 1) {
        for (var prop in arguments[i]) {
            if (arguments[i].hasOwnProperty(prop)) {
                target[prop] = arguments[i][prop];
            }

            // DONT ENUM bug, only care about toString
            if (arguments[i].hasOwnProperty("toString") &&
                arguments[i].toString != target.toString) {
                target.toString = arguments[i].toString;
            }
        }
    }

    return target;
};

exports.create = function create(proto) {
    var F = function () {};
    F.prototype = proto;
    return new F();
};

// The "isMatcher" function needs to be injected from the matcher to avoid a
// circular dependency.
var isMatcher;
exports.injectIsMatcher = function (fn) {
    isMatcher = fn;
};

exports.deepEqual = function deepEqual(a, b) {
    if (isMatcher && isMatcher(a)) {
        return a.test(b);
    }
    if (typeof a != "object" || typeof b != "object") {
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

    var aString = Object.prototype.toString.call(a);
    if (aString != Object.prototype.toString.call(b)) {
        return false;
    }

    if (aString == "[object Date]") {
        return a.valueOf() === b.valueOf();
    }

    var prop, aLength = 0, bLength = 0;

    if (aString == "[object Array]" && a.length !== b.length) {
        return false;
    }

    for (prop in a) {
        aLength += 1;

        if (!deepEqual(a[prop], b[prop])) {
            return false;
        }
    }

    for (prop in b) {
        bLength += 1;
    }

    return aLength == bLength;
};

exports.functionName = function functionName(func) {
    var name = func.displayName || func.name;

    // Use function decomposition as a last resort to get function
    // name. Does not rely on function decomposition to work - if it
    // doesn't debugging will be slightly less informative
    // (i.e. toString will say 'spy' rather than 'myFunc').
    if (!name) {
        var matches = func.toString().match(/function ([^\s\(]+)/);
        name = matches && matches[1];
    }

    return name;
};

exports.functionToString = function toString() {
    if (this.getCall && this.callCount) {
        var thisValue, prop, i = this.callCount;

        while (i--) {
            thisValue = this.getCall(i).thisValue;

            for (prop in thisValue) {
                if (thisValue[prop] === this) {
                    return prop;
                }
            }
        }
    }

    return this.displayName || "sinon fake";
};

exports.getConfig = function (custom) {
    var config = {};
    custom = custom || {};
    var defaults = exports.defaultConfig;

    for (var prop in defaults) {
        if (defaults.hasOwnProperty(prop)) {
            config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
        }
    }

    return config;
};

exports.format = function (val) {
    return "" + val;
};

exports.defaultConfig = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
};

exports.timesInWords = function timesInWords(count) {
    return count == 1 && "once" ||
        count == 2 && "twice" ||
        count == 3 && "thrice" ||
        (count || 0) + " times";
};

exports.calledInOrder = function (spies) {
    for (var i = 1, l = spies.length; i < l; i++) {
        if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
            return false;
        }
    }

    return true;
};

exports.orderByFirstCall = function (spies) {
    return spies.sort(function (a, b) {
        // uuid, won't ever be equal
        var aCall = a.getCall(0);
        var bCall = b.getCall(0);
        var aId = aCall && aCall.callId || -1;
        var bId = bCall && bCall.callId || -1;

        return aId < bId ? -1 : 1;
    });
};

exports.log = function () {};

exports.logError = function (label, err) {
    var msg = label + " threw exception: "
    sinon.log(msg + "[" + err.name + "] " + err.message);
    if (err.stack) { sinon.log(err.stack); }

    setTimeout(function () {
        err.message = msg + err.message;
        throw err;
    }, 0);
};

exports.typeOf = function (value) {
    if (value === null) {
        return "null";
    }
    else if (value === undefined) {
        return "undefined";
    }
    var string = Object.prototype.toString.call(value);
    return string.substring(8, string.length - 1).toLowerCase();
};

/*
var busterFormat = require("buster-format");
var formatter = sinon.create(busterFormat);
formatter.quoteStrings = false;
exports.format = function () {
    return formatter.ascii.apply(formatter, arguments);
};
*/
var util = require("util");
exports.format = function (value) {
    return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
};

