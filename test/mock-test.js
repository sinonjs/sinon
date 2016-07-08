"use strict";

var referee = require("referee");
var sinonMock = require("../lib/sinon/mock");
var sinonExpectation = require("../lib/sinon/mock-expectation");
var sinonMatch = require("../lib/sinon/match");
var sinonStub = require("../lib/sinon/stub");
var sinonSpy = require("../lib/sinon/spy");
var assert = referee.assert;
var refute = referee.refute;

describe("sinonMock", function () {
    describe(".create", function () {
        it("returns function with expects method", function () {
            var mock = sinonMock.create({});

            assert.isFunction(mock.expects);
        });

        it("throws without object", function () {
            assert.exception(function () {
                sinonMock.create();
            }, "TypeError");
        });
    });

    describe(".expects", function () {
        beforeEach(function () {
            this.mock = sinonMock.create({ someMethod: function () {} });
        });

        it("throws without method", function () {
            var mock = this.mock;

            assert.exception(function () {
                mock.expects();
            }, "TypeError");
        });

        it("returns expectation", function () {
            var result = this.mock.expects("someMethod");

            assert.isFunction(result);
            assert.equals(result.method, "someMethod");
        });

        it("throws if expecting a non-existent method", function () {
            var mock = this.mock;

            assert.exception(function () {
                mock.expects("someMethod2");
            });
        });
    });

    describe(".expectation", function () {
        beforeEach(function () {
            this.method = "myMeth";
            this.expectation = sinonExpectation.create(this.method);
        });

        it("creates unnamed expectation", function () {
            var anonMock = sinonExpectation.create();
            anonMock.never();

            assert(anonMock.verify());
        });

        it("uses 'anonymous mock expectation' for unnamed expectation", function () {
            var anonMock = sinonExpectation.create();
            anonMock.once();

            try {
                anonMock.verify();
            } catch (e) {
                assert.match(e.message, "anonymous mock expectation");
            }
        });

        it("call expectation", function () {
            this.expectation();

            assert.isFunction(this.expectation.invoke);
            assert(this.expectation.called);
        });

        it("is invokable", function () {
            var expectation = this.expectation;

            refute.exception(function () {
                expectation();
            });
        });

        describe(".returns", function () {
            it("returns configured return value", function () {
                var object = {};
                this.expectation.returns(object);

                assert.same(this.expectation(), object);
            });
        });

        describe("call", function () {
            it("is called with correct this value", function () {
                var object = { method: this.expectation };
                object.method();

                assert(this.expectation.calledOn(object));
            });
        });

        describe(".callCount", function () {
            it("onlys be invokable once by default", function () {
                var expectation = this.expectation;
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("throw readable error", function () {
                var expectation = this.expectation;
                expectation();

                try {
                    expectation();
                    referee.fail("Expected to throw");
                } catch (e) {
                    assert.equals(e.message, "myMeth already called once");
                }
            });
        });

        describe(".callCountNever", function () {
            it("is not callable", function () {
                var expectation = this.expectation;
                expectation.never();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.never(), this.expectation);
            });
        });

        describe(".callCountOnce", function () {
            it("allows one call", function () {
                var expectation = this.expectation;
                expectation.once();
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.once(), this.expectation);
            });
        });

        describe(".callCountTwice", function () {
            it("allows two calls", function () {
                var expectation = this.expectation;
                expectation.twice();
                expectation();
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.twice(), this.expectation);
            });
        });

        describe(".callCountThrice", function () {
            it("allows three calls", function () {
                var expectation = this.expectation;
                expectation.thrice();
                expectation();
                expectation();
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.thrice(), this.expectation);
            });
        });

        describe(".callCountExactly", function () {
            it("allows specified number of calls", function () {
                var expectation = this.expectation;
                expectation.exactly(2);
                expectation();
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.exactly(2), this.expectation);
            });

            it("throws without argument", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.exactly();
                }, "TypeError");
            });

            it("throws without number", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.exactly("12");
                }, "TypeError");
            });

            it("throws with Symbol", function () {
                if (typeof Symbol === "function") {
                    var expectation = this.expectation;

                    assert.exception(function () {
                        expectation.exactly(Symbol());
                    }, function (err) {
                        return err.message === "'Symbol()' is not a number";
                    });
                }
            });
        });

        describe(".atLeast", function () {
            it("throws without argument", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.atLeast();
                }, "TypeError");
            });

            it("throws without number", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.atLeast({});
                }, "TypeError");
            });

            it("throws with Symbol", function () {
                if (typeof Symbol === "function") {
                    var expectation = this.expectation;

                    assert.exception(function () {
                        expectation.atLeast(Symbol());
                    }, function (err) {
                        return err.message === "'Symbol()' is not number";
                    });
                }
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.atLeast(2), this.expectation);
            });

            it("allows any number of calls", function () {
                var expectation = this.expectation;
                expectation.atLeast(2);
                expectation();
                expectation();

                refute.exception(function () {
                    expectation();
                    expectation();
                });
            });

            it("should not be met with too few calls", function () {
                this.expectation.atLeast(2);
                this.expectation();

                assert.isFalse(this.expectation.met());
            });

            it("is met with exact calls", function () {
                this.expectation.atLeast(2);
                this.expectation();
                this.expectation();

                assert(this.expectation.met());
            });

            it("is met with excessive calls", function () {
                this.expectation.atLeast(2);
                this.expectation();
                this.expectation();
                this.expectation();

                assert(this.expectation.met());
            });

            it("should not throw when exceeding at least expectation", function () {
                var obj = { foobar: function () {} };
                var mock = sinonMock(obj);
                mock.expects("foobar").atLeast(1);

                obj.foobar();

                refute.exception(function () {
                    obj.foobar();
                    mock.verify();
                });
            });

            it("should not throw when exceeding at least expectation and withargs", function () {
                var obj = { foobar: function () {} };
                var mock = sinonMock(obj);

                mock.expects("foobar").withArgs("arg1");
                mock.expects("foobar").atLeast(1).withArgs("arg2");

                obj.foobar("arg1");
                obj.foobar("arg2");
                obj.foobar("arg2");

                assert(mock.verify());
            });
        });

        describe(".atMost", function () {
            it("throws without argument", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.atMost();
                }, "TypeError");
            });

            it("throws without number", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.atMost({});
                }, "TypeError");
            });

            it("throws with Symbol", function () {
                if (typeof Symbol === "function") {
                    var expectation = this.expectation;

                    assert.exception(function () {
                        expectation.atMost(Symbol());
                    }, function (err) {
                        return err.message === "'Symbol()' is not number";
                    });
                }
            });

            it("returns expectation for chaining", function () {
                assert.same(this.expectation.atMost(2), this.expectation);
            });

            it("allows fewer calls", function () {
                var expectation = this.expectation;
                expectation.atMost(2);

                refute.exception(function () {
                    expectation();
                });
            });

            it("is met with fewer calls", function () {
                this.expectation.atMost(2);
                this.expectation();

                assert(this.expectation.met());
            });

            it("is met with exact calls", function () {
                this.expectation.atMost(2);
                this.expectation();
                this.expectation();

                assert(this.expectation.met());
            });

            it("should not be met with excessive calls", function () {
                var expectation = this.expectation;
                this.expectation.atMost(2);
                this.expectation();
                this.expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");

                assert.isFalse(this.expectation.met());
            });
        });

        describe(".atMostAndAtLeast", function () {
            beforeEach(function () {
                this.expectation.atLeast(2);
                this.expectation.atMost(3);
            });

            it("should not be met with too few calls", function () {
                this.expectation();

                assert.isFalse(this.expectation.met());
            });

            it("is met with minimum calls", function () {
                this.expectation();
                this.expectation();

                assert(this.expectation.met());
            });

            it("is met with maximum calls", function () {
                this.expectation();
                this.expectation();
                this.expectation();

                assert(this.expectation.met());
            });

            it("throws with excessive calls", function () {
                var expectation = this.expectation;
                expectation();
                expectation();
                expectation();

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });
        });

        describe(".met", function () {
            it("should not be met when not called enough times", function () {
                assert.isFalse(this.expectation.met());
            });

            it("is met when called enough times", function () {
                this.expectation();

                assert(this.expectation.met());
            });

            it("should not be met when called too many times", function () {
                this.expectation();

                try {
                    this.expectation();
                }
                catch (e) {} // eslint-disable-line no-empty

                assert.isFalse(this.expectation.met());
            });
        });

        describe(".withArgs", function () {
            it("returns expectation for chaining", function () {
                assert.same(this.expectation.withArgs(1), this.expectation);
            });

            it("accepts call with expected args", function () {
                this.expectation.withArgs(1, 2, 3);
                this.expectation(1, 2, 3);

                assert(this.expectation.met());
            });

            it("throws when called without args", function () {
                var expectation = this.expectation;
                expectation.withArgs(1, 2, 3);

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("throws when called with too few args", function () {
                var expectation = this.expectation;
                expectation.withArgs(1, 2, 3);

                assert.exception(function () {
                    expectation(1, 2);
                }, "ExpectationError");
            });

            it("throws when called with wrong args", function () {
                var expectation = this.expectation;
                expectation.withArgs(1, 2, 3);

                assert.exception(function () {
                    expectation(2, 2, 3);
                }, "ExpectationError");
            });

            it("allows excessive args", function () {
                var expectation = this.expectation;
                expectation.withArgs(1, 2, 3);

                refute.exception(function () {
                    expectation(1, 2, 3, 4);
                });
            });

            it("calls accept with no args", function () {
                this.expectation.withArgs();
                this.expectation();

                assert(this.expectation.met());
            });

            it("allows no args called with excessive args", function () {
                var expectation = this.expectation;
                expectation.withArgs();

                refute.exception(function () {
                    expectation(1, 2, 3);
                });
            });

            it("works with sinon matchers", function () {
                this.expectation.withArgs(sinonMatch.number, sinonMatch.string, sinonMatch.func);
                this.expectation(1, "test", function () {});

                assert(this.expectation.met());
            });

            it("throws when sinon matchers fail", function () {
                var expectation = this.expectation;

                this.expectation.withArgs(sinonMatch.number, sinonMatch.string, sinonMatch.func);
                assert.exception(function () {
                    expectation(1, 2, 3);
                }, "ExpectationError");
            });
        });

        describe(".withExactArgs", function () {
            it("returns expectation for chaining", function () {
                assert.same(this.expectation.withExactArgs(1), this.expectation);
            });

            it("accepts call with expected args", function () {
                this.expectation.withExactArgs(1, 2, 3);
                this.expectation(1, 2, 3);

                assert(this.expectation.met());
            });

            it("throws when called without args", function () {
                var expectation = this.expectation;
                expectation.withExactArgs(1, 2, 3);

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("throws when called with too few args", function () {
                var expectation = this.expectation;
                expectation.withExactArgs(1, 2, 3);

                assert.exception(function () {
                    expectation(1, 2);
                }, "ExpectationError");
            });

            it("throws when called with wrong args", function () {
                var expectation = this.expectation;
                expectation.withExactArgs(1, 2, 3);

                assert.exception(function () {
                    expectation(2, 2, 3);
                }, "ExpectationError");
            });

            it("should not allow excessive args", function () {
                var expectation = this.expectation;
                expectation.withExactArgs(1, 2, 3);

                assert.exception(function () {
                    expectation(1, 2, 3, 4);
                }, "ExpectationError");
            });

            it("accepts call with no expected args", function () {
                this.expectation.withExactArgs();
                this.expectation();

                assert(this.expectation.met());
            });

            it("does not allow excessive args with no expected args", function () {
                var expectation = this.expectation;
                expectation.withExactArgs();

                assert.exception(function () {
                    expectation(1, 2, 3);
                }, "ExpectationError");
            });
        });

        describe(".on", function () {
            it("returns expectation for chaining", function () {
                assert.same(this.expectation.on({}), this.expectation);
            });

            it("allows calls on object", function () {
                this.expectation.on(this);
                this.expectation();

                assert(this.expectation.met());
            });

            it("throws if called on wrong object", function () {
                var expectation = this.expectation;
                expectation.on({});

                assert.exception(function () {
                    expectation();
                }, "ExpectationError");
            });

            it("throws if calls on wrong Symbol", function () {
                if (typeof Symbol === "function") {
                    var expectation = sinonExpectation.create("method");
                    expectation.on(Symbol());

                    assert.exception(function () {
                        expectation.call(Symbol());
                    }, function (err) {
                        return err.message === "method called with Symbol() as thisValue, expected Symbol()";
                    });
                }
            });
        });

        describe(".verify", function () {
            it("pass if met", function () {
                sinonStub(sinonExpectation, "pass");
                var expectation = this.expectation;

                expectation();
                expectation.verify();

                assert.equals(sinonExpectation.pass.callCount, 1);
                sinonExpectation.pass.restore();
            });

            it("throws if not called enough times", function () {
                var expectation = this.expectation;

                assert.exception(function () {
                    expectation.verify();
                }, "ExpectationError");
            });

            it("throws readable error", function () {
                var expectation = this.expectation;

                try {
                    expectation.verify();
                    referee.fail("Expected to throw");
                } catch (e) {
                    assert.equals(e.message,
                                  "Expected myMeth([...]) once (never called)");
                }
            });
        });
    });

    describe(".verify", function () {
        beforeEach(function () {
            this.method = function () {};
            this.object = { method: this.method };
            this.mock = sinonMock.create(this.object);
        });

        it("restores mocks", function () {
            this.object.method();
            this.object.method.call(this.thisValue);
            this.mock.verify();

            assert.same(this.object.method, this.method);
        });

        it("passes verified mocks", function () {
            sinonStub(sinonExpectation, "pass");

            this.mock.expects("method").once();
            this.object.method();
            this.mock.verify();

            assert.equals(sinonExpectation.pass.callCount, 1);
            sinonExpectation.pass.restore();
        });

        it("restores if not met", function () {
            var mock = this.mock;
            mock.expects("method");

            assert.exception(function () {
                mock.verify();
            }, "ExpectationError");

            assert.same(this.object.method, this.method);
        });

        it("includes all calls in error message", function () {
            var mock = this.mock;
            mock.expects("method").thrice();
            mock.expects("method").once().withArgs(42);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(
                message,
                "Expected method([...]) thrice (never called)\nExpected method(42[, ...]) once (never called)"
            );
        });

        it("includes exact expected arguments in error message", function () {
            var mock = this.mock;
            mock.expects("method").once().withExactArgs(42);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Expected method(42) once (never called)");
        });

        it("includes received call count in error message", function () {
            var mock = this.mock;
            mock.expects("method").thrice().withExactArgs(42);
            this.object.method(42);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Expected method(42) thrice (called once)");
        });

        it("includes unexpected calls in error message", function () {
            var mock = this.mock;
            mock.expects("method").thrice().withExactArgs(42);
            var message;

            try {
                this.object.method();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message,
                          "Unexpected call: method()\n" +
                          "    Expected method(42) thrice (never called)");
        });

        it("includes met expectations in error message", function () {
            var mock = this.mock;
            mock.expects("method").once().withArgs(1);
            mock.expects("method").thrice().withExactArgs(42);
            this.object.method(1);
            var message;

            try {
                this.object.method();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Unexpected call: method()\n" +
                          "    Expectation met: method(1[, ...]) once\n" +
                          "    Expected method(42) thrice (never called)");
        });

        it("includes met expectations in error message from verify", function () {
            var mock = this.mock;
            mock.expects("method").once().withArgs(1);
            mock.expects("method").thrice().withExactArgs(42);
            this.object.method(1);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Expected method(42) thrice (never called)\n" +
                          "Expectation met: method(1[, ...]) once");
        });

        it("reports min calls in error message", function () {
            var mock = this.mock;
            mock.expects("method").atLeast(1);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Expected method([...]) at least once (never called)");
        });

        it("reports max calls in error message", function () {
            var mock = this.mock;
            mock.expects("method").atMost(2);
            var message;

            try {
                this.object.method();
                this.object.method();
                this.object.method();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Unexpected call: method()\n" +
                          "    Expectation met: method([...]) at most twice");
        });

        it("reports min calls in met expectation", function () {
            var mock = this.mock;
            mock.expects("method").atLeast(1);
            mock.expects("method").withArgs(2).once();
            var message;

            try {
                this.object.method();
                this.object.method(2);
                this.object.method(2);
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Unexpected call: method(2)\n" +
                          "    Expectation met: method([...]) at least once\n" +
                          "    Expectation met: method(2[, ...]) once");
        });

        it("reports max and min calls in error messages", function () {
            var mock = this.mock;
            mock.expects("method").atLeast(1).atMost(2);
            var message;

            try {
                mock.verify();
            } catch (e) {
                message = e.message;
            }

            assert.equals(message, "Expected method([...]) at least once and at most twice " +
                          "(never called)");
        });

        it("does not call pass if no expectations", function () {
            var pass = sinonStub(sinonExpectation, "pass");

            var mock = this.mock;
            mock.expects("method").never();
            delete mock.expectations;

            mock.verify();

            refute(pass.called, "expectation.pass should not be called");

            pass.restore();
        });
    });

    describe("mock object", function () {
        beforeEach(function () {
            this.method = function () {};
            this.object = { method: this.method };
            this.mock = sinonMock.create(this.object);
        });

        it("mocks object method", function () {
            this.mock.expects("method");

            assert.isFunction(this.object.method);
            refute.same(this.object.method, this.method);
        });

        it("reverts mocked method", function () {
            this.mock.expects("method");
            this.object.method.restore();

            assert.same(this.object.method, this.method);
        });

        it("reverts expectation", function () {
            this.mock.expects("method");
            this.object.method.restore();

            assert.same(this.object.method, this.method);
        });

        it("reverts mock", function () {
            this.mock.expects("method");
            this.mock.restore();

            assert.same(this.object.method, this.method);
        });

        it("verifies mock", function () {
            this.mock.expects("method");
            this.object.method();
            var mock = this.mock;

            refute.exception(function () {
                assert(mock.verify());
            });
        });

        it("verifies mock with unmet expectations", function () {
            this.mock.expects("method");
            var mock = this.mock;

            assert.exception(function () {
                assert(mock.verify());
            }, "ExpectationError");
        });
    });

    describe("mock method multiple times", function () {
        beforeEach(function () {
            this.thisValue = {};
            this.method = function () {};
            this.object = { method: this.method };
            this.mock = sinonMock.create(this.object);
            this.mock.expects("method");
            this.mock.expects("method").on(this.thisValue);
        });

        it("queues expectations", function () {
            var object = this.object;

            refute.exception(function () {
                object.method();
            });
        });

        it("starts on next expectation when first is met", function () {
            var object = this.object;
            object.method();

            assert.exception(function () {
                object.method();
            }, "ExpectationError");
        });

        it("fails on last expectation", function () {
            var object = this.object;
            object.method();
            object.method.call(this.thisValue);

            assert.exception(function () {
                object.method();
            }, "ExpectationError");
        });

        it("allows mock calls in any order", function () {
            var object = { method: function () {} };
            var mock = sinonMock(object);
            mock.expects("method").once().withArgs(42);
            mock.expects("method").twice().withArgs("Yeah");

            refute.exception(function () {
                object.method("Yeah");
            });

            refute.exception(function () {
                object.method(42);
            });

            assert.exception(function () {
                object.method(1);
            });

            refute.exception(function () {
                object.method("Yeah");
            });

            assert.exception(function () {
                object.method(42);
            });
        });
    });

    describe("mock function", function () {
        it("returns mock method", function () {
            var mock = sinonMock();

            assert.isFunction(mock);
            assert.isFunction(mock.atLeast);
            assert.isFunction(mock.verify);
        });

        it("returns mock object", function () {
            var mock = sinonMock({});

            assert.isObject(mock);
            assert.isFunction(mock.expects);
            assert.isFunction(mock.verify);
        });
    });

    describe(".yields", function () {
        it("invokes only argument as callback", function () {
            var mock = sinonMock().yields();
            var spy = sinonSpy();
            mock(spy);

            assert(spy.calledOnce);
            assert.equals(spy.args[0].length, 0);
        });

        it("throws understandable error if no callback is passed", function () {
            var mock = sinonMock().yields();

            try {
                mock();
                throw new Error();
            } catch (e) {
                assert.equals(e.message, "stub expected to yield, but no callback was passed.");
            }
        });
    });
});
