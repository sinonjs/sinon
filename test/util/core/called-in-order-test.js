"use strict";

var referee = require("referee");
var calledInOrder = require("../../../lib/sinon/util/core/called-in-order");
var sinonStub = require("../../../lib/sinon/stub");
var assert = referee.assert;

var testObject1 = {someFunction: function () {}};
var testObject2 = {otherFunction: function () {}};
var testObject3 = {thirdFunction: function () {}};

function testMethod() {
    testObject1.someFunction();
    testObject2.otherFunction();
    testObject3.thirdFunction();
}

describe("util/core/calledInOrder", function () {
    beforeEach(function () {
        sinonStub(testObject1, "someFunction");
        sinonStub(testObject2, "otherFunction");
        sinonStub(testObject3, "thirdFunction");
        testMethod();
    });
    afterEach(function () {
        testObject1.someFunction.restore();
        testObject2.otherFunction.restore();
        testObject3.thirdFunction.restore();
    });

    describe("With array parameter given", function () {

        it("returns true, if stubs were called in given order", function () {
            assert(calledInOrder([testObject1.someFunction, testObject2.otherFunction]));
            assert(calledInOrder([testObject1.someFunction, testObject2.otherFunction,
                                        testObject3.thirdFunction]));
        });

        it("returns false, if stubs were called in wrong order", function () {
            assert( !calledInOrder([testObject2.otherFunction, testObject1.someFunction]));
            assert( !calledInOrder([testObject2.otherFunction, testObject1.someFunction,
                                          testObject3.thirdFunction]));
        });
    });

    describe("With multiple parameters given", function () {

        it("returns true, if stubs were called in given order", function () {
            assert(calledInOrder(testObject1.someFunction, testObject2.otherFunction));
            assert(calledInOrder(testObject1.someFunction, testObject2.otherFunction,
                                       testObject3.thirdFunction));
        });

        it("returns false, if stubs were called in wrong order", function () {
            assert( !calledInOrder(testObject2.otherFunction, testObject1.someFunction));
            assert( !calledInOrder(testObject2.otherFunction, testObject1.someFunction,
                                         testObject3.thirdFunction));
        });
    });
});
