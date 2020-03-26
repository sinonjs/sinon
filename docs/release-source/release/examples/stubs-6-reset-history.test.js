require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function() {
    it("should reset history", function() {
        const stub = sinon.stub();

        assert.isFalse(stub.called);

        stub();

        assert.isTrue(stub.called);

        stub.resetHistory();

        assert.isFalse(stub.called);
    });
});
