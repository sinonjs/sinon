"use strict";

var slice = [].slice;
var useLeftMostCallback = -1;
var useRightMostCallback = -2;

function throwsException(error, message) {
    if (typeof error === "string") {
        this.exception = new Error(message || "");
        this.exception.name = error;
    } else if (!error) {
        this.exception = new Error("Error");
    } else {
        this.exception = error;
    }
}

module.exports = {
    callsFake: function callsFake(fn) {
        this.fakeFn = fn;
    },

    callsArg: function callsArg(pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = [];
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    callsArgOn: function callsArgOn(pos, context) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = [];
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    callsArgWith: function callsArgWith(pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    callsArgOnWith: function callsArgWith(pos, context) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = slice.call(arguments, 2);
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    yields: function () {
        this.callArgAt = useLeftMostCallback;
        this.callbackArguments = slice.call(arguments, 0);
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    yieldsRight: function () {
        this.callArgAt = useRightMostCallback;
        this.callbackArguments = slice.call(arguments, 0);
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    yieldsOn: function (context) {
        this.callArgAt = useLeftMostCallback;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;
    },

    yieldsTo: function (prop) {
        this.callArgAt = useLeftMostCallback;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = undefined;
        this.callArgProp = prop;
        this.callbackAsync = false;
    },

    yieldsToOn: function (prop, context) {
        this.callArgAt = useLeftMostCallback;
        this.callbackArguments = slice.call(arguments, 2);
        this.callbackContext = context;
        this.callArgProp = prop;
        this.callbackAsync = false;
    },

    throws: throwsException,
    throwsException: throwsException,

    returns: function returns(value) {
        this.returnValue = value;
        this.resolve = false;
        this.reject = false;
        this.returnValueDefined = true;
        this.exception = undefined;
        this.fakeFn = undefined;
    },

    returnsArg: function returnsArg(pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        this.returnArgAt = pos;
    },

    returnsThis: function returnsThis() {
        this.returnThis = true;
    },

    resolves: function resolves(value) {
        this.returnValue = value;
        this.resolve = true;
        this.reject = false;
        this.returnValueDefined = true;
        this.exception = undefined;
        this.fakeFn = undefined;
    },

    rejects: function rejects(error, message) {
        var reason;
        if (typeof error === "string") {
            reason = new Error(message || "");
            reason.name = error;
        } else if (!error) {
            reason = new Error("Error");
        } else {
            reason = error;
        }
        this.returnValue = reason;
        this.resolve = false;
        this.reject = true;
        this.returnValueDefined = true;
        this.exception = undefined;
        this.fakeFn = undefined;

        return this;
    },

    callThrough: function callThrough() {
        this.callsThrough = true;
    }
};

function createAsyncVersion(syncFnName) {
    return function () {
        var result = this[syncFnName].apply(this, arguments);
        this.callbackAsync = true;
        return result;
    };
}

// create asynchronous versions of callsArg* and yields* methods
Object.keys(module.exports).forEach(function (method) {
    // need to avoid creating anotherasync versions of the newly added async methods
    if (method.match(/^(callsArg|yields)/) && !method.match(/Async/)) {
        module.exports[method + "Async"] = createAsyncVersion(method);
    }
});
