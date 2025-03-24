"use strict";

const sinon = require("../lib/sinon.js");
const createProxy = require("../lib/sinon/proxy");
const fake = sinon.fake;
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const refute = referee.refute;

referee.add("isProxy", {
    assert: function assertIsProxy(actual) {
        if (typeof actual !== "function") {
            throw new TypeError(
                "isProxy expects 'actual' argument to be a Function",
            );
        }

        this.isSinonProxy = actual.isSinonProxy;

        return this.isSinonProxy === true;
    },
    assertMessage: "Expected ${name} to be a Sinon proxy (spy)",
    refuteMessage: "Expected ${name} to not be a Sinon proxy (spy)",
    expectation: "toBeAProxy",
});

function verifyProxy(func, argument) {
    it("should return a Sinon proxy", function () {
        const actual = argument ? func(argument) : func();

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

const hasFunctionNameSupport = noop.name === "noop";

describe("fake", function () {
    describe("module", function () {
        it("should return a unary Function named 'fake'", function () {
            assert.equals(fake.length, 1);
            if (hasFunctionNameSupport) {
                assert.equals(fake.name, "fake");
            }
        });
    });

    describe("when passed a Function", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake, function () {
            return;
        });

        it("should keep the `this` context of the wrapped function", function () {
            function method() {
                return this.foo;
            }
            const o = { foo: 42 };
            const fakeMethod = fake(method);

            const result = fakeMethod.call(o);

            assert.equals(fakeMethod.callCount, 1);
            assert.equals(result, 42);
        });
    });

    describe("when passed no value", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake);
    });

    it("should reject non-Function argument", function () {
        const nonFuncs = [
            "",
            123,
            new Date(),
            {},
            false,
            undefined,
            true,
            null,
        ];

        nonFuncs.forEach(function (nf) {
            assert.exception(function () {
                fake(nf);
            });
        });
    });

    describe(".callback", function () {
        it("it should be a reference for the callback in the last call", function () {
            const f = fake();
            const callback1 = function () {
                return;
            };
            const callback2 = function () {
                return;
            };

            f(1, 2, 3, callback1);
            assert.equals(f.callback, callback1);

            f(1, 2, 3, callback2);
            assert.equals(f.callback, callback2);

            f(1, 2, 3);
            assert.isUndefined(f.callback);
        });
    });

    describe(".displayName", function () {
        it("should be 'fake'", function () {
            const fakes = [
                fake(),
                fake.returns(42),
                fake.throws(new Error()),
                fake.resolves(42),
                fake.rejects(new Error()),
                fake.yields(42),
                fake.yieldsAsync(42),
            ];

            fakes.forEach(function (f) {
                assert.equals(f.displayName, "fake");
            });
        });
    });

    describe(".id", function () {
        it("should start with 'fake#'", function () {
            for (let i = 0; i < 100; i++) {
                assert.isTrue(fake().id.indexOf("fake#") === 0);
            }
        });
    });

    describe(".firstArg", function () {
        it("should be the first argument from the last call", function () {
            const f = fake();
            f(41, 42, 43);
            assert.equals(f.firstArg, 41);

            f(44, 45);
            assert.equals(f.firstArg, 44);

            f(46);
            assert.equals(f.firstArg, 46);

            f(false, true, 47, "string");
            assert.isFalse(f.firstArg);

            f("string", false, true, 47);
            assert.equals(f.firstArg, "string");

            f(47, "string", false, true);
            assert.equals(f.firstArg, 47);

            f(true, 47, "string", false);
            assert.isTrue(f.firstArg);

            f();
            assert.isUndefined(f.firstArg);
        });
    });

    describe(".lastArg", function () {
        it("should be the last argument from the last call", function () {
            const f = fake();
            f(41, 42, 43);
            assert.equals(f.lastArg, 43);

            f(44, 45);
            assert.equals(f.lastArg, 45);

            f(46);
            assert.equals(f.lastArg, 46);

            f(false, true, 47, "string");
            assert.equals(f.lastArg, "string");

            f("string", false, true, 47);
            assert.equals(f.lastArg, 47);

            f(47, "string", false, true);
            assert.isTrue(f.lastArg);

            f(true, 47, "string", false);
            assert.isFalse(f.lastArg);

            f();
            assert.isUndefined(f.lastArg);
        });
    });

    describe(".returns", function () {
        it("should return a function that returns the argument", function () {
            const expected = 42;
            const myFake = fake.returns(expected);
            const actual = myFake();

            assert.equals(actual, expected);
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.returns, "42");
    });

    describe(".throws", function () {
        it("should return a function that throws an Error, that is the argument", function () {
            const expectedMessage = "42";
            const myFake = fake.throws(expectedMessage);

            assert.exception(function () {
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

        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.throws, "42");

        it("should return the same error type as it is passed", function () {
            const expected = new TypeError("hello sailor");
            const myFake = fake.throws(expected);

            /* eslint-disable no-restricted-syntax */
            try {
                myFake();
            } catch (actual) {
                assert.isTrue(actual instanceof TypeError);
            }
            /* eslint-disable no-restricted-syntax */
        });

        describe("when passed a String", function () {
            it("should throw an Error", function () {
                const expected = "lorem ipsum";
                const myFake = fake.throws(expected);

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

    describe(".resolves", function () {
        before(requirePromiseSupport);

        it("should return a function that resolves to the argument", function () {
            const expected = 42;
            const myFake = fake.resolves(expected);

            return myFake().then(function (actual) {
                assert.equals(actual, expected);
            });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.resolves, "42");
    });

    describe(".rejects", function () {
        before(requirePromiseSupport);

        it("should return a function that rejects to the argument", function () {
            const expectedMessage = "42";
            const myFake = fake.rejects(expectedMessage);

            return myFake().catch(function (actual) {
                assert.equals(actual.message, expectedMessage);
            });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.rejects, "42");

        it("should return the same error type as it is passed", function () {
            const expected = new TypeError("hello world");
            const myFake = fake.rejects(expected);

            return myFake().catch(function (actual) {
                assert.isTrue(actual instanceof TypeError);
            });
        });

        it("should reject with an Error when passed a String", function () {
            const expected = "lorem ipsum";
            const myFake = fake.rejects(expected);

            return myFake().catch(function (actual) {
                assert.isTrue(actual instanceof Error);
            });
        });
    });

    describe(".yields", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.yields, noop, "42", "43");

        it("should call a callback with the provided values", function () {
            const callback = sinon.spy();
            const myFake = fake.yields("one", "two", "three");

            myFake(callback);

            sinon.assert.calledOnce(callback);
            sinon.assert.calledWith(callback, "one", "two", "three");
        });

        it("should call the last function argument", function () {
            const callback = sinon.spy();
            const myFake = fake.yields();

            myFake(function () {
                return;
            }, callback);

            sinon.assert.calledOnce(callback);
        });

        it("should throw if the last argument is not a function", function () {
            const myFake = fake.yields();

            assert.exception(function () {
                myFake(function () {
                    return;
                }, "not a function");
            }, /TypeError: Expected last argument to be a function/);
        });
    });

    describe(".yieldsAsync", function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        verifyProxy(fake.yieldsAsync, noop, "42", "43");

        it("should call the callback asynchronously with the provided values", function (done) {
            const callback = sinon.spy();
            const myFake = fake.yieldsAsync("one", "two", "three");

            myFake(callback);

            sinon.assert.notCalled(callback);

            setTimeout(function () {
                sinon.assert.calledOnce(callback);
                sinon.assert.calledWith(callback, "one", "two", "three");

                done();
            }, 5); // IE 11 and Edge are sometimes slow
        });

        it("should call the last function argument", function (done) {
            const callback = sinon.spy();
            const myFake = fake.yieldsAsync();

            myFake(function () {
                return;
            }, callback);

            sinon.assert.notCalled(callback);

            setTimeout(function () {
                sinon.assert.calledOnce(callback);

                done();
            }, 5); // IE 11 and Edge are sometimes slow
        });

        it("should throw if the last argument is not a function", function () {
            const myFake = fake.yieldsAsync();

            assert.exception(function () {
                myFake(function () {
                    return;
                }, "not a function");
            }, /TypeError: Expected last argument to be a function/);
        });
    });

    describe(".named", function () {
        before(function beforeFunc() {
            const desc = Object.getOwnPropertyDescriptor(beforeFunc, "name");
            if (!desc || !desc.configurable) {
                this.skip();
            }
        });

        it("should set the name of the fake to the given string", function () {
            const myFake = fake().named("something");

            assert.equals(myFake.name, "something");
        });
    });

    describe(".calledBefore/After", function () {
        let fakeA;
        let fakeB;

        beforeEach(function () {
            fakeA = fake();
            fakeB = fake();

            fakeA();
            fakeB();
        });

        it("should return true if called before", function () {
            assert.isTrue(fakeA.calledBefore(fakeB));
        });

        it("should return false if not called before", function () {
            assert.isFalse(fakeB.calledBefore(fakeA));
        });

        it("should return true if called after", function () {
            assert.isTrue(fakeB.calledAfter(fakeA));
        });

        it("should return false if not called after", function () {
            assert.isFalse(fakeA.calledAfter(fakeB));
        });

        it("should pass sinon.assert.callOrder", function () {
            refute.exception(function () {
                sinon.assert.callOrder(fakeA, fakeB);
            });
        });

        it("should fail sinon.assert.callOrder", function () {
            assert.exception(
                function () {
                    sinon.assert.callOrder(fakeB, fakeA);
                },
                {
                    name: "AssertError",
                },
            );
        });

        it("should return true if called immediately before", function () {
            assert.isTrue(fakeA.calledImmediatelyBefore(fakeB));
        });

        it("should return false if not called immediately before", function () {
            assert.isFalse(fakeB.calledImmediatelyBefore(fakeA));
        });

        it("should return true if called immediately after", function () {
            assert.isTrue(fakeB.calledImmediatelyAfter(fakeA));
        });

        it("should return false if not called immediately after", function () {
            assert.isFalse(fakeA.calledImmediatelyAfter(fakeB));
        });
    });

    describe(".printf", function () {
        it("is delegated to proxy", function () {
            const myFake = fake();
            const proxy = createProxy(noop, noop);

            assert.same(myFake.printf, proxy.printf);
        });
    });
});
