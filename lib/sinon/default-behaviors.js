"use strict";

const arrayProto = require("@sinonjs/commons").prototypes.array;
const isPropertyConfigurable = require("./util/core/is-property-configurable");
const exportAsyncBehaviors = require("./util/core/export-async-behaviors");
const extend = require("./util/core/extend");

const slice = arrayProto.slice;

const useLeftMostCallback = -1;
const useRightMostCallback = -2;

function throwsException(fake, error, message) {
    if (typeof error === "function") {
        fake.exceptionCreator = error;
    } else if (typeof error === "string") {
        fake.exceptionCreator = function () {
            const newException = new Error(
                message || `Sinon-provided ${error}`,
            );
            newException.name = error;
            return newException;
        };
    } else if (!error) {
        fake.exceptionCreator = function () {
            return new Error("Error");
        };
    } else {
        fake.exception = error;
    }
}

const SKIP_OPTIONS_FOR_YIELDS = {
    skipReturn: true,
    skipThrows: true,
};

function clear(fake, options) {
    fake.fakeFn = undefined;

    fake.callsThrough = undefined;
    fake.callsThroughWithNew = undefined;

    if (!options || !options.skipThrows) {
        fake.exception = undefined;
        fake.exceptionCreator = undefined;
        fake.throwArgAt = undefined;
    }

    fake.callArgAt = undefined;
    fake.callbackArguments = undefined;
    fake.callbackContext = undefined;
    fake.callArgProp = undefined;
    fake.callbackAsync = undefined;

    if (!options || !options.skipReturn) {
        fake.returnValue = undefined;
        fake.returnValueDefined = undefined;
        fake.returnArgAt = undefined;
        fake.returnThis = undefined;
    }

    fake.resolve = undefined;
    fake.resolveThis = undefined;
    fake.resolveArgAt = undefined;

    fake.reject = undefined;
}

const defaultBehaviors = {
    callsFake: function callsFake(fake, fn) {
        clear(fake);

        fake.fakeFn = fn;
    },

    callsArg: function callsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.callArgAt = index;
        fake.callbackArguments = [];
    },

    callsArgOn: function callsArgOn(fake, index, context) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.callArgAt = index;
        fake.callbackArguments = [];
        fake.callbackContext = context;
    },

    callsArgWith: function callsArgWith(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.callArgAt = index;
        fake.callbackArguments = slice(arguments, 2);
    },

    callsArgOnWith: function callsArgWith(fake, index, context) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.callArgAt = index;
        fake.callbackArguments = slice(arguments, 3);
        fake.callbackContext = context;
    },

    usingPromise: function usingPromise(fake, promiseLibrary) {
        fake.promiseLibrary = promiseLibrary;
    },

    yields: function (fake) {
        clear(fake, SKIP_OPTIONS_FOR_YIELDS);

        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 1);
    },

    yieldsRight: function (fake) {
        clear(fake, SKIP_OPTIONS_FOR_YIELDS);

        fake.callArgAt = useRightMostCallback;
        fake.callbackArguments = slice(arguments, 1);
    },

    yieldsOn: function (fake, context) {
        clear(fake, SKIP_OPTIONS_FOR_YIELDS);

        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 2);
        fake.callbackContext = context;
    },

    yieldsTo: function (fake, prop) {
        clear(fake, SKIP_OPTIONS_FOR_YIELDS);

        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 2);
        fake.callArgProp = prop;
    },

    yieldsToOn: function (fake, prop, context) {
        clear(fake, SKIP_OPTIONS_FOR_YIELDS);

        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 3);
        fake.callbackContext = context;
        fake.callArgProp = prop;
    },

    throws: throwsException,
    throwsException: throwsException,

    returns: function returns(fake, value) {
        clear(fake);

        fake.returnValue = value;
        fake.returnValueDefined = true;
    },

    returnsArg: function returnsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.returnArgAt = index;
    },

    throwsArg: function throwsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.throwArgAt = index;
    },

    returnsThis: function returnsThis(fake) {
        clear(fake);

        fake.returnThis = true;
    },

    resolves: function resolves(fake, value) {
        clear(fake);

        fake.returnValue = value;
        fake.resolve = true;
        fake.returnValueDefined = true;
    },

    resolvesArg: function resolvesArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        clear(fake);

        fake.resolveArgAt = index;
        fake.resolve = true;
    },

    rejects: function rejects(fake, error, message) {
        let reason;
        if (typeof error === "string") {
            reason = new Error(message || "");
            reason.name = error;
        } else if (!error) {
            reason = new Error("Error");
        } else {
            reason = error;
        }
        clear(fake);

        fake.returnValue = reason;
        fake.reject = true;
        fake.returnValueDefined = true;

        return fake;
    },

    resolvesThis: function resolvesThis(fake) {
        clear(fake);

        fake.resolveThis = true;
    },

    callThrough: function callThrough(fake) {
        clear(fake);

        fake.callsThrough = true;
    },

    callThroughWithNew: function callThroughWithNew(fake) {
        clear(fake);

        fake.callsThroughWithNew = true;
    },

    get: function get(fake, getterFunction) {
        const rootStub = fake.stub || fake;

        Object.defineProperty(rootStub.rootObj, rootStub.propName, {
            get: getterFunction,
            configurable: isPropertyConfigurable(
                rootStub.rootObj,
                rootStub.propName,
            ),
        });

        return fake;
    },

    set: function set(fake, setterFunction) {
        const rootStub = fake.stub || fake;

        Object.defineProperty(
            rootStub.rootObj,
            rootStub.propName,
            // eslint-disable-next-line accessor-pairs
            {
                set: setterFunction,
                configurable: isPropertyConfigurable(
                    rootStub.rootObj,
                    rootStub.propName,
                ),
            },
        );

        return fake;
    },

    value: function value(fake, newVal) {
        const rootStub = fake.stub || fake;

        Object.defineProperty(rootStub.rootObj, rootStub.propName, {
            value: newVal,
            enumerable: true,
            writable: true,
            configurable:
                rootStub.shadowsPropOnPrototype ||
                isPropertyConfigurable(rootStub.rootObj, rootStub.propName),
        });

        return fake;
    },
};

const asyncBehaviors = exportAsyncBehaviors(defaultBehaviors);

module.exports = extend({}, defaultBehaviors, asyncBehaviors);
