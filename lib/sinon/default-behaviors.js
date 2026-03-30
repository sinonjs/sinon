"use strict";

const arrayProto = require("@sinonjs/commons").prototypes.array;
const isPropertyConfigurable = require("./util/core/is-property-configurable");
const exportAsyncBehaviors = require("./util/core/export-async-behaviors");
const extend = require("./util/core/extend");

const slice = arrayProto.slice;

const useLeftMostCallback = -1;
const useRightMostCallback = -2;

/**
 * Resets all mutually exclusive "return behavior" flags so that the most
 * recently called behavior setter always takes effect ("last call wins").
 *
 * Without this, flags like `returnArgAt` (set by `returnsArg()`) can silently
 * persist and override a later `.returns()` call because `returnArgAt` is
 * checked first in behavior.invoke().
 *
 * @param {object} fake - the stub behavior object
 */
function resetReturnBehavior(fake) {
    fake.returnArgAt = undefined;
    fake.returnThis = false;
    fake.throwArgAt = undefined;
    fake.fakeFn = undefined;
    fake.returnValue = undefined;
    fake.returnValueDefined = false;
    fake.resolve = false;
    fake.reject = false;
    fake.resolveArgAt = undefined;
    fake.resolveThis = false;
    fake.exception = undefined;
    fake.exceptionCreator = undefined;
    fake.callsThrough = false;
    fake.callsThroughWithNew = false;
}

function throwsException(fake, error, message) {
    resetReturnBehavior(fake);
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

const defaultBehaviors = {
    callsFake: function callsFake(fake, fn) {
        resetReturnBehavior(fake);
        fake.fakeFn = fn;
    },

    callsArg: function callsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = index;
        fake.callbackArguments = [];
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
    },

    callsArgOn: function callsArgOn(fake, index, context) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = index;
        fake.callbackArguments = [];
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
    },

    callsArgWith: function callsArgWith(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = index;
        fake.callbackArguments = slice(arguments, 2);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
    },

    callsArgOnWith: function callsArgWith(fake, index, context) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        fake.callArgAt = index;
        fake.callbackArguments = slice(arguments, 3);
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
    },

    yields: function (fake) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 1);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.fakeFn = undefined;
        fake.callsThrough = false;
    },

    yieldsRight: function (fake) {
        fake.callArgAt = useRightMostCallback;
        fake.callbackArguments = slice(arguments, 1);
        fake.callbackContext = undefined;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
        fake.fakeFn = undefined;
    },

    yieldsOn: function (fake, context) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 2);
        fake.callbackContext = context;
        fake.callArgProp = undefined;
        fake.callbackAsync = false;
        fake.callsThrough = false;
        fake.fakeFn = undefined;
    },

    yieldsTo: function (fake, prop) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 2);
        fake.callbackContext = undefined;
        fake.callArgProp = prop;
        fake.callbackAsync = false;
        fake.callsThrough = false;
        fake.fakeFn = undefined;
    },

    yieldsToOn: function (fake, prop, context) {
        fake.callArgAt = useLeftMostCallback;
        fake.callbackArguments = slice(arguments, 3);
        fake.callbackContext = context;
        fake.callArgProp = prop;
        fake.callbackAsync = false;
        fake.fakeFn = undefined;
    },

    throws: throwsException,
    throwsException: throwsException,

    returns: function returns(fake, value) {
        resetReturnBehavior(fake);
        fake.returnValue = value;
        fake.returnValueDefined = true;
    },

    returnsArg: function returnsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        resetReturnBehavior(fake);
        fake.returnArgAt = index;
    },

    throwsArg: function throwsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        resetReturnBehavior(fake);
        fake.throwArgAt = index;
    },

    returnsThis: function returnsThis(fake) {
        resetReturnBehavior(fake);
        fake.returnThis = true;
    },

    resolves: function resolves(fake, value) {
        resetReturnBehavior(fake);
        fake.returnValue = value;
        fake.resolve = true;
        fake.returnValueDefined = true;
    },

    resolvesArg: function resolvesArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }
        resetReturnBehavior(fake);
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
        resetReturnBehavior(fake);
        fake.returnValue = reason;
        fake.reject = true;
        fake.returnValueDefined = true;

        return fake;
    },

    resolvesThis: function resolvesThis(fake) {
        resetReturnBehavior(fake);
        fake.resolveThis = true;
    },

    callThrough: function callThrough(fake) {
        fake.callsThrough = true;
    },

    callThroughWithNew: function callThroughWithNew(fake) {
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
