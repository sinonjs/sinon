"use strict";

var collectOwnMethods = require("./collect-own-methods");
var sinonMatch = require("./match");
var sinonAssert = require("./assert");
var sinonClock = require("./util/fake_timers");
var sinonMock = require("./mock");
var sinonSpy = require("./spy");
var sinonStub = require("./stub");
var valueToString = require("./util/core/value-to-string");
var fakeServer = require("nise").fakeServer;
var fakeXhr = require("nise").fakeXhr;
var fakeServerWithClock = require("nise").fakeServerWithClock;
var usePromiseLibrary = require("./util/core/use-promise-library");

// cache original versions, to prevent issues when they are stubbed in user space
var push = Array.prototype.push;
var filter = Array.prototype.filter;
var forEach = Array.prototype.filter;

function applyOnEach(fakes, method) {
    var matchingFakes = filter.call(fakes, function (fake) {
        return typeof fake[method] === "function";
    });

    forEach.call(matchingFakes, function (fake) {
        fake[method]();
    });
}

function Sandbox() {
    var sandbox = this;
    var collection = [];
    var promiseLib;

    sandbox.serverPrototype = fakeServer;

    // this is for testing only
    sandbox.getFakes = function getFakes() {
        return collection;
    };

    sandbox.createStubInstance = function createStubInstance(constructor) {
        if (typeof constructor !== "function") {
            throw new TypeError("The constructor should be a function.");
        }
        return this.stub.call(this, Object.create(constructor.prototype));
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

        if (sandbox.clock) {
            obj.clock = sandbox.clock;
        }

        if (sandbox.server) {
            obj.server = sandbox.server;
            obj.requests = sandbox.server.requests;
        }

        obj.match = sinonMatch;

        return obj;
    };

    sandbox.mock = function mock() {
        var m = sinonMock.apply(null, arguments);

        push.call(collection, m);

        return m;
    };

    sandbox.reset = function reset() {
        applyOnEach(collection, "reset");
    };

    sandbox.resetBehavior = function resetBehavior() {
        applyOnEach(collection, "resetBehavior");
    };

    sandbox.resetHistory = function resetHistory() {
        forEach.call(collection, function (fake) {
            var method = fake.resetHistory || fake.reset;

            if (method) {
                method.call(fake);
            }
        });
    };

    sandbox.restore = function restore() {
        if (arguments.length) {
            throw new Error("sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()");
        }

        applyOnEach(collection, "restore");
        collection = [];

        sandbox.restoreContext();
    };

    sandbox.restoreContext = function restoreContext() {
        var injectedKeys = sandbox.injectedKeys;
        var injectInto = sandbox.injectInto;

        if (!injectedKeys) {
            return;
        }

        injectedKeys.forEach(function (injectedKey) {
            delete injectInto[injectedKey];
        });

        injectedKeys = [];
    };

    sandbox.spy = function spy() {
        var s = sinonSpy.apply(sinonSpy, arguments);

        push.call(collection, s);

        return s;
    };

    sandbox.stub = function stub(object, property) {
        if (object && typeof property !== "undefined"
            && !(property in object)) {
            throw new TypeError("Cannot stub non-existent own property " + valueToString(property));
        }

        var stubbed = sinonStub.apply(null, arguments);
        var isStubbingEntireObject = typeof property === "undefined" && typeof object === "object";

        if (isStubbingEntireObject) {
            var ownMethods = collectOwnMethods(stubbed);

            ownMethods.forEach(function (method) {
                push.call(collection, method);
            });

            usePromiseLibrary(promiseLib, ownMethods);
        } else {
            push.call(collection, stubbed);
            usePromiseLibrary(promiseLib, stubbed);
        }

        return stubbed;
    };

    sandbox.useFakeTimers = function useFakeTimers(args) {
        var clock = sinonClock.useFakeTimers.call(null, args);

        sandbox.clock = clock;
        push.call(collection, clock);

        return clock;
    };

    sandbox.verify = function verify() {
        applyOnEach(collection, "verify");
    };

    sandbox.verifyAndRestore = function verifyAndRestore() {
        var exception;

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

    sandbox.useFakeServer = function useFakeServer() {
        var proto = sandbox.serverPrototype || fakeServer;

        if (!proto || !proto.create) {
            return null;
        }

        sandbox.server = proto.create();
        push.call(collection, sandbox.server);

        return sandbox.server;
    };

    sandbox.useFakeXMLHttpRequest = function useFakeXMLHttpRequest() {
        var xhr = fakeXhr.useFakeXMLHttpRequest();
        return push.call(collection, xhr);
    };

    sandbox.usingPromise = function usingPromise(promiseLibrary) {
        promiseLib = promiseLibrary;
        collection.promiseLibrary = promiseLibrary;

        return sandbox;
    };
}

Sandbox.prototype.assert = sinonAssert;
Sandbox.prototype.match = sinonMatch;

module.exports = Sandbox;
