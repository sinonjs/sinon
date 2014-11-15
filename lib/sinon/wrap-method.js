"use strict";
var hasOwn = Object.prototype.hasOwnProperty;

function mirrorProperties(target, source) {
    for (var prop in source) {
        if (!hasOwn.call(target, prop)) {
            target[prop] = source[prop];
        }
    }
}

function isFunction(obj) {
    return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
}

module.exports = function wrapMethod(object, property, method) {
    if (!object) {
        throw new TypeError("Should wrap property of object");
    }

    if (typeof method !== "function") {
        throw new TypeError("Method wrapper should be function");
    }

    var wrappedMethod = object[property],
        error;

    if (!isFunction(wrappedMethod)) {
        error = new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                              property + " as function");
    } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
        error = new TypeError("Attempted to wrap " + property + " which is already wrapped");
    } else if (wrappedMethod.calledBefore) {
        var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
        error = new TypeError("Attempted to wrap " + property + " which is already " + verb);
    }

    if (error) {
        if (wrappedMethod && wrappedMethod.stackTrace) {
            error.stack += "\n--------------\n" + wrappedMethod.stackTrace;
        }
        throw error;
    }

    // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem
    // when using hasOwn.call on objects from other frames.
    var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);
    object[property] = method;
    method.displayName = property;
    // Set up a stack trace which can be used later to find what line of
    // code the original method was created on.
    method.stackTrace = (new Error("Stack Trace for original")).stack;

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
