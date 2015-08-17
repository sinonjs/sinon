(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("sinon.test", {
        setUp: function () {
            this.boundTestCase = function () {
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
            };
        },

        tearDown: function () {
            sinon.config = {};
        },

        "throws if argument is not a function": function () {
            assert.exception(function () {
                sinon.test({});
            });
        },

        "proxies return value": function () {
            var object = {};

            var result = sinon.test(function () {
                return object;
            })();

            assert.same(result, object);
        },

        "stubs inside sandbox": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.stub(object, "method").returns(object);

                assert.same(object.method(), object);
            }).call({});
        },

        "restores stubs": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.stub(object, "method");
            }).call({});

            assert.same(object.method, method);
        },

        "restores stubs on all object methods": function () {
            var method = function () {};
            var method2 = function () {};
            var object = { method: method, method2: method2 };

            sinon.test(function () {
                this.stub(object);
            }).call({});

            assert.same(object.method, method);
            assert.same(object.method2, method2);
        },

        "throws when method throws": function () {
            var method = function () {};
            var object = { method: method };

            assert.exception(function () {
                sinon.test(function () {
                    this.stub(object, "method");
                    throw new Error();
                }).call({});
            }, "Error");
        },

        "restores stub when method throws": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.stub(object, "method");
                    throw new Error();
                }).call({});
            }

            catch (e) {} // eslint-disable-line no-empty

            assert.same(object.method, method);
        },

        "mocks inside sandbox": function () {
            var method = function () {};
            var object = { method: method };

            sinon.test(function () {
                this.mock(object).expects("method").returns(object);

                assert.same(object.method(), object);
            }).call({});
        },

        "async test with sandbox": function (done) {
            var fakeDone = function (args) {
                assert.equals(args, undefined);
                done(args);
            };

            sinon.test(function (callback) {
                // FIXME: Why does this not finish in node but works fine in browsers?
                // buster.nextTick(function () {
                callback();
                // });
            }).call({}, fakeDone);
        },

        "async test with sandbox using mocha interface": function (done) {
            var it = function (title, fn) {
                var mochaDone = function (args) {
                    assert.equals(args, undefined);
                    done(args);
                };
                if (fn.length) {
                    fn.call(this, mochaDone);
                } else {
                    fn.call(this);
                }
            };
            it("works", sinon.test(function (callback) {
                // FIXME: Why does this not finish in node but works fine in browsers?
                // buster.nextTick(function () {
                callback();
                // });
            }));
        },

        "async test with sandbox and spy": function (done) {
            sinon.test(function (callback) {
                var globalObj = {
                    addOne: function (arg) {
                        return this.addOneInner(arg);
                    },
                    addOneInner: function (arg) {
                        return arg + 1;
                    }
                };
                var addOneInnerSpy = this.spy();
                this.stub(globalObj, "addOneInner", addOneInnerSpy);

                // FIXME: Why does this not finish in node but works fine in browsers?
                // buster.nextTick(function () {
                globalObj.addOne(41);
                assert(addOneInnerSpy.calledOnce);
                callback();
                // });
            }).call({}, done);
        },

        "async test preserves additional args and pass them in correct order": function (done) {
            sinon.test(function (arg1, arg2, callback) {
                assert.equals(arg1, "arg1");
                assert.equals(typeof (arg2), "object");
                assert.equals(typeof (callback), "function");

                callback();
            }).call({}, "arg1", {}, done);
        },

        "verifies mocks": function () {
            var method = function () {};
            var object = { method: method };
            var exception;

            try {
                sinon.test(function () {
                    this.mock(object).expects("method").withExactArgs(1).once();
                    object.method(42);
                }).call({});
            } catch (e) {
                exception = e;
            }

            assert.same(exception.name, "ExpectationError");
            assert.equals(exception.message,
                          "Unexpected call: method(42)\n" +
                          "    Expected method(1) once (never called)");
            assert.same(object.method, method);
        },

        "restores mocks": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.mock(object).expects("method");
                }).call({});
            }
            catch (e) {} // eslint-disable-line no-empty

            assert.same(object.method, method);
        },

        "restores mock when method throws": function () {
            var method = function () {};
            var object = { method: method };

            try {
                sinon.test(function () {
                    this.mock(object).expects("method").never();
                    object.method();
                }).call({});
            }
            catch (e) {} // eslint-disable-line no-empty

            assert.same(object.method, method);
        },

        "appends helpers after normal arguments": function () {
            var object = { method: function () {} };

            sinon.config = {
                injectIntoThis: false,
                properties: ["stub", "mock"]
            };

            sinon.test(function (obj, stub, mock) {
                mock(object).expects("method").once();
                object.method();

                assert.same(obj, object);
            })(object);
        },

        "maintains the this value": function () {
            var testCase = {
                someTest: sinon.test(function () {
                    return this;
                })
            };

            assert.same(testCase.someTest(), testCase);
        },

        "configurable test with sandbox": {
            tearDown: function () {
                sinon.config = {};
            },

            "yields stub, mock as arguments": function () {
                var stubbed, mocked;
                var obj = { meth: function () {} };

                sinon.config = {
                    injectIntoThis: false,
                    properties: ["stub", "mock"]
                };

                sinon.test(function (stub, mock) {
                    stubbed = stub(obj, "meth");
                    mocked = mock(obj);

                    assert.equals(arguments.length, 2);
                })();

                assert.stub(stubbed);
                assert.mock(mocked);
            },

            "yields spy, stub, mock as arguments": function () {
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

                    assert.equals(arguments.length, 3);
                })();

                assert.spy(spied);
                assert.stub(stubbed);
                assert.mock(mocked);
            },

            "does not yield server when not faking xhr": function () {
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

                    assert.equals(arguments.length, 2);
                })();

                assert.stub(stubbed);
                assert.mock(mocked);
            },

            "browser options": {
                requiresSupportFor: {
                    "ajax/browser": typeof XMLHttpRequest !== "undefined" || typeof ActiveXObject !== "undefined"
                },

                "yields server when faking xhr": function () {
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

                        assert.equals(arguments.length, 3);
                    })();

                    assert.fakeServer(server);
                    assert.stub(stubbed);
                    assert.mock(mocked);
                },

                "uses serverWithClock when faking xhr": function () {
                    var server;

                    sinon.config = {
                        injectIntoThis: false,
                        properties: ["server"],
                        useFakeServer: sinon.fakeServerWithClock
                    };

                    sinon.test(function (serv) {
                        server = serv;
                    })();

                    assert.fakeServer(server);
                    assert(sinon.fakeServerWithClock.isPrototypeOf(server));
                },

                "injects properties into object": function () {
                    var obj = {};

                    sinon.config = {
                        injectIntoThis: false,
                        injectInto: obj,
                        properties: ["server", "clock", "spy", "stub", "mock", "requests"]
                    };

                    function testFunction() {
                        assert.equals(arguments.length, 0);
                        refute.defined(this.server);
                        refute.defined(this.clock);
                        refute.defined(this.spy);
                        refute.defined(this.stub);
                        refute.defined(this.mock);
                        refute.defined(this.requests);
                        assert.fakeServer(obj.server);
                        assert.clock(obj.clock);
                        assert.isFunction(obj.spy);
                        assert.isFunction(obj.stub);
                        assert.isFunction(obj.mock);
                        assert.isArray(obj.requests);
                    }

                    sinon.test(testFunction).call({});
                },

                "injects server and clock when only enabling them": function () {
                    sinon.config = {
                        useFakeTimers: true,
                        useFakeServer: true
                    };

                    function testFunction() {
                        assert.equals(arguments.length, 0);
                        assert.isFunction(this.spy);
                        assert.isFunction(this.stub);
                        assert.isFunction(this.mock);
                        assert.fakeServer(this.server);
                        assert.isArray(this.requests);
                        assert.clock(this.clock);
                        refute.defined(this.sandbox);
                    }

                    sinon.test(testFunction).call({});
                }
            },

            "yields clock when faking timers": function () {
                var clock;

                sinon.config = {
                    injectIntoThis: false,
                    properties: ["clock"]
                };

                sinon.test(function (c) {
                    clock = c;
                    assert.equals(arguments.length, 1);
                })();

                assert.clock(clock);
            },

            "fakes specified timers": function () {
                var props;

                sinon.config = {
                    injectIntoThis: false,
                    properties: ["clock"],
                    useFakeTimers: ["Date", "setTimeout", "setImmediate"]
                };

                sinon.test(function (c) {
                    props = {
                        clock: c,
                        Date: Date,
                        setTimeout: setTimeout,
                        clearTimeout: clearTimeout,
                        // clear & setImmediate are not yet available in all environments
                        setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
                        clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate : undefined),
                        setInterval: setInterval,
                        clearInterval: clearInterval
                    };
                })();

                refute.same(props.Date, sinon.timers.Date);
                refute.same(props.setTimeout, sinon.timers.setTimeout);
                assert.same(props.clearTimeout, sinon.timers.clearTimeout);
                refute.same(props.setImmediate, sinon.timers.setImmediate);
                assert.same(props.clearImmediate, sinon.timers.clearImmediate);
                assert.same(props.setInterval, sinon.timers.setInterval);
                assert.same(props.clearInterval, sinon.timers.clearInterval);
            },

            "injects properties into test case": function () {
                var testCase = {};

                sinon.config = {
                    properties: ["clock"]
                };

                function testFunction() {
                    assert.same(this, testCase);
                    assert.equals(arguments.length, 0);
                    assert.clock(this.clock);
                    refute.defined(this.spy);
                    refute.defined(this.stub);
                    refute.defined(this.mock);
                }

                sinon.test(testFunction).call(testCase);
            },

            "injects functions into test case by default": function () {
                function testFunction() {
                    assert.equals(arguments.length, 0);
                    assert.isFunction(this.spy);
                    assert.isFunction(this.stub);
                    assert.isFunction(this.mock);
                    assert.isObject(this.clock);
                }

                sinon.test(testFunction).call({});
            },

            "injects sandbox": function () {
                function testFunction() {
                    assert.equals(arguments.length, 0);
                    assert.isFunction(this.spy);
                    assert.isObject(this.sandbox);
                }

                sinon.config = {
                    properties: ["sandbox", "spy"]
                };

                sinon.test(testFunction).call({});
            },

            "remove injected properties afterwards": function () {
                var testCase = {};

                sinon.test(function () {}).call(testCase);

                refute.defined(testCase.spy);
                refute.defined(testCase.stub);
                refute.defined(testCase.mock);
                refute.defined(testCase.sandbox);
                refute.defined(testCase.clock);
                refute.defined(testCase.server);
                refute.defined(testCase.requests);
            },

            "uses sinon.test to fake time": function () {
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
        }
    });
}(this));
