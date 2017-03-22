"use strict";

var slice = [].slice;
var useLeftMostCallback = -1;
var useRightMostCallback = -2;

function throwsException(fake, error, message) {
    if (typeof error === "string") {
        fake.exception = new Error(message || "");
        fake.exception.name = error;
    } else if (!error) {
        fake.exception = new Error("Error");
    } else {
        fake.exception = error;
    }

    return fake;
}

module.exports = {
    callsFake: function callsFake(fake, fn) {
        fake.fakeFn = fn;
    },

    callsArg: function callsArg(fake, pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = pos;
        fake.callbackArguments = [];
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    callsArgOn: function callsArgOn(fake, pos, context) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = pos;
        fake.callbackArguments = [];
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    callsArgWith: function callsArgWith(fake, pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = pos;
        fake.callbackArguments = slice.call(arguments, 2);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    callsArgOnWith: function callsArgWith(fake, pos, context) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = pos;
        fake.callbackArguments = slice.call(arguments, 3);
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    yields: function (fake) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice.call(arguments, 1);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    yieldsRight: function (fake) {
        fake.callArgAt = useRightMostCallback;
        fake.callbackArguments = slice.call(arguments, 1);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    yieldsOn: function (fake, context) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice.call(arguments, 2);
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;

        return fake;
    },

    yieldsTo: function (fake, prop) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice.call(arguments, 2);
        fake.callbackContext = undefined;
        fake.callArgProp = prop;
        fake.callbackAsync = false;

        return fake;
    },

    yieldsToOn: function (fake, prop, context) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice.call(arguments, 3);
        fake.callbackContext = context;
        fake.callArgProp = prop;
        fake.callbackAsync = false;

        return fake;
    },

    throws: throwsException,
    throwsException: throwsException,

    returns: function returns(fake, value) {
        fake.returnValue = value;
        fake.resolve = false;
        fake.reject = false;
        fake.returnValueDefined = true;
        fake.exception = undefined;
        fake.fakeFn = undefined;

        return fake;
    },

    returnsArg: function returnsArg(fake, pos) {
        if (typeof pos !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.returnArgAt = pos;

        return fake;
    },

    returnsThis: function returnsThis(fake) {
        fake.returnThis = true;

        return fake;
    },

    resolves: function resolves(fake, value) {
        fake.returnValue = value;
        fake.resolve = true;
        fake.reject = false;
        fake.returnValueDefined = true;
        fake.exception = undefined;
        fake.fakeFn = undefined;

        return fake;
    },

    rejects: function rejects(fake, error, message) {
        var reason;
        if (typeof error === "string") {
            reason = new Error(message || "");
            reason.name = error;
        } else if (!error) {
            reason = new Error("Error");
        } else {
            reason = error;
        }
        fake.returnValue = reason;
        fake.resolve = false;
        fake.reject = true;
        fake.returnValueDefined = true;
        fake.exception = undefined;
        fake.fakeFn = undefined;

        return fake;
    },

    callThrough: function callThrough(fake) {
        fake.callsThrough = true;

        return fake;
    },

    get: function get(fake, getterFunction) {
        var rootStub = fake.stub || fake;

        Object.defineProperty(rootStub.rootObj, rootStub.propName, {
            get: getterFunction
        });

        return fake;
    },

    set: function set(fake, setterFunction) {
        var rootStub = fake.stub || fake;

        Object.defineProperty(rootStub.rootObj, rootStub.propName, { // eslint-disable-line accessor-pairs
            set: setterFunction
        });

        return fake;
    }
};

function createAsyncVersion(syncFnName) {
    return function () {
        var result = module.exports[syncFnName].apply(this, arguments);
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
