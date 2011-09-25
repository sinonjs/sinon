/*jslint onevar: false, eqeqeq: false, browser: true*/
/*globals testCase,
          sinon,
          fail,
          assert,
          assertNotNull,
          assertUndefined,
          assertArray,
          assertEquals,
          assertSame,
          assertNotSame,
          assertFunction,
          assertObject,
          assertException,
          assertNoException*/
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

(function () {
    var supportsAjax = typeof XMLHttpRequest != "undefined" || typeof ActiveXObject != "undefined";

    testCase("SinonTestTest", {
        tearDown: function () {
            sinon.config = {};
        },

        "should throw if argument is not a function": function () {
            assertException(function () {
                sinon.test({});
            });
        },

        "should proxy return value": function () {
            var object = {};

            var result = sinon.test(function () {
                return object;
            })();

            assertSame(object, result);
        },

        "should stub inside sandbox": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.stub(object, "method").returns(object);

                assertSame(object, object.method());
            }).call({});
        },

        "should restore stubs": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.stub(object, "method");
            }).call({});

            assertSame(method, object.method);
        },

        "should throw when method throws": function () {
            var method = function () {};
            var object = { method: method };

            assertException(function () {
                sinon.test(function () {
                    this.stub(object, "method");
                    throw new Error();
                }).call({});
            }, "Error");
        },

        "should restore stub when method throws": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.stub(object, "method");
                    throw new Error();
                }).call({});
            } catch (e) {}

            assertSame(method, object.method);
        },

        "should mock inside sandbox": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.mock(object).expects("method").returns(object);

                assertSame(object, object.method());
            }).call({});
        },

        "should verify mocks": function () {
            var method = function () {};
            var object = { method: method };

            assertException(function () {
                sinon.test(function () {
                    this.mock(object).expects("method");
                }).call({});
            }, "ExpectationError");

            assertSame(method, object.method);
        },

        "should restore mocks": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.mock(object).expects("method");
                }).call({});
            } catch (e) {}

            assertSame(method, object.method);
        },

        "should restore mock when method throws": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.mock(object).expects("method").never();
                    object.method();
                }).call({});
            } catch (e) {}

            assertSame(method, object.method);
        },

        "should append helpers after normal arguments": function () {
            var object = { method: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["stub", "mock"]
            };

            sinon.test(function (obj, stub, mock) {
                mock(object).expects("method").once();
                object.method();

                assertSame(object, obj);
            })(object);
        },

        "should maintain the this value": function () {
            var testCase = {
                someTest: sinon.test(function (obj, stub, mock) {
                    return this;
                })
            };

            assertSame(testCase, testCase.someTest());
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

    function assertFakeServer(server) {
        assertObject(server);
        assertArray(server.requests);
        assertFunction(server.respondWith);
    }

    function assertClock(clock) {
        assertObject(clock);
        assertFunction(clock.tick);
        assertFunction(clock.setTimeout);
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

    testCase("ConfigurableTestWithSandboxTest", {
        tearDown: function () {
            sinon.config = {};
        },

        "should yield stub, mock as arguments": function () {
            var stubbed, mocked;
            var obj = { meth: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["stub", "mock"]
            };

            sinon.test(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assertEquals(2, arguments.length);
            })();

            assertStub(stubbed);
            assertMock(mocked);
        },

        "should yield spy, stub, mock as arguments": function () {
            var spied, stubbed, mocked;
            var obj = { meth: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["spy", "stub", "mock"]
            };

            sinon.test(function (spy, stub, mock) {
                spied = spy(obj, "meth");
                spied.restore();
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assertEquals(3, arguments.length);
            })();

            assertSpy(spied);
            assertStub(stubbed);
            assertMock(mocked);
        },

        "should not yield server when not faking xhr": function () {
            var stubbed, mocked;
            var obj = { meth: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["server", "stub", "mock"],
                useFakeServer: false
            };

            sinon.test(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assertEquals(2, arguments.length);
            })();

            assertStub(stubbed);
            assertMock(mocked);
        },

        "should yield server when faking xhr": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var stubbed, mocked, server;
            var obj = { meth: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["server", "stub", "mock"]
            };

            sinon.test(function (serv, stub, mock) {
                server = serv;
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assertEquals(3, arguments.length);
            })();

            assertFakeServer(server);
            assertStub(stubbed);
            assertMock(mocked);
        },

        "should use serverWithClock when faking xhr": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var server;

            sinon.config = {
                injectIntoThis: false,
                properties: ["server"],
                useFakeServer: sinon.fakeServerWithClock
            };

            sinon.test(function (serv) {
                server = serv;
            })();

            assertFakeServer(server);
            assert(sinon.fakeServerWithClock.isPrototypeOf(server));
        },

        "should yield clock when faking timers": function () {
            var clock;

            sinon.config = {
                injectIntoThis: false,
                properties: ["clock"]
            };

            sinon.test(function (c) {
                clock = c;
                assertEquals(1, arguments.length);
            })();

            assertClock(clock);
        },

        "should fake specified timers": function () {
            var props;

            sinon.config = {
                injectIntoThis: false,
                properties: ["clock"],
                useFakeTimers: ["Date", "setTimeout"]
            };

            sinon.test(function (c) {
                props = {
                    clock: c,
                    Date: Date,
                    setTimeout: setTimeout,
                    clearTimeout: clearTimeout,
                    setInterval: setInterval,
                    clearInterval: clearInterval
                };
            })();

            assertNotSame(sinon.timers.Date, props.Date);
            assertNotSame(sinon.timers.setTimeout, props.setTimeout);
            assertSame(sinon.timers.clearTimeout, props.clearTimeout);
            assertSame(sinon.timers.setInterval, props.setInterval);
            assertSame(sinon.timers.clearInterval, props.clearInterval);
        },

        "should inject properties into test case": function () {
            var testCase = boundTestCase();

            sinon.config = {
                properties: ["clock"]
            };

            sinon.test(testCase.fn).call(testCase);

            assertSame(testCase, testCase.self);
            assertEquals(0, testCase.args.length);
            assertClock(testCase.clock);
            assertUndefined(testCase.spy);
            assertUndefined(testCase.stub);
            assertUndefined(testCase.mock);
        },

        "should inject properties into object": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var testCase = boundTestCase();
            var obj = {};

            sinon.config = {
                injectIntoThis: false,
                injectInto: obj,
                properties: ["server", "clock", "spy", "stub", "mock", "requests"]
            };

            sinon.test(testCase.fn).call(testCase);

            assertEquals(0, testCase.args.length);
            assertUndefined(testCase.server);
            assertUndefined(testCase.clock);
            assertUndefined(testCase.spy);
            assertUndefined(testCase.stub);
            assertUndefined(testCase.mock);
            assertUndefined(testCase.requests);
            assertFakeServer(obj.server);
            assertClock(obj.clock);
            assertFunction(obj.spy);
            assertFunction(obj.stub);
            assertFunction(obj.mock);
            assertArray(obj.requests);
        },

        "should inject functions into test case by default": function () {
            var testCase = boundTestCase();
            var obj = {};

            sinon.test(testCase.fn).call(testCase);

            assertEquals(0, testCase.args.length);
            assertFunction(testCase.spy);
            assertFunction(testCase.stub);
            assertFunction(testCase.mock);
            assertObject(testCase.clock);
        },

        "should inject server and clock when only enabling them": function () {
            if (!supportsAjax) {
                jstestdriver.console.log("Ajax unavailable, aborting");
                return;
            }

            var testCase = boundTestCase();
            var obj = {};

            sinon.config = {
                useFakeTimers: true,
                useFakeServer: true
            };

            sinon.test(testCase.fn).call(testCase);

            assertEquals(0, testCase.args.length);
            assertFunction(testCase.spy);
            assertFunction(testCase.stub);
            assertFunction(testCase.mock);
            assertFakeServer(testCase.server);
            assertArray(testCase.requests);
            assertClock(testCase.clock);
            assertUndefined(testCase.sandbox);
        },

        "should inject sandbox": function () {
            var testCase = boundTestCase();
            var obj = {};

            sinon.config = {
                properties: ["sandbox", "spy"]
            };

            sinon.test(testCase.fn).call(testCase);

            assertEquals(0, testCase.args.length);
            assertFunction(testCase.spy);
            assertObject(testCase.sandbox);
        },

        "should use sinon.test to fake time": function () {
            sinon.config = {
                useFakeTimers: true
            };

            var called;

            var testCase = {
                test: sinon.test(function () {
                    var spy = this.spy();
                    setTimeout(spy, 19);
                    this.clock.tick(19);

                    called = spy.called;
                })
            };

            testCase.test();

            assert(called);
        }
    });
}());
