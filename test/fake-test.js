"use strict";

var sinon = require("../lib/sinon.js");
var fake = sinon.fake;
var referee = require("referee");
var assert = referee.assert;

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
    it("should return a Sinon proxy", function () {
        var actual = func(argument);

        assert.isProxy(actual);
    });
}


describe("fake", function () {
    describe("module", function () {
        it("should return a unary Function named 'fake'", function () {
            assert.equals(fake.length, 1);
            assert.equals(fake.name, "fake");
        });
    });

    describe("when passed a Function", function () {
        verifyProxy(fake, function () {});
    });

    describe("when passed no value", function () {
        verifyProxy(fake);
    });

    describe(".returns", function () {
        it("should return a function that returns the argument", function () {
            var expected = 42;
            var myFake = fake.returns(expected);
            var actual = myFake();

            assert.equals(actual, expected);
        });

        verifyProxy(fake.returns, "42");
    });

    describe(".throws", function () {
        it("should return a function that throws an Error, that is the argument", function () {
            var expectedMessage = "42";
            var myFake = fake.throws(expectedMessage);

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

        verifyProxy(fake.throws, "42");

        it("should return the same error type as it is passed", function () {
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

        describe("when passed a String", function () {
            it("should throw an Error", function () {
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

    describe(".resolves", function () {
        it("should return a function that resolves to the argument", function () {
            var expected = 42;
            var myFake = fake.resolves(expected);

            return myFake().then(function (actual) {
                assert.equals(actual, expected);
            });
        });

        verifyProxy(fake.resolves, "42");
    });

    describe(".rejects", function () {
        it("should return a function that rejects to the argument", function () {
            var expectedMessage = "42";
            var myFake = fake.rejects(expectedMessage);

            return myFake().catch(function (actual) {
                assert.equals(actual.message, expectedMessage);
            });
        });

        verifyProxy(fake.rejects, "42");

        it("should return the same error type as it is passed", function () {
            var expected = new TypeError("hello world");
            var myFake = fake.rejects(expected);

            return myFake().catch(function (actual) {
                assert.isTrue(actual instanceof TypeError);
            });
        });

        describe("when passed a String", function () {
            it("should reject with an Error", function () {
                var expected = "lorem ipsum";
                var myFake = fake.rejects(expected);

                return myFake().catch(function (actual) {
                    assert.isTrue(actual instanceof Error);
                });
            });
        });
    });
});
