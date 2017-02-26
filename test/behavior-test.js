"use strict";

var createStub = require("../lib/sinon/stub");
var addBehavior = require("../lib/sinon").addBehavior;
var assert = require("referee").assert;

describe("behaviors", function () {
    it("adds and uses a custom behavior", function () {
        addBehavior("returnsNum", function (fake, n) {
            fake.returns(n);
        });

        var stub = createStub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
