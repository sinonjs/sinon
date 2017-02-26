"use strict";

var createStub = require("../lib/sinon/stub");
var addBehavior = require("../lib/sinon").addBehavior;
var assert = require("referee").assert;

describe("behaviors", function () {
    it("adds and uses a custom behavior", function () {
        addBehavior("returns42", function () {
            this.returns(42);
        });

        var stub = createStub().returns42();

        assert.equals(stub(), 42);
    });
});
