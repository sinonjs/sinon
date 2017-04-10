"use strict";

var referee = require("referee");
var samsam = require("samsam");
var assert = referee.assert;
var refute = referee.refute;
var fakeXhr = require("../lib/sinon/util/fake_xml_http_request");
var fakeServerWithClock = require("../lib/sinon/util/fake_server_with_clock");
var fakeServer = require("../lib/sinon/util/fake_server");
var sinonSandbox = require("../lib/sinon/sandbox");
var sinonCollection = require("../lib/sinon/collection");
var sinonSpy = require("../lib/sinon/spy");
var sinonStub = require("../lib/sinon/stub");
var sinonConfig = require("../lib/sinon/util/core/get-config");
var sinonMatch = require("../lib/sinon/match");
var sinonAssert = require("../lib/sinon/assert");
var sinonClock = require("../lib/sinon/util/fake_timers");

var supportsAjax = typeof XMLHttpRequest !== "undefined" || typeof ActiveXObject !== "undefined";
var globalXHR = global.XMLHttpRequest;
var globalAXO = global.ActiveXObject;

if (!assert.stub) {
    require("./test-helper");
}

referee.add("fakeServerWithClock", {
    assert: function (obj, expected) {
        return samsam.deepEqual(obj, expected) &&
            fakeServer.create.calledOn(fakeServerWithClock);
    },
    assertMessage: "Expected object ${0} to be a fake server with clock"
});

describe("sinonSandbox", function () {
    it("inherits collection", function () {
        assert(sinonCollection.isPrototypeOf(sinonSandbox));
    });

    it("creates sandboxes", function () {
        var sandbox = sinonSandbox.create();

        assert.isObject(sandbox);
        assert(sinonSandbox.isPrototypeOf(sandbox));
    });

    it("exposes match", function () {
        var sandbox = sinonSandbox.create();

        assert.same(sandbox.match, sinonMatch);
    });

    it("exposes assert", function () {
        var sandbox = sinonSandbox.create();

        assert.same(sandbox.assert, sinonAssert);
    });

    describe(".useFakeTimers", function () {
        beforeEach(function () {
            this.sandbox = Object.create(sinonSandbox);
        });

        afterEach(function () {
            this.sandbox.restore();
        });

        it("returns clock object", function () {
            var clock = this.sandbox.useFakeTimers();

            assert.isObject(clock);
            assert.isFunction(clock.tick);
        });

        it("exposes clock property", function () {
            this.sandbox.useFakeTimers();

            assert.isObject(this.sandbox.clock);
            assert.isFunction(this.sandbox.clock.tick);
        });

        it("uses restorable clock", function () {
            this.sandbox.useFakeTimers();

            assert.clock(this.sandbox.clock);
        });

        it("passes arguments to sinon.useFakeTimers", function () {
            var useFakeTimersStub = sinonStub(sinonClock, "useFakeTimers").returns({});

            this.sandbox.useFakeTimers("Date", "setTimeout");
            this.sandbox.useFakeTimers("setTimeout", "clearTimeout", "setInterval");

            assert(useFakeTimersStub.calledWith("Date", "setTimeout"));
            assert(useFakeTimersStub.calledWith("setTimeout", "clearTimeout", "setInterval"));

            useFakeTimersStub.restore();
        });

        it("restores the fakeTimer clock created by the sandbox when the sandbox is restored", function () {
            var originalSetTimeout = setTimeout;

            this.sandbox.useFakeTimers();
            refute.same(setTimeout, originalSetTimeout, "fakeTimers installed");

            this.sandbox.restore();

            assert.same(setTimeout, originalSetTimeout, "fakeTimers restored");
        });
    });

    describe(".usingPromise", function () {
        beforeEach(function () {
            this.sandbox = Object.create(sinonSandbox);
        });

        afterEach(function () {
            this.sandbox.restore();
        });

        it("must be a function", function () {

            assert.isFunction(this.sandbox.usingPromise);
        });

        it("must return the sandbox", function () {
            var mockPromise = {};

            var actual = this.sandbox.usingPromise(mockPromise);

            assert.same(actual, this.sandbox);
        });

        it("must set all stubs created from sandbox with mockPromise", function () {

            var resolveValue = {};
            var mockPromise = {
                resolve: sinonStub.create().resolves(resolveValue)
            };

            this.sandbox.usingPromise(mockPromise);
            var stub = this.sandbox.stub().resolves();

            return stub()
                .then(function (action) {

                    assert.same(resolveValue, action);
                    assert(mockPromise.resolve.calledOnce);
                });
        });

        it("must set all stubs created from sandbox with mockPromise", function () {

            var resolveValue = {};
            var mockPromise = {
                resolve: sinonStub.create().resolves(resolveValue)
            };
            var stubbedObject = {
                stubbedMethod: function () {
                    return;
                }
            };

            this.sandbox.usingPromise(mockPromise);
            this.sandbox.stub(stubbedObject);
            stubbedObject.stubbedMethod.resolves({});

            return stubbedObject.stubbedMethod()
                .then(function (action) {

                    assert.same(resolveValue, action);
                    assert(mockPromise.resolve.calledOnce);
                });
        });
    });

    // These were not run in browsers before, as we were only testing in node
    if (typeof window !== "undefined") {
        describe("fake XHR/server", function () {
            describe(".useFakeXMLHttpRequest", function () {
                beforeEach(function () {
                    this.sandbox = sinonSandbox.create();
                });

                afterEach(function () {
                    this.sandbox.restore();
                });

                it("calls sinon.useFakeXMLHttpRequest", function () {
                    this.sandbox.stub(fakeXhr, "useFakeXMLHttpRequest").returns({ restore: function () {} });
                    this.sandbox.useFakeXMLHttpRequest();

                    assert(fakeXhr.useFakeXMLHttpRequest.called);
                });

                it("doesn't secretly use useFakeServer", function () {
                    this.sandbox.stub(fakeServer, "create").returns({ restore: function () {} });
                    this.sandbox.useFakeXMLHttpRequest();

                    assert(fakeServer.create.notCalled);
                });

                it("adds fake xhr to fake collection", function () {
                    this.sandbox.useFakeXMLHttpRequest();
                    this.sandbox.restore();

                    assert.same(global.XMLHttpRequest, globalXHR);
                    assert.same(global.ActiveXObject, globalAXO);
                });
            });

            describe(".useFakeServer", function () {
                beforeEach(function () {
                    this.sandbox = Object.create(sinonSandbox);
                });

                afterEach(function () {
                    this.sandbox.restore();
                });

                it("returns server", function () {
                    var server = this.sandbox.useFakeServer();

                    assert.isObject(server);
                    assert.isFunction(server.restore);
                });

                it("exposes server property", function () {
                    var server = this.sandbox.useFakeServer();

                    assert.same(this.sandbox.server, server);
                });

                it("creates server", function () {
                    var server = this.sandbox.useFakeServer();

                    assert(fakeServer.isPrototypeOf(server));
                });

                it("creates server with cock", function () {
                    this.sandbox.serverPrototype = fakeServerWithClock;
                    var server = this.sandbox.useFakeServer();

                    assert(fakeServerWithClock.isPrototypeOf(server));
                });

                it("adds server to fake collection", function () {
                    this.sandbox.useFakeServer();
                    this.sandbox.restore();

                    assert.same(global.XMLHttpRequest, globalXHR);
                    assert.same(global.ActiveXObject, globalAXO);
                });
            });
        });
    }

    describe(".inject", function () {
        beforeEach(function () {
            this.obj = {};
            this.sandbox = sinonSandbox.create();
        });

        afterEach(function () {
            this.sandbox.restore();
        });

        it("injects spy, stub, mock", function () {
            this.sandbox.inject(this.obj);

            assert.isFunction(this.obj.spy);
            assert.isFunction(this.obj.stub);
            assert.isFunction(this.obj.mock);
        });

        it("does not define clock, server and requests objects", function () {
            this.sandbox.inject(this.obj);

            assert.isFalse("clock" in this.obj);
            assert.isFalse("server" in this.obj);
            assert.isFalse("requests" in this.obj);
        });

        it("defines clock when using fake time", function () {
            this.sandbox.useFakeTimers();
            this.sandbox.inject(this.obj);

            assert.isFunction(this.obj.spy);
            assert.isFunction(this.obj.stub);
            assert.isFunction(this.obj.mock);
            assert.isObject(this.obj.clock);
            assert.isFalse("server" in this.obj);
            assert.isFalse("requests" in this.obj);
        });

        it("should return object", function () {
            var injected = this.sandbox.inject({});

            assert.isObject(injected);
            assert.isFunction(injected.spy);
        });

        if (supportsAjax) {
            describe("ajax options", function () {

                it("defines server and requests when using fake time", function () {
                    this.sandbox.useFakeServer();
                    this.sandbox.inject(this.obj);

                    assert.isFunction(this.obj.spy);
                    assert.isFunction(this.obj.stub);
                    assert.isFunction(this.obj.mock);
                    assert.isFalse("clock" in this.obj);
                    assert.isObject(this.obj.server);
                    assert.equals(this.obj.requests, []);
                });

                it("should define all possible fakes", function () {
                    this.sandbox.useFakeServer();
                    this.sandbox.useFakeTimers();
                    this.sandbox.inject(this.obj);

                    var spy = sinonSpy();
                    setTimeout(spy, 10);

                    this.sandbox.clock.tick(10);

                    var xhr = window.XMLHttpRequest ?
                                new XMLHttpRequest() :
                                new ActiveXObject("Microsoft.XMLHTTP"); //eslint-disable-line no-undef

                    assert.isFunction(this.obj.spy);
                    assert.isFunction(this.obj.stub);
                    assert.isFunction(this.obj.mock);
                    assert(spy.called);
                    assert.isObject(this.obj.server);
                    assert.equals(this.obj.requests, [xhr]);
                });
            });
        }
    });

    describe(".restore", function () {
        it("throws when passed arguments", function () {
            var sandbox = sinonSandbox.create();

            assert.exception(function () {
                sandbox.restore("args");
            }, {
                message: "sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()"
            });
        });
    });

    describe("configurable sandbox", function () {
        beforeEach(function () {
            this.requests = [];
            this.fakeServer = { requests: this.requests };

            this.useFakeTimersSpy = sinonSpy(sinonClock, "useFakeTimers");
            sinonStub(fakeServer, "create").returns(this.fakeServer);
        });

        afterEach(function () {
            this.useFakeTimersSpy.restore();
            fakeServer.create.restore();
        });

        it("yields stub, mock as arguments", function () {
            var sandbox = sinonSandbox.create(sinonConfig({
                injectIntoThis: false,
                properties: ["stub", "mock"]
            }));

            assert.equals(sandbox.args.length, 2);
            assert.stub(sandbox.args[0]());
            assert.mock(sandbox.args[1]({}));

            sandbox.restore();
        });

        it("yields spy, stub, mock as arguments", function () {
            var sandbox = sinonSandbox.create(sinonConfig({
                injectIntoThis: false,
                properties: ["spy", "stub", "mock"]
            }));

            assert.spy(sandbox.args[0]());
            assert.stub(sandbox.args[1]());
            assert.mock(sandbox.args[2]({}));

            sandbox.restore();
        });

        it("does not yield server when not faking xhr", function () {
            var sandbox = sinonSandbox.create(sinonConfig({
                injectIntoThis: false,
                properties: ["server", "stub", "mock"],
                useFakeServer: false
            }));

            assert.equals(sandbox.args.length, 2);
            assert.stub(sandbox.args[0]());
            assert.mock(sandbox.args[1]({}));

            sandbox.restore();
        });

        it("does not inject properties if they are already present", function () {
            var server = function () {};
            var clock = {};
            var spy = false;
            var object = { server: server, clock: clock, spy: spy};
            var sandbox = sinonSandbox.create(sinonConfig({
                properties: ["server", "clock", "spy"],
                injectInto: object
            }));

            assert.same(object.server, server);
            assert.same(object.clock, clock);
            assert.same(object.spy, spy);

            sandbox.restore();
        });

        if (supportsAjax) {
            describe("ajax options", function () {

                it("yields server when faking xhr", function () {
                    var sandbox = sinonSandbox.create(sinonConfig({
                        injectIntoThis: false,
                        properties: ["server", "stub", "mock"]
                    }));

                    assert.equals(sandbox.args.length, 3);
                    assert.equals(sandbox.args[0], this.fakeServer);
                    assert.stub(sandbox.args[1]());
                    assert.mock(sandbox.args[2]({}));

                    sandbox.restore();
                });

                it("uses serverWithClock when faking xhr", function () {
                    var sandbox = sinonSandbox.create(sinonConfig({
                        injectIntoThis: false,
                        properties: ["server"],
                        useFakeServer: fakeServerWithClock
                    }));

                    assert.fakeServerWithClock(sandbox.args[0], this.fakeServer);

                    sandbox.restore();
                });

                it("yields clock when faking timers", function () {
                    var sandbox = sinonSandbox.create(sinonConfig({
                        injectIntoThis: false,
                        properties: ["server", "clock"]
                    }));

                    assert.same(sandbox.args[0], this.fakeServer);
                    assert.clock(sandbox.args[1]);

                    sandbox.restore();
                });

                it("injects properties into object", function () {
                    var object = {};

                    var sandbox = sinonSandbox.create(sinonConfig({
                        properties: ["server", "clock"],
                        injectInto: object
                    }));

                    assert.equals(sandbox.args.length, 0);
                    assert.equals(object.server, this.fakeServer);
                    assert.clock(object.clock);
                    refute.defined(object.spy);
                    refute.defined(object.stub);
                    refute.defined(object.mock);
                    refute.defined(object.requests);

                    sandbox.restore();
                });

                it("should inject server and clock when only enabling them", function () {
                    var object = {};

                    var sandbox = sinonSandbox.create(sinonConfig({
                        injectInto: object,
                        useFakeTimers: true,
                        useFakeServer: true
                    }));

                    assert.equals(sandbox.args.length, 0);
                    assert.equals(object.server, this.fakeServer);
                    assert.clock(object.clock);
                    assert.isFunction(object.spy);
                    assert.isFunction(object.stub);
                    assert.isFunction(object.mock);
                    assert.isArray(object.requests);
                    refute.defined(object.sandbox);

                    sandbox.restore();
                });
            });
        }

        // This is currently testing the internals of useFakeTimers, we could possibly change it to be based on
        // behavior.
        it("fakes specified timers", function () {
            var sandbox = sinonSandbox.create(sinonConfig({
                injectIntoThis: false,
                properties: ["clock"],
                useFakeTimers: ["Date", "setTimeout"]
            }));

            assert(this.useFakeTimersSpy.calledWith("Date", "setTimeout"));

            sandbox.restore();
        });

        it("injects sandbox", function () {
            var object = {};

            var sandbox = sinonSandbox.create(sinonConfig({
                properties: ["sandbox", "spy"],
                injectInto: object
            }));

            assert.equals(sandbox.args.length, 0);
            assert.isFunction(object.spy);
            assert.isObject(object.sandbox);

            sandbox.restore();
        });

        it("injects match", function () {
            var object = {};

            var sandbox = sinonSandbox.create(sinonConfig({
                properties: ["match"],
                injectInto: object
            }));

            assert.same(object.match, sinonMatch);

            sandbox.restore();
        });
    });
});
