'use strict';

var commons = require('@sinonjs/commons');
var samsam = require('@sinonjs/samsam');
var collectOwnMethods = require('./collect-own-methods.js');
var getPropertyDescriptor = require('./util/core/get-property-descriptor.js');
var isPropertyConfigurable = require('./util/core/is-property-configurable.js');
var sinonAssert = require('./assert.js');
var fakeTimers = require('./util/fake-timers.js');
var sinonMock = require('./mock.js');
var spy = require('./spy.js');
var stub = require('./stub.js');
var sinonCreateStubInstance = require('./create-stub-instance.js');
var sinonFake = require('./fake.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var commons__default = /*#__PURE__*/_interopDefault(commons);
var samsam__default = /*#__PURE__*/_interopDefault(samsam);
var collectOwnMethods__default = /*#__PURE__*/_interopDefault(collectOwnMethods);
var getPropertyDescriptor__default = /*#__PURE__*/_interopDefault(getPropertyDescriptor);
var isPropertyConfigurable__default = /*#__PURE__*/_interopDefault(isPropertyConfigurable);
var sinonAssert__default = /*#__PURE__*/_interopDefault(sinonAssert);
var sinonMock__default = /*#__PURE__*/_interopDefault(sinonMock);
var spy__default = /*#__PURE__*/_interopDefault(spy);
var sinonCreateStubInstance__default = /*#__PURE__*/_interopDefault(sinonCreateStubInstance);
var sinonFake__default = /*#__PURE__*/_interopDefault(sinonFake);

const { array: arrayProto } = commons__default.default.prototypes;
const { deprecated: logger, valueToString } = commons__default.default;
const { createMatcher: match } = samsam__default.default;

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
        throw new Error("Use sandbox.replaceGetter for replacing getters");
    }

    if (typeof descriptor.set === "function") {
        throw new Error("Use sandbox.replaceSetter for replacing setters");
    }
}

function verifySameType(object, property, replacement) {
    if (typeof object[property] !== typeof replacement) {
        throw new TypeError(
            `Cannot replace ${typeof object[
                property
            ]} with ${typeof replacement}`,
        );
    }
}

function checkForValidArguments(descriptor, property, replacement) {
    if (typeof descriptor === "undefined") {
        throw new TypeError(
            `Cannot replace non-existent property ${valueToString(
                property,
            )}. Perhaps you meant sandbox.define()?`,
        );
    }

    if (typeof replacement === "undefined") {
        throw new TypeError("Expected replacement argument to be defined");
    }
}

/**
 * A sinon sandbox
 *
 * @param opts
 * @param {object} [opts.assertOptions] see the CreateAssertOptions in ./assert
 * @class
 */
function Sandbox(opts = {}) {
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
            logger.printWarning(
                "Potential memory leak detected; be sure to call restore() to clean up your sandbox. To suppress this warning, modify the leakThreshold property of your sandbox.",
            );
            loggedLeakWarning = true;
        }
    }

    sandbox.assert = sinonAssert__default.default.createAssertObject(assertOptions);

    // this is for testing only
    sandbox.getFakes = function getFakes() {
        return collection;
    };

    sandbox.createStubInstance = function createStubInstance() {
        const stubbed = sinonCreateStubInstance__default.default.apply(null, arguments);

        const ownMethods = collectOwnMethods__default.default(stubbed);

        forEach(ownMethods, function (method) {
            addToCollection(method);
        });

        return stubbed;
    };

    sandbox.inject = function inject(obj) {
        obj.spy = function () {
            return sandbox.spy.apply(null, arguments);
        };

        obj.stub = function () {
            return sandbox.stub.apply(null, arguments);
        };

        obj.mock = function () {
            return sandbox.mock.apply(null, arguments);
        };

        obj.createStubInstance = function () {
            return sandbox.createStubInstance.apply(sandbox, arguments);
        };

        obj.fake = function () {
            return sandbox.fake.apply(null, arguments);
        };

        obj.define = function () {
            return sandbox.define.apply(null, arguments);
        };

        obj.replace = function () {
            return sandbox.replace.apply(null, arguments);
        };

        obj.replaceSetter = function () {
            return sandbox.replaceSetter.apply(null, arguments);
        };

        obj.replaceGetter = function () {
            return sandbox.replaceGetter.apply(null, arguments);
        };

        if (sandbox.clock) {
            obj.clock = sandbox.clock;
        }

        obj.match = match;

        return obj;
    };

    sandbox.mock = function mock() {
        const m = sinonMock__default.default.apply(null, arguments);

        addToCollection(m);

        return m;
    };

    sandbox.reset = function reset() {
        applyOnEach(collection, "reset");
        applyOnEach(collection, "resetHistory");
    };

    sandbox.resetBehavior = function resetBehavior() {
        applyOnEach(collection, "resetBehavior");
    };

    sandbox.resetHistory = function resetHistory() {
        function privateResetHistory(f) {
            const method = f.resetHistory || f.reset;
            if (method) {
                method.call(f);
            }
        }

        forEach(collection, privateResetHistory);
    };

    sandbox.restore = function restore() {
        if (arguments.length) {
            throw new Error(
                "sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()",
            );
        }

        reverse(collection);
        applyOnEach(collection, "restore");
        collection = [];

        forEach(fakeRestorers, function (restorer) {
            restorer();
        });
        fakeRestorers.length = 0;

        sandbox.restoreContext();
    };

    sandbox.restoreContext = function restoreContext() {
        if (!sandbox.injectedKeys) {
            return;
        }

        forEach(sandbox.injectedKeys, function (injectedKey) {
            delete sandbox.injectInto[injectedKey];
        });

        sandbox.injectedKeys.length = 0;
    };

    /**
     * Creates a restorer function for the property
     *
     * @param {object|Function} object
     * @param {string} property
     * @param {boolean} forceAssignment
     * @returns {Function} restorer function
     */
    function getFakeRestorer(object, property, forceAssignment = false) {
        const descriptor = getPropertyDescriptor__default.default(object, property);
        const value = forceAssignment && object[property];

        function restorer() {
            if (forceAssignment) {
                object[property] = value;
            } else if (descriptor?.isOwn) {
                Object.defineProperty(object, property, descriptor);
            } else {
                delete object[property];
            }
        }

        restorer.object = object;
        restorer.property = property;
        return restorer;
    }

    function verifyNotReplaced(object, property) {
        forEach(fakeRestorers, function (fakeRestorer) {
            if (
                fakeRestorer.object === object &&
                fakeRestorer.property === property
            ) {
                throw new TypeError(
                    `Attempted to replace ${property} which is already replaced`,
                );
            }
        });
    }

    /**
     * Replace an existing property
     *
     * @param {object|Function} object
     * @param {string} property
     * @param {*} replacement a fake, stub, spy or any other value
     * @returns {*}
     */
    sandbox.replace = function replace(object, property, replacement) {
        const descriptor = getPropertyDescriptor__default.default(object, property);
        checkForValidArguments(descriptor, property, replacement);
        throwOnAccessors(descriptor);
        verifySameType(object, property, replacement);

        verifyNotReplaced(object, property);

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
        const descriptor = getPropertyDescriptor__default.default(object, property);
        checkForValidArguments(descriptor, property, replacement);
        verifySameType(object, property, replacement);

        verifyNotReplaced(object, property);

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property, true));

        object[property] = replacement;

        return replacement;
    };

    sandbox.define = function define(object, property, value) {
        const descriptor = getPropertyDescriptor__default.default(object, property);

        if (descriptor) {
            throw new TypeError(
                `Cannot define the already existing property ${valueToString(
                    property,
                )}. Perhaps you meant sandbox.replace()?`,
            );
        }

        if (typeof value === "undefined") {
            throw new TypeError("Expected value argument to be defined");
        }

        verifyNotReplaced(object, property);

        // store a function for restoring the defined property
        push(fakeRestorers, getFakeRestorer(object, property));

        object[property] = value;

        return value;
    };

    sandbox.replaceGetter = function replaceGetter(
        object,
        property,
        replacement,
    ) {
        const descriptor = getPropertyDescriptor__default.default(object, property);

        if (typeof descriptor === "undefined") {
            throw new TypeError(
                `Cannot replace non-existent property ${valueToString(
                    property,
                )}`,
            );
        }

        if (typeof replacement !== "function") {
            throw new TypeError(
                "Expected replacement argument to be a function",
            );
        }

        if (typeof descriptor.get !== "function") {
            throw new Error("`object.property` is not a getter");
        }

        verifyNotReplaced(object, property);

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property));

        Object.defineProperty(object, property, {
            get: replacement,
            configurable: isPropertyConfigurable__default.default(object, property),
        });

        return replacement;
    };

    sandbox.replaceSetter = function replaceSetter(
        object,
        property,
        replacement,
    ) {
        const descriptor = getPropertyDescriptor__default.default(object, property);

        if (typeof descriptor === "undefined") {
            throw new TypeError(
                `Cannot replace non-existent property ${valueToString(
                    property,
                )}`,
            );
        }

        if (typeof replacement !== "function") {
            throw new TypeError(
                "Expected replacement argument to be a function",
            );
        }

        if (typeof descriptor.set !== "function") {
            throw new Error("`object.property` is not a setter");
        }

        verifyNotReplaced(object, property);

        // store a function for restoring the replaced property
        push(fakeRestorers, getFakeRestorer(object, property));

        // eslint-disable-next-line accessor-pairs
        Object.defineProperty(object, property, {
            set: replacement,
            configurable: isPropertyConfigurable__default.default(object, property),
        });

        return replacement;
    };

    function commonPostInitSetup(args, spy, isStub) {
        const [object, property, types] = args;

        const isSpyingOnEntireObject =
            typeof property === "undefined" &&
            (typeof object === "object" ||
                (isStub && typeof object === "function"));

        if (isSpyingOnEntireObject) {
            const ownMethods = collectOwnMethods__default.default(spy);

            forEach(ownMethods, function (method) {
                addToCollection(method);
            });
        } else if (Array.isArray(types)) {
            for (const accessorType of types) {
                addToCollection(spy[accessorType]);
            }
        } else {
            addToCollection(spy);
        }

        return spy;
    }

    sandbox.spy = function spy() {
        const createdSpy = spy__default.default.apply(spy__default.default, arguments);
        return commonPostInitSetup(arguments, createdSpy, false);
    };

    sandbox.stub = function stub$1() {
        const createdStub = stub.apply(stub, arguments);
        return commonPostInitSetup(arguments, createdStub, true);
    };

    // eslint-disable-next-line no-unused-vars
    sandbox.fake = function fake(f) {
        const s = sinonFake__default.default.apply(sinonFake__default.default, arguments);

        addToCollection(s);

        return s;
    };

    forEach(Object.keys(sinonFake__default.default), function (key) {
        const fakeBehavior = sinonFake__default.default[key];
        if (typeof fakeBehavior === "function") {
            sandbox.fake[key] = function () {
                const s = fakeBehavior.apply(fakeBehavior, arguments);

                addToCollection(s);

                return s;
            };
        }
    });

    sandbox.useFakeTimers = function useFakeTimers(args) {
        const clock = fakeTimers.useFakeTimers.call(null, args);

        sandbox.clock = clock;
        addToCollection(clock);

        return clock;
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
}

Sandbox.prototype.match = match;

module.exports = Sandbox;
