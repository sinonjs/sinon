"use strict";

var referee = require("referee");
var sinon = require("../lib/sinon");
var assert = referee.assert;

var testObject1 = {someFunction: function () {}};
var testObject2 = {otherFunction: function () {}};
var testObject3 = {thirdFunction: function () {}};

function testMethod() {
    testObject1.someFunction();
    testObject2.otherFunction();
    testObject3.thirdFunction();
}

describe("sinon.calledInOrder", function () {
    beforeEach(function () {
        sinon.stub(testObject1, "someFunction");
        sinon.stub(testObject2, "otherFunction");
        sinon.stub(testObject3, "thirdFunction");
        testMethod();
    });
    afterEach(function () {
        testObject1.someFunction.restore();
        testObject2.otherFunction.restore();
        testObject3.thirdFunction.restore();
    });

    describe("With array parameter given", function () {

        it("returns true, if stubs were called in given order", function () {
            assert(sinon.calledInOrder([testObject1.someFunction, testObject2.otherFunction]));
            assert(sinon.calledInOrder([testObject1.someFunction, testObject2.otherFunction,
                                        testObject3.thirdFunction]));
        });

        it("returns false, if stubs were called in wrong order", function () {
            assert( !sinon.calledInOrder([testObject2.otherFunction, testObject1.someFunction]));
            assert( !sinon.calledInOrder([testObject2.otherFunction, testObject1.someFunction,
                                          testObject3.thirdFunction]));
        });
    });

    describe("With multiple parameters given", function () {

        it("returns true, if stubs were called in given order", function () {
            assert(sinon.calledInOrder(testObject1.someFunction, testObject2.otherFunction));
            assert(sinon.calledInOrder(testObject1.someFunction, testObject2.otherFunction,
                                       testObject3.thirdFunction));
        });

        it("returns false, if stubs were called in wrong order", function () {
            assert( !sinon.calledInOrder(testObject2.otherFunction, testObject1.someFunction));
            assert( !sinon.calledInOrder(testObject2.otherFunction, testObject1.someFunction,
                                         testObject3.thirdFunction));
        });
    });
});
