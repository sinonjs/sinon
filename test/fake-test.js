"use strict";

var sinon = require("../lib/sinon.js");
var fake = sinon.fake;
var referee = require("@sinonjs/referee");
var assert = referee.assert;
var refute = referee.refute;

referee.add("isProxy", {
    assert: function assertIsProxy(actual) {
        if (typeof actual !== "function") {
            throw new TypeError("isProxy expects 'actual' argument to be a Function");
        }

        this.isSinonProxy = actual.isSinonProxy;

        return this.isSinonProxy === true;
    },
    assertMessage: "Expected ${name} to be a Sinon proxy (spy)",
    refuteMessage: "Expected ${name} to not be a Sinon proxy (spy)",
    expectation: "toBeAProxy"
});

function verifyProxy(func, argument) {
    it("should return a Sinon proxy", function() {
        var actual = argument ? func(argument) : func();

        assert.isProxy(actual);
    });
}

function noop() {
    return;
}

function requirePromiseSupport() {
    if (typeof Promise !== "function") {
        this.skip();
    }
}

var hasFunctionNameSupport = noop.name === "noop";

describe("fake", function() {
    describe("module", function() {
        it("should return a unary Function named 'fake'", function() {
            assert.equals(fake.length, 1);
            if (hasFunctionNameSupport) {
                assert.equals(fake.name, "fake");
            }
        });
    });

    describe("when passed a Function", function() {
        verifyProxy(fake, function() {
            return;
        });

        it("should keep the `this` context of the wrapped function", function() {
            function method() {
                return this.foo;
            }
            var o = { foo: 42 };
            var fakeMethod = fake(method);

            var result = fakeMethod.call(o);

            assert.equals(fakeMethod.callCount, 1);
            assert.equals(result, 42);
        });
    });

    describe("when passed no value", function() {
        verifyProxy(fake);
    });

    it("should reject non-Function argument", function() {
        var nonFuncs = ["", 123, new Date(), {}, false, undefined, true, null];

        nonFuncs.forEach(function(nf) {
            assert.exception(function() {
                fake(nf);
            });
        });
    });

    describe(".callback", function() {
        it("it should be a reference for the callback in the last call", function() {
            var f = fake();
            var callback1 = function() {
                return;
            };
            var callback2 = function() {
                return;
            };

            f(1, 2, 3, callback1);
            assert.equals(f.callback, callback1);

            f(1, 2, 3, callback2);
            assert.equals(f.callback, callback2);

            f(1, 2, 3);
            assert.equals(f.callback, undefined);
        });
    });

    describe(".displayName", function() {
        it("should be 'fake'", function() {
            var fakes = [
                fake(),
                fake.returns(42),
                fake.throws(new Error()),
                fake.resolves(42),
                fake.rejects(new Error()),
                fake.yields(42),
                fake.yieldsAsync(42)
            ];

            fakes.forEach(function(f) {
                assert.equals(f.displayName, "fake");
            });
        });
    });

    describe(".id", function() {
        it("should start with 'fake#'", function() {
            for (var i = 0; i < 100; i++) {
                assert.isTrue(fake().id.indexOf("fake#") === 0);
            }
        });
    });

    describe(".lastArg", function() {
        it("should be the last argument from the last call", function() {
            var f = fake();
            f(41, 42, 43);
            assert.equals(f.lastArg, 43);

            f(44, 45);
            assert.equals(f.lastArg, 45);

            f(46);
            assert.equals(f.lastArg, 46);

            f();
            refute.defined(f.lastArg);
        });
    });

    describe(".returns", function() {
        it("should return a function that returns the argument", function() {
            var expected = 42;
            var myFake = fake.returns(expected);
            var actual = myFake();

            assert.equals(actual, expected);
        });

        verifyProxy(fake.returns, "42");
    });

    describe(".throws", function() {
        it("should return a function that throws an Error, that is the argument", function() {
            var expectedMessage = "42";
            var myFake = fake.throws(expectedMessage);

            assert.exception(function() {
                myFake();
            });

            /* eslint-disable no-restricted-syntax */
            try {
                myFake();
            } catch (error) {
                assert.equals(error.message, expectedMessage);
            }
            /* eslint-disable no-restricted-syntax */
        });

        verifyProxy(fake.throws, "42");

        it("should return the same error type as it is passed", function() {
            var expected = new TypeError("hello sailor");
            var myFake = fake.throws(expected);

            /* eslint-disable no-restricted-syntax */
            try {
                myFake();
            } catch (actual) {
                assert.isTrue(actual instanceof TypeError);
            }
            /* eslint-disable no-restricted-syntax */
        });

        describe("when passed a String", function() {
            it("should throw an Error", function() {
                var expected = "lorem ipsum";
                var myFake = fake.throws(expected);

                /* eslint-disable no-restricted-syntax */
                try {
                    myFake();
                } catch (actual) {
                    assert.isTrue(actual instanceof Error);
                }
                /* eslint-disable no-restricted-syntax */
            });
        });
    });

    describe(".resolves", function() {
        before(requirePromiseSupport);

        it("should return a function that resolves to the argument", function() {
            var expected = 42;
            var myFake = fake.resolves(expected);

            return myFake().then(function(actual) {
                assert.equals(actual, expected);
            });
        });

        verifyProxy(fake.resolves, "42");
    });

    describe(".rejects", function() {
        before(requirePromiseSupport);

        it("should return a function that rejects to the argument", function() {
            var expectedMessage = "42";
            var myFake = fake.rejects(expectedMessage);

            return myFake().catch(function(actual) {
                assert.equals(actual.message, expectedMessage);
            });
        });

        verifyProxy(fake.rejects, "42");

        it("should return the same error type as it is passed", function() {
            var expected = new TypeError("hello world");
            var myFake = fake.rejects(expected);

            return myFake().catch(function(actual) {
                assert.isTrue(actual instanceof TypeError);
            });
        });

        it("should reject with an Error when passed a String", function() {
            var expected = "lorem ipsum";
            var myFake = fake.rejects(expected);

            return myFake().catch(function(actual) {
                assert.isTrue(actual instanceof Error);
            });
        });
    });

    describe(".yields", function() {
        verifyProxy(fake.yields, noop, "42", "43");

        it("should call a callback with the provided values", function() {
            var callback = sinon.spy();
            var myFake = fake.yields("one", "two", "three");

            myFake(callback);

            sinon.assert.calledOnce(callback);
            sinon.assert.calledWith(callback, "one", "two", "three");
        });

        it("should call the last function argument", function() {
            var callback = sinon.spy();
            var myFake = fake.yields();

            myFake(function() {
                return;
            }, callback);

            sinon.assert.calledOnce(callback);
        });

        it("should throw if the last argument is not a function", function() {
            var myFake = fake.yields();

            assert.exception(function() {
                myFake(function() {
                    return;
                }, "not a function");
            }, /TypeError: Expected last argument to be a function/);
        });
    });

    describe(".yieldsAsync", function() {
        verifyProxy(fake.yieldsAsync, noop, "42", "43");

        it("should call the callback asynchronously with the provided values", function(done) {
            var callback = sinon.spy();
            var myFake = fake.yieldsAsync("one", "two", "three");

            myFake(callback);

            sinon.assert.notCalled(callback);

            setTimeout(function() {
                sinon.assert.calledOnce(callback);
                sinon.assert.calledWith(callback, "one", "two", "three");

                done();
            }, 0);
        });

        it("should call the last function argument", function(done) {
            var callback = sinon.spy();
            var myFake = fake.yieldsAsync();

            myFake(function() {
                return;
            }, callback);

            sinon.assert.notCalled(callback);

            setTimeout(function() {
                sinon.assert.calledOnce(callback);

                done();
            }, 0);
        });

        it("should throw if the last argument is not a function", function() {
            var myFake = fake.yieldsAsync();

            assert.exception(function() {
                myFake(function() {
                    return;
                }, "not a function");
            }, /TypeError: Expected last argument to be a function/);
        });
    });
});
