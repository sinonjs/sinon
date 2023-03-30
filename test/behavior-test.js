"use strict";

const sinon = require("../lib/sinon");
const assert = require("@sinonjs/referee").assert;

describe("behaviors", function () {
    it("adds and uses a custom behavior", function () {
        sinon.addBehavior("returnsNum", function (fake, n) {
            fake.returns(n);
        });

        const stub = sinon.stub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
