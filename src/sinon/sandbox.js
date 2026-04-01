import commons from "@sinonjs/commons";
import samsam from "@sinonjs/samsam";
import collectOwnMethods from "./collect-own-methods.js";
import getPropertyDescriptor from "./util/core/get-property-descriptor.js";
import isPropertyConfigurable from "./util/core/is-property-configurable.js";
import sinonAssert from "./assert.js";
import * as sinonClock from "./util/fake-timers.js";
import sinonMock from "./mock.js";
import sinonSpy from "./spy.js";
import sinonStub from "./stub.js";
import sinonCreateStubInstance from "./create-stub-instance.js";
import sinonFake from "./fake.js";
import extend from "./util/core/extend.js";

const { array: arrayProto } = commons.prototypes;
const { deprecated: logger, valueToString } = commons;
const { createMatcher: match } = samsam;

const DEFAULT_LEAK_THRESHOLD = 10000;

const filter = arrayProto.filter;
const forEach = arrayProto.forEach;
const push = arrayProto.push;
const reverse = arrayProto.reverse;

function applyOnEach(fakes, method) {
    const matchingFakes = filter(fakes, function (fake) {
        return typeof fake[method] === "function";
    });

    forEach(matchingFakes, function (fake) {
        fake[method]();
    });
}

function throwOnAccessors(descriptor) {
    if (typeof descriptor.get === "function") {
        throw new Error("Can't replace a getter-only property with a value");
    }

    if (typeof descriptor.set === "function") {
        throw new Error("Can't replace a setter-only property with a value");
    }
}

function verifySameType(object, property, replacement) {
    const original = object[property];
    const originalType = typeof original;
    const replacementType = typeof replacement;

    if (originalType !== replacementType) {
        throw new TypeError(
            `Cannot replace ${originalType} with ${replacementType}`,
        );
    }
}

function checkForValidArguments(descriptor, property, replacement) {
    if (!descriptor || typeof property === "undefined") {
        throw new TypeError("Nothing to replace");
    }

    if (arguments.length < 3) {
        throw new TypeError("Expected object, property and replacement");
    }
}

/**
 * Creates a sandbox.
 *
 * @param {object} [opts] Options for the sandbox
 * @returns {object} The sandbox object
 * @constructor
 */
export default function Sandbox(opts = {}) {
    const sandbox = this;
    const assertOptions = opts.assertOptions || {};
    const fakeRestorers = [];

    let collection = [];
    let loggedLeakWarning = false;
    sandbox.leakThreshold = DEFAULT_LEAK_THRESHOLD;

    function addToCollection(object) {
        if (
            push(collection, object) > sandbox.leakThreshold &&
            !loggedLeakWarning
        ) {
            // eslint-disable-next-line no-console
            console.warn(
                `Sinon sandbox: The number of fakes in the sandbox has exceeded the leak threshold of ${sandbox.leakThreshold}. ` +
                    "To avoid memory leaks, ensure you are restoring the sandbox after each test. " +
                    "To disable this warning, modify the leakThreshold property of your sandbox.",
            );
            loggedLeakWarning = true;
        }
    }

    sandbox.assert = sinonAssert.createAssertObject(assertOptions);

    // this is for testing only
    sandbox.getFakes = function getFakes() {
        return collection;
    };

    sandbox.createStubInstance = function createStubInstance() {
        const stubbed = sinonCreateStubInstance.apply(null, arguments);
        const ownMethods = collectOwnMethods(stubbed);

        forEach(ownMethods, function (method) {
            addToCollection(method);
        });

        return stubbed;
    };

    sandbox.inject = function inject(obj) {
        obj.spy = function spy() {
            return sandbox.spy.apply(null, arguments);
        };

        obj.stub = function stub() {
            return sandbox.stub.apply(null, arguments);
        };

        obj.mock = function mock() {
            return sandbox.mock.apply(null, arguments);
        };

        obj.createStubInstance = function createStubInstanceWrapper() {
            return sandbox.createStubInstance.apply(sandbox, arguments);
        };

        obj.fake = function fake(f) {
            return sandbox.fake.apply(null, arguments);
        };

        obj.define = function define() {
            return sandbox.define.apply(null, arguments);
        };

        obj.replace = function replace() {
            return sandbox.replace.apply(null, arguments);
        };

        obj.replaceSetter = function replaceSetter() {
            return sandbox.replaceSetter.apply(null, arguments);
        };

        obj.replaceGetter = function replaceGetter() {
            return sandbox.replaceGetter.apply(null, arguments);
        };

        if (sandbox.clock) {
            obj.clock = sandbox.clock;
        }

        obj.match = match;

        return obj;
    };

    function commonPostInitSetup(args, spy, isStub) {
        if (isStub && args.length >= 3) {
            throw new TypeError(
                "stub(obj, 'meth', fn) has been removed, see documentation",
            );
        }

        if (args.length >= 2) {
            addToCollection(spy);
        }

        return spy;
    }

    sandbox.spy = function () {
        const createdSpy = sinonSpy.apply(sinonSpy, arguments);
        return commonPostInitSetup(arguments, createdSpy, false);
    };
    Object.defineProperty(sandbox.spy, "name", { value: "spy", configurable: true });
    Object.defineProperty(sandbox.spy, "length", { value: 0, configurable: true });
    extend(sandbox.spy, sinonSpy);

    sandbox.stub = function () {
        const createdStub = sinonStub.apply(sinonStub, arguments);
        return commonPostInitSetup(arguments, createdStub, true);
    };
    Object.defineProperty(sandbox.stub, "name", { value: "stub", configurable: true });
    Object.defineProperty(sandbox.stub, "length", { value: 0, configurable: true });
    extend(sandbox.stub, sinonStub);

    sandbox.mock = function () {
        const m = sinonMock.apply(null, arguments);

        addToCollection(m);

        return m;
    };
    Object.defineProperty(sandbox.mock, "name", { value: "mock", configurable: true });
    Object.defineProperty(sandbox.mock, "length", { value: 0, configurable: true });
    extend(sandbox.mock, sinonMock);

    sandbox.reset = function reset() {
        applyOnEach(collection, "reset");
        applyOnEach(collection, "resetHistory");
    };

    sandbox.resetBehavior = function resetBehavior() {
        applyOnEach(collection, "resetBehavior");
    };

    sandbox.resetHistory = function resetHistory() {
        for (let i = 0; i < collection.length; i++) {
            const f = collection[i];
            const method = f.resetHistory || f.reset;
            if (typeof method === "function") {
                method.call(f);
            }
        }
    };

    sandbox.verify = function verify() {
        applyOnEach(collection, "verify");
    };

    sandbox.verifyAndRestore = function verifyAndRestore() {
        let exception;

        try {
            sandbox.verify();
        } catch (e) {
            exception = e;
        }

        sandbox.restore();

        if (exception) {
            throw exception;
        }
    };

    sandbox.restore = function restore() {
        if (arguments.length) {
            throw new Error(
                "sandbox.restore() does not take arguments. " +
                    "If you want to restore a single stub, call stub.restore()",
            );
        }

        reverse(fakeRestorers);
        forEach(fakeRestorers, function (restorer) {
            restorer();
        });
        fakeRestorers.length = 0;

        applyOnEach(collection, "restore");
        collection = [];
    };

    sandbox.restoreContext = function restoreContext() {
        forEach(sandbox.injectedKeys, function (injectedKey) {
            delete sandbox.injectInto[injectedKey];
        });
        sandbox.injectedKeys.length = 0;
    };

    /**
     * Creates a restorer function for the property
     * @param {object} object the object containing the property
     * @param {string} property the name of the property
     * @param {boolean} [forceAssignment] if true, uses assignment instead of DefineProperty
     * @returns {Function} restorer function
     */
    function getFakeRestorer(object, property, forceAssignment = false) {
        const descriptor = getPropertyDescriptor(object, property);

        function restorer() {
            if (descriptor !== undefined && descriptor.isOwn) {
                Object.defineProperty(object, property, descriptor);
                return;
            }

            if (forceAssignment) {
                object[property] = undefined;
            }

            delete object[property];
        }

        restorer.sinon = true;

        return restorer;
    }

    function verifyNotReplaced(object, property) {
        forEach(fakeRestorers, function (fakeRestorer) {
            if (
                fakeRestorer.object === object &&
                fakeRestorer.property === property
            ) {
                throw new TypeError(
                    `Attempted to replace ${valueToString(
                        property,
                    )} which is already replaced`,
                );
            }
        });
    }

    sandbox.replace = function replace(object, property, replacement) {
        const descriptor = getPropertyDescriptor(object, property);

        checkForValidArguments(descriptor, property, replacement);
        verifyNotReplaced(object, property);
        throwOnAccessors(descriptor);

        if (typeof replacement === "function") {
            verifySameType(object, property, replacement);
        }

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property));

        object[property] = replacement;

        return replacement;
    };

    sandbox.replace.usingAccessor = function replaceUsingAccessor(
        object,
        property,
        replacement,
    ) {
        const descriptor = getPropertyDescriptor(object, property);

        checkForValidArguments(descriptor, property, replacement);
        verifyNotReplaced(object, property);
        throwOnAccessors(descriptor);

        verifySameType(object, property, replacement);

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property, true));

        object[property] = replacement;

        return replacement;
    };

    sandbox.define = function define(object, property, value) {
        const descriptor = getPropertyDescriptor(object, property);

        if (typeof property === "undefined") {
            throw new TypeError("Nothing to replace");
        }

        if (descriptor && descriptor.isOwn) {
            throw new TypeError(
                `Attempted to define ${valueToString(
                    property,
                )} which is already own property`,
            );
        }

        // store a function for restoring the defined property
        push(fakeRestorers, getFakeRestorer(object, property));

        Object.defineProperty(object, property, {
            value: value,
            configurable: true,
            enumerable: true,
            writable: true,
        });

        return value;
    };

    sandbox.replaceSetter = function replaceSetter(
        object,
        property,
        replacement,
    ) {
        if (typeof replacement !== "function") {
            throw new TypeError(
                "Expected replacement argument to be a function",
            );
        }

        const descriptor = getPropertyDescriptor(object, property);

        checkForValidArguments(descriptor, property, replacement);
        verifyNotReplaced(object, property);

        if (typeof descriptor.set !== "function") {
            throw new TypeError(
                `Descriptor for property ${valueToString(
                    property,
                )} does not have a setter`,
            );
        }

        if (!descriptor.configurable) {
            throw new TypeError(
                `Descriptor for property ${valueToString(
                    property,
                )} is not configurable`,
            );
        }

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property));

        Object.defineProperty(object, property, {
            set: replacement,
            configurable: true,
            enumerable: descriptor.enumerable,
        });

        return replacement;
    };

    sandbox.replaceGetter = function replaceGetter(
        object,
        property,
        replacement,
    ) {
        if (typeof replacement !== "function") {
            throw new TypeError(
                "Expected replacement argument to be a function",
            );
        }

        const descriptor = getPropertyDescriptor(object, property);

        checkForValidArguments(descriptor, property, replacement);
        verifyNotReplaced(object, property);

        if (typeof descriptor.get !== "function") {
            throw new TypeError(
                `Descriptor for property ${valueToString(
                    property,
                )} does not have a getter`,
            );
        }

        if (!descriptor.configurable) {
            throw new TypeError(
                `Descriptor for property ${valueToString(
                    property,
                )} is not configurable`,
            );
        }

        // store a function for property for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property));

        Object.defineProperty(object, property, {
            get: replacement,
            configurable: true,
            enumerable: descriptor.enumerable,
        });

        return replacement;
    };

    sandbox.useFakeTimers = function useFakeTimers(args) {
        const clock = sinonClock.useFakeTimers.call(null, args);

        sandbox.clock = clock;
        addToCollection(clock);

        return clock;
    };

    sandbox.fake = function (f) {
        const createdFake = sinonFake.apply(sinonFake, arguments);
        return commonPostInitSetup(arguments, createdFake, false);
    };
    Object.defineProperty(sandbox.fake, "name", { value: "fake", configurable: true });
    Object.defineProperty(sandbox.fake, "length", { value: 1, configurable: true });
    extend(sandbox.fake, sinonFake);
}

Sandbox.prototype.match = match;
