"use strict";
const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should reset history", () => {
        const stub = sinon.stub();

        assert.isFalse(stub.called);

        stub();

        assert.isTrue(stub.called);

        stub.resetHistory();

        assert.isFalse(stub.called);
    });
});
