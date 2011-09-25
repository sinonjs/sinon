/*jslint onevar: false*/
/*global testCase
         XMLHttpRequest
         ActiveXObject
         window
         setTimeout
         sinon
         assert
         assertNull
         assertNotNull
         assertUndefined
         assertArray
         assertFalse
         assertEquals
         assertObject
         assertSame
         assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../test_case_shim");
    var sinon = require("../../lib/sinon");
}

(function (global) {
    var supportsAjax = typeof XMLHttpRequest != "undefined" || typeof ActiveXObject != "undefined";

    testCase("SandboxTest", {
        "should be object": function () {
            assertObject(sinon.sandbox);
        },

        "should inherit collection": function () {
            assert(sinon.collection.isPrototypeOf(sinon.sandbox));
        },

        "should create sandboxes": function () {
            var sandbox = sinon.sandbox.create();

            assertObject(sandbox);
            assert(sinon.sandbox.isPrototypeOf(sandbox));
        }
    });

    testCase("SandboxUseFakeTimersTest", {
        setUp: function () {
            this.sandbox = sinon.create(sinon.sandbox);
        },

        tearDown: function () {
            this.sandbox.clock.restore();
        },

        "should return clock object": function () {
            var clock = this.sandbox.useFakeTimers();

            assertObject(clock);
            assertFunction(clock.tick);
        },

        "should expose clock property": function () {
            this.sandbox.useFakeTimers();

            assertObject(this.sandbox.clock);
            assertFunction(this.sandbox.clock.tick);
        },

        "should use restorable clock": function () {
            this.sandbox.useFakeTimers();

            assertFunction(this.sandbox.clock.restore);
        },

        "should pass arguments to sinon.useFakeTimers": sinon.test(function () {
            this.stub(sinon, "useFakeTimers").returns({ restore: function () {} });
            this.sandbox.useFakeTimers("Date", "setTimeout");
            this.sandbox.useFakeTimers("setTimeout", "clearTimeout", "setInterval");

            assert(sinon.useFakeTimers.calledWith("Date", "setTimeout"));
            assert(sinon.useFakeTimers.calledWith("setTimeout", "clearTimeout", "setInterval"));
        }),

        "should add clock to fake collection": function () {
            this.sandbox.useFakeTimers();
            this.sandbox.restore();

            assertSame(sinon.timers.setTimeout, setTimeout);
        }
    });

    var globalXHR = global.XMLHttpRequest;
    var globalAXO = global.ActiveXObject;

    if (globalXHR || globalAXO) {
        testCase("SandboxUseFakeXMLHttpRequestTest", {
            setUp: function () {
                this.sandbox = sinon.create(sinon.sandbox);
            },

            tearDown: function () {
                this.sandbox.restore();
            },

            "should call sinon.useFakeXMLHttpRequest": sinon.test(function () {
                this.stub(sinon, "useFakeXMLHttpRequest").returns({ restore: function () {} });
                this.sandbox.useFakeXMLHttpRequest();

                assert(sinon.useFakeXMLHttpRequest.called);
            }),

            "should add fake xhr to fake collection": function () {
                this.sandbox.useFakeXMLHttpRequest();
                this.sandbox.restore();

                assertSame(globalXHR, global.XMLHttpRequest);
                assertSame(globalAXO, global.ActiveXObject);
            }
        });

        testCase("SandboxUseServer", {
            setUp: function () {
                this.sandbox = sinon.create(sinon.sandbox);
            },

            tearDown: function () {
                this.sandbox.restore();
            },

            "should return server": function () {
                var server = this.sandbox.useFakeServer();

                assertObject(server);
                assertFunction(server.restore);
            },

            "should expose server property": function () {
                var server = this.sandbox.useFakeServer();

                assertSame(server, this.sandbox.server);
            },

            "should create server": function () {
                var server = this.sandbox.useFakeServer();

                assert(sinon.fakeServer.isPrototypeOf(server));
            },

            "should create server with cock": function () {
                this.sandbox.serverPrototype = sinon.fakeServerWithClock;
                var server = this.sandbox.useFakeServer();

                assert(sinon.fakeServerWithClock.isPrototypeOf(server));
            },

            "should add server to fake collection": function () {
                this.sandbox.useFakeServer();
                this.sandbox.restore();

                assertSame(globalXHR, global.XMLHttpRequest);
                assertSame(globalAXO, global.ActiveXObject);
            }
        });
    }

    testCase("SandboxInjectTest", {
        setUp: function () {
            this.obj = {};
            this.sandbox = sinon.create(sinon.sandbox);
        },

        tearDown: function () {
            this.sandbox.restore();
        },

        "should inject spy, stub, mock": function () {
            this.sandbox.inject(this.obj);

            assertFunction(this.obj.spy);
            assertFunction(this.obj.stub);
            assertFunction(this.obj.mock);
        },

        "should not define clock, server and requests objects": function () {
            this.sandbox.inject(this.obj);

            assertFalse("clock" in this.obj);
            assertFalse("server" in this.obj);
            assertFalse("requests" in this.obj);
        },

        "should define clock when using fake time": function () {
            this.sandbox.useFakeTimers();
            this.sandbox.inject(this.obj);

            assertFunction(this.obj.spy);
            assertFunction(this.obj.stub);
            assertFunction(this.obj.mock);
            assertObject(this.obj.clock);
            assertFalse("server" in this.obj);
            assertFalse("requests" in this.obj);
        },

        "should define server and requests when using fake time": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            this.sandbox.useFakeServer();
            this.sandbox.inject(this.obj);

            assertFunction(this.obj.spy);
            assertFunction(this.obj.stub);
            assertFunction(this.obj.mock);
            assertFalse("clock" in this.obj);
            assertObject(this.obj.server);
            assertEquals([], this.obj.requests);
        },

        "should define all possible fakes": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            this.sandbox.useFakeServer();
            this.sandbox.useFakeTimers();
            this.sandbox.inject(this.obj);

            var spy = sinon.spy();
            setTimeout(spy, 10);

            this.sandbox.clock.tick(10);
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

            assertFunction(this.obj.spy);
            assertFunction(this.obj.stub);
            assertFunction(this.obj.mock);
            assert(spy.called);
            assertObject(this.obj.server);
            assertEquals([xhr], this.obj.requests);
        },

        "should return object": function () {
            var injected = this.sandbox.inject({});

            assertObject(injected);
            assertFunction(injected.spy);
        }
    });

    function assertSpy(obj) {
        assertNotNull(obj);
        assertFunction(obj.calledWith);
        assertUndefined(obj.returns);
    }

    function assertStub(obj) {
        assertNotNull(obj);
        assertFunction(obj.calledWith);
        assertFunction(obj.returns);
    }

    function assertMock(obj) {
        assertObject(obj);
        assertFunction(obj.verify);
        assertFunction(obj.expects);
    }

    function assertFakeServerWithClock(testCase, obj) {
        assertEquals(testCase.fakeServer, obj);
        assert(sinon.fakeServer.create.calledOn(sinon.fakeServerWithClock));
    }

    function boundTestCase() {
        var properties = {
            fn: function () {
                properties.self = this;
                properties.args = arguments;
                properties.spy = this.spy;
                properties.stub = this.stub;
                properties.mock = this.mock;
                properties.clock = this.clock;
                properties.server = this.server;
                properties.requests = this.requests;
                properties.sandbox = this.sandbox;
            }
        };

        return properties;
    }

    testCase("ConfigurableSandboxTest", {
        setUp: function () {
            this.requests = [];
            this.fakeServer = { requests: this.requests };
            this.clock = {};

            sinon.stub(sinon, "useFakeTimers").returns(this.clock);

            if (sinon.fakeServer) {
                sinon.stub(sinon.fakeServer, "create").returns(this.fakeServer);
            }
        },

        tearDown: function () {
            sinon.useFakeTimers.restore();

            if (sinon.fakeServer) {
                sinon.fakeServer.create.restore();
            }
        },

        "should yield stub, mock as arguments": function () {
            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["stub", "mock"]
            }));

            assertEquals(2, sandbox.args.length);
            assertStub(sandbox.args[0]());
            assertMock(sandbox.args[1]({}));
        },

        "should yield spy, stub, mock as arguments": function () {
            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["spy", "stub", "mock"]
            }));

            assertSpy(sandbox.args[0]());
            assertStub(sandbox.args[1]());
            assertMock(sandbox.args[2]({}));
        },

        "should not yield server when not faking xhr": function () {
            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["server", "stub", "mock"],
                useFakeServer: false
            }));

            assertEquals(2, sandbox.args.length);
            assertStub(sandbox.args[0]());
            assertMock(sandbox.args[1]({}));
        },

        "should yield server when faking xhr": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["server", "stub", "mock"]
            }));

            assertEquals(3, sandbox.args.length);
            assertEquals(this.fakeServer, sandbox.args[0]);
            assertStub(sandbox.args[1]());
            assertMock(sandbox.args[2]({}));
        },

        "should use serverWithClock when faking xhr": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["server"],
                useFakeServer: sinon.fakeServerWithClock
            }));

            assertFakeServerWithClock(this, sandbox.args[0]);
        },

        "should yield clock when faking timers": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["server", "clock"]
            }));

            assertSame(this.fakeServer, sandbox.args[0]);
            assertSame(this.clock, sandbox.args[1]);
        },

        "should fake specified timers": function () {
            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectIntoThis: false,
                properties: ["clock"],
                useFakeTimers: ["Date", "setTimeout"]
            }));

            assert(sinon.useFakeTimers.calledWith("Date", "setTimeout"));
        },

        "should inject properties into object": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var object = {};

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                properties: ["server", "clock"],
                injectInto: object
            }));

            assertEquals(0, sandbox.args.length);
            assertEquals(this.fakeServer, object.server);
            assertEquals(this.clock, object.clock);
            assertUndefined(object.spy);
            assertUndefined(object.stub);
            assertUndefined(object.mock);
            assertUndefined(object.requests);
        },

        "should inject server and clock when only enabling them": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var object = {};

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                injectInto: object,
                useFakeTimers: true,
                useFakeServer: true
            }));

            assertEquals(0, sandbox.args.length);
            assertEquals(this.fakeServer, object.server);
            assertEquals(this.clock, object.clock);
            assertFunction(object.spy);
            assertFunction(object.stub);
            assertFunction(object.mock);
            assertArray(object.requests);
            assertUndefined(object.sandbox);
        },

        "should inject sandbox": function () {
            var object = {};

            var sandbox = sinon.sandbox.create(sinon.getConfig({
                properties: ["sandbox", "spy"],
                injectInto: object
            }));

            assertEquals(0, sandbox.args.length);
            assertFunction(object.spy);
            assertObject(object.sandbox);
        }
    });
}(typeof global == "object" ? global : this));
