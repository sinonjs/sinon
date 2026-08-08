import commons from "@sinonjs/commons";

const { prototypes } = commons;
import isPropertyConfigurable from "./util/core/is-property-configurable.js";
import exportAsyncBehaviors from "./util/core/export-async-behaviors.js";
import extend from "./util/core/extend.js";

const { slice } = prototypes.array;

const useLeftMostCallback = -1;
const useRightMostCallback = -2;

// The fields `behavior.js#invoke` consults to decide what a call *returns or
// throws*. These are mutually exclusive -- only the most recently set one
// should apply -- so every setter below resets this whole set first, then
// sets only its own field(s). Individual setters clearing only the specific
// fields they happened to think of caused repeated regressions (e.g. #2566,
// #2656): `returnsArg` followed by `throwsArg`/`callsFake`/`returnsThis`/
// `resolves` left `returnArgAt` in place, which `invoke` checks before any of
// those.
//
// This intentionally excludes callArgAt/callArgProp/callbackArguments/
// callbackContext/callbackAsync (the callsArg*/yields* config): yielding a
// callback is a separate, additive side effect that's meant to combine with
// any of these return/throw behaviors regardless of call order (see
// "returnsArg takes precedent over yielded return value" and similar tests),
// not another mutually-exclusive choice in this same set.
function resetBehavior(fake) {
    fake.callsThrough = false;
    fake.callsThroughWithNew = false;
    fake.exception = undefined;
    fake.exceptionCreator = undefined;
    fake.fakeFn = undefined;
    fake.reject = false;
    fake.resolve = false;
    fake.resolveArgAt = undefined;
    fake.resolveThis = false;
    fake.returnArgAt = undefined;
    fake.returnThis = false;
    fake.returnValue = undefined;
    fake.returnValueDefined = false;
    fake.throwArgAt = undefined;
}

// callThrough/callThroughWithNew additionally clear the callback-yielding
// config, since "call the real method" is meant to replace all stub
// customization, unlike the behaviors above, which are meant to coexist with
// a separately configured yielded callback.
function resetCallbackConfig(fake) {
    fake.callArgAt = undefined;
    fake.callArgProp = undefined;
    fake.callbackArguments = [];
    fake.callbackContext = undefined;
    fake.callbackAsync = false;
}

function throwsException(fake, error, message) {
    resetBehavior(fake);
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
        resetBehavior(fake);
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
        resetBehavior(fake);
        fake.returnValue = value;
        fake.returnValueDefined = true;
    },

    returnsArg: function returnsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        resetBehavior(fake);
        fake.returnArgAt = index;
    },

    throwsArg: function throwsArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        resetBehavior(fake);
        fake.throwArgAt = index;
    },

    returnsThis: function returnsThis(fake) {
        resetBehavior(fake);
        fake.returnThis = true;
    },

    resolves: function resolves(fake, value) {
        resetBehavior(fake);
        fake.returnValue = value;
        fake.resolve = true;
        fake.returnValueDefined = true;
    },

    resolvesArg: function resolvesArg(fake, index) {
        if (typeof index !== "number") {
            throw new TypeError("argument index is not number");
        }

        resetBehavior(fake);
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

        resetBehavior(fake);
        fake.returnValue = reason;
        fake.reject = true;
        fake.returnValueDefined = true;

        return fake;
    },

    resolvesThis: function resolvesThis(fake) {
        resetBehavior(fake);
        fake.resolveThis = true;
    },

    callThrough: function callThrough(fake) {
        resetBehavior(fake);
        resetCallbackConfig(fake);
        fake.callsThrough = true;
    },

    callThroughWithNew: function callThroughWithNew(fake) {
        resetBehavior(fake);
        resetCallbackConfig(fake);
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

export default extend({}, defaultBehaviors, asyncBehaviors);
