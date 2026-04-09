import commons from "@sinonjs/commons";
import samsam from "@sinonjs/samsam";
import createProxy from "./proxy.js";
import extend from "./util/core/extend.js";
import getPropertyDescriptor from "./util/core/get-property-descriptor.js";
import isEsModule from "./util/core/is-es-module.js";
import * as proxyCallUtil from "./proxy-call-util.js";
import walkObject from "./util/core/walk-object.js";
import wrapMethod from "./util/core/wrap-method.js";

const { prototypes, functionName, valueToString } = commons;
const { deepEqual } = samsam;
const { forEach, pop, push, slice } = prototypes.array;
const filter = Array.prototype.filter;

let uuid = 0;

function matches(fake, args, strict) {
    const margs = fake.matchingArguments;
    if (
        margs.length <= args.length &&
        deepEqual(slice(args, 0, margs.length), margs)
    ) {
        return !strict || margs.length === args.length;
    }
    return false;
}

// Public API
const spyApi = {
    withArgs: function () {
        const args = slice(arguments);
        const matching = pop(this.matchingFakes(args, true));
        if (matching) {
            return matching;
        }

        const original = this;
        const fakeInstance = this.instantiateFake();
        fakeInstance.matchingArguments = args;
        fakeInstance.parent = this;
        push(this.fakes, fakeInstance);

        fakeInstance.withArgs = function () {
            return original.withArgs.apply(original, arguments);
        };

        forEach(original.args, function (arg, i) {
            if (!matches(fakeInstance, arg)) {
                return;
            }

            proxyCallUtil.incrementCallCount(fakeInstance);
            push(fakeInstance.thisValues, original.thisValues[i]);
            push(fakeInstance.args, arg);
            push(fakeInstance.returnValues, original.returnValues[i]);
            push(fakeInstance.exceptions, original.exceptions[i]);
            push(fakeInstance.callIds, original.callIds[i]);
        });

        proxyCallUtil.createCallProperties(fakeInstance);

        return fakeInstance;
    },

    // Override proxy default implementation
    matchingFakes: function (args, strict) {
        return filter.call(this.fakes, function (fakeInstance) {
            return matches(fakeInstance, args, strict);
        });
    },
};

/* eslint-disable @sinonjs/no-prototype-methods/no-prototype-methods */
const delegateToCalls = proxyCallUtil.delegateToCalls;
delegateToCalls(spyApi, "callArg", false, "callArgWith", true, function () {
    throw new Error(
        `${this.toString()} cannot call arg since it was not yet invoked.`,
    );
});
spyApi.callArgWith = spyApi.callArg;
delegateToCalls(spyApi, "callArgOn", false, "callArgOnWith", true, function () {
    throw new Error(
        `${this.toString()} cannot call arg since it was not yet invoked.`,
    );
});
spyApi.callArgOnWith = spyApi.callArgOn;
delegateToCalls(spyApi, "throwArg", false, "throwArg", false, function () {
    throw new Error(
        `${this.toString()} cannot throw arg since it was not yet invoked.`,
    );
});
delegateToCalls(spyApi, "yield", false, "yield", true, function () {
    throw new Error(
        `${this.toString()} cannot yield since it was not yet invoked.`,
    );
});
// "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.
spyApi.invokeCallback = spyApi.yield;
delegateToCalls(spyApi, "yieldOn", false, "yieldOn", true, function () {
    throw new Error(
        `${this.toString()} cannot yield since it was not yet invoked.`,
    );
});
delegateToCalls(spyApi, "yieldTo", false, "yieldTo", true, function (property) {
    throw new Error(
        `${this.toString()} cannot yield to '${valueToString(
            property,
        )}' since it was not yet invoked.`,
    );
});
delegateToCalls(
    spyApi,
    "yieldToOn",
    false,
    "yieldToOn",
    true,
    function (property) {
        throw new Error(
            `${this.toString()} cannot yield to '${valueToString(
                property,
            )}' since it was not yet invoked.`,
        );
    },
);

function createSpy(func) {
    let name;
    let funk = func;

    if (typeof funk !== "function") {
        funk = function () {
            return;
        };
    } else {
        name = functionName(funk);
    }

    const proxy = createProxy(funk, funk);

    // Inherit spy API:
    extend.nonEnum(proxy, spyApi);
    extend.nonEnum(proxy, {
        displayName: name || "spy",
        fakes: [],
        instantiateFake: createSpy,
        id: `spy#${uuid++}`,
    });
    return proxy;
}

/**
 * Creates a spy.
 *
 * @param {object|Function} [object] The object or function to spy on
 * @param {string} [property] The property name to spy on
 * @param {Array} [types] Types of accessor to spy on (get, set)
 * @returns {Function|object} The spy or an object with spied accessors
 */
export default function spy(object, property, types) {
    if (isEsModule(object)) {
        throw new TypeError("ES Modules cannot be spied");
    }

    if (!property && typeof object === "function") {
        return createSpy(object);
    }

    if (!property && typeof object === "object") {
        return walkObject(spy, object);
    }

    if (!object && !property) {
        return createSpy(function () {
            return;
        });
    }

    if (!types) {
        return wrapMethod(object, property, createSpy(object[property]));
    }

    const descriptor = {};
    const methodDesc = getPropertyDescriptor(object, property);

    forEach(types, function (type) {
        descriptor[type] = createSpy(methodDesc[type]);
    });

    return wrapMethod(object, property, descriptor);
}

extend(spy, spyApi);
