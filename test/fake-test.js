"use strict";

var sinon = require("../lib/sinon.js");
var fake = sinon.fake;
var assert = require("referee").assert;

describe("fake", function () {
    describe("module", function () {
        it("should return a unary Function named 'fake'", function () {
            assert.equals(fake.length, 1);
            assert.equals(fake.name, "fake");
        });
    });

    describe(".returns", function () {
        it("should return a function that returns the argument", function () {
            var expected = 42;
            var myFake = fake.returns(expected);
            var actual = myFake();

            assert.equals(actual, expected);
        });

        it("should return a sinon proxy", function () {
            var actual = fake.returns("hello");

            assert.isFunction(actual);
            assert.equals(actual.isSinonProxy, true);
        });
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

        it("should return a sinon proxy", function () {
            var actual = fake.throws("hello");

            assert.isFunction(actual);
            assert.equals(actual.isSinonProxy, true);
        });

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

        it("should return a sinon proxy", function () {
            var actual = fake.resolves("hello");

            assert.isFunction(actual);
            assert.equals(actual.isSinonProxy, true);
        });
    });

    describe(".rejects", function () {
        it("should return a function that rejects to the argument", function () {
            var expectedMessage = "42";
            var myFake = fake.rejects(expectedMessage);

            return myFake().catch(function (actual) {
                assert.equals(actual.message, expectedMessage);
            });
        });

        it("should return a sinon proxy", function () {
            var myFake = fake.rejects("hello");

            assert.isFunction(myFake);
            assert.equals(myFake.isSinonProxy, true);

            return myFake().catch(function (error) {
                assert.isTrue(error instanceof Error);
            });
        });

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
