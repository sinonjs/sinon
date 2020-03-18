"use strict";
const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should add a custom behavior", () => {
        sinon.addBehavior("returnsNum", function(fake, n) {
            fake.returns(n);
        });

        const stub = sinon.stub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
