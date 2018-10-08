"use strict";

var sinon = require("../lib/sinon");
var assert = require("@sinonjs/referee").assert;

describe("behaviors", function() {
    it("adds and uses a custom behavior", function() {
        sinon.addBehavior("returnsNum", function(fake, n) {
            fake.returns(n);
        });

        var stub = sinon.stub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
