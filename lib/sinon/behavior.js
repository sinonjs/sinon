"use strict";
var fn = require("./functions");
var extend = require("./extend");

var slice = Array.prototype.slice;
var join = Array.prototype.join;

var nextTick = (function () {
    if (typeof process === "object" && typeof process.nextTick === "function") {
        return process.nextTick;
    }
    if (typeof setImmediate === "function") {
        return setImmediate;
    }
    return function (callback) {
        setTimeout(callback, 0);
    };
}());

function throwsException(error, message) {
    if (typeof error === "string") {
        this.exception = new Error(message || "");
        this.exception.name = error;
    } else if (!error) {
        this.exception = new Error("Error");
    } else {
        this.exception = error;
    }

    return this;
}

function getCallback(behavior, args) {
    var callArgAt = behavior.callArgAt;

    if (callArgAt < 0) {
        var callArgProp = behavior.callArgProp;

        for (var i = 0, l = args.length; i < l; ++i) {
            if (!callArgProp && typeof args[i] == "function") {
                return args[i];
            }

            if (callArgProp && args[i] &&
                typeof args[i][callArgProp] == "function") {
                return args[i][callArgProp];
            }
        }

        return null;
    }

    return args[callArgAt];
}

function getCallbackError(behavior, func, args) {
    if (behavior.callArgAt < 0) {
        var msg;

        if (behavior.callArgProp) {
            msg = fn.getName(behavior.stub) +
                " expected to yield to '" + behavior.callArgProp +
                "', but no object with such a property was passed.";
        } else {
            msg = fn.getName(behavior.stub) +
                " expected to yield, but no callback was passed.";
        }

        if (args.length > 0) {
            msg += " Received [" + join.call(args, ", ") + "]";
        }

        return msg;
    }

    return "argument at index " + behavior.callArgAt + " is not a function: " + func;
}

function callCallback(behavior, args) {
    if (typeof behavior.callArgAt == "number") {
        var func = getCallback(behavior, args);

        if (typeof func != "function") {
            throw new TypeError(getCallbackError(behavior, func, args));
        }

        if (behavior.callbackAsync) {
            nextTick(function () {
                func.apply(behavior.callbackContext, behavior.callbackArguments);
            });
        } else {
            func.apply(behavior.callbackContext, behavior.callbackArguments);
        }
    }
}

var behavior = {
    create: function create(stub) {
        var instance = extend({}, behavior);
        delete instance.create;
        instance.stub = stub;

        return instance;
    },

    isPresent: function isPresent() {
        return (typeof this.callArgAt == "number" ||
                this.exception ||
                typeof this.returnArgAt == "number" ||
                this.returnThis ||
                this.returnValueDefined);
    },

    invoke: function invoke(context, args) {
        callCallback(this, args);

        if (this.exception) {
            throw this.exception;
        } else if (typeof this.returnArgAt == "number") {
            return args[this.returnArgAt];
        } else if (this.returnThis) {
            return context;
        }

        return this.returnValue;
    },

    onCall: function onCall(index) {
        return this.stub.onCall(index);
    },

    onFirstCall: function onFirstCall() {
        return this.stub.onFirstCall();
    },

    onSecondCall: function onSecondCall() {
        return this.stub.onSecondCall();
    },

    onThirdCall: function onThirdCall() {
        return this.stub.onThirdCall();
    },

    withArgs: function withArgs(/* arguments */) {
        throw new Error("Defining a stub by invoking \"stub.onCall(...).withArgs(...)\" is not supported. " +
                        "Use \"stub.withArgs(...).onCall(...)\" to define sequential behavior for calls with certain arguments.");
    },

    callsArg: function callsArg(pos) {
        if (typeof pos != "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = [];
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    callsArgOn: function callsArgOn(pos, context) {
        if (typeof pos != "number") {
            throw new TypeError("argument index is not number");
        }
        if (typeof context != "object") {
            throw new TypeError("argument context is not an object");
        }

        this.callArgAt = pos;
        this.callbackArguments = [];
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    callsArgWith: function callsArgWith(pos) {
        if (typeof pos != "number") {
            throw new TypeError("argument index is not number");
        }

        this.callArgAt = pos;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    callsArgOnWith: function callsArgWith(pos, context) {
        if (typeof pos != "number") {
            throw new TypeError("argument index is not number");
        }
        if (typeof context != "object") {
            throw new TypeError("argument context is not an object");
        }

        this.callArgAt = pos;
        this.callbackArguments = slice.call(arguments, 2);
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    yields: function () {
        this.callArgAt = -1;
        this.callbackArguments = slice.call(arguments, 0);
        this.callbackContext = undefined;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    yieldsOn: function (context) {
        if (typeof context != "object") {
            throw new TypeError("argument context is not an object");
        }

        this.callArgAt = -1;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = context;
        this.callArgProp = undefined;
        this.callbackAsync = false;

        return this;
    },

    yieldsTo: function (prop) {
        this.callArgAt = -1;
        this.callbackArguments = slice.call(arguments, 1);
        this.callbackContext = undefined;
        this.callArgProp = prop;
        this.callbackAsync = false;

        return this;
    },

    yieldsToOn: function (prop, context) {
        if (typeof context != "object") {
            throw new TypeError("argument context is not an object");
        }

        this.callArgAt = -1;
        this.callbackArguments = slice.call(arguments, 2);
        this.callbackContext = context;
        this.callArgProp = prop;
        this.callbackAsync = false;

        return this;
    },

    throws: throwsException,
    throwsException: throwsException,

    returns: function returns(value) {
        this.returnValue = value;
        this.returnValueDefined = true;

        return this;
    },

    returnsArg: function returnsArg(pos) {
        if (typeof pos != "number") {
            throw new TypeError("argument index is not number");
        }

        this.returnArgAt = pos;

        return this;
    },

    returnsThis: function returnsThis() {
        this.returnThis = true;

        return this;
    }
};

// create asynchronous versions of callsArg* and yields* methods
for (var method in behavior) {
    // need to avoid creating anotherasync versions of the newly added async methods
    if (behavior.hasOwnProperty(method) &&
        method.match(/^(callsArg|yields)/) &&
        !method.match(/Async/)) {
        behavior[method + "Async"] = (function (syncFnName) {
            return function () {
                var result = this[syncFnName].apply(this, arguments);
                this.callbackAsync = true;
                return result;
            };
        })(method);
    }
}

module.exports = behavior;
