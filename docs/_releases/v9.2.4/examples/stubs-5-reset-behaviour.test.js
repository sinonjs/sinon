require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const { assert } = require("@sinonjs/referee");

describe("stub", function() {
    it("should reset behaviour", function() {
        const stub = sinon.stub();

        stub.returns(54);

        assert.equals(stub(), 54);

        stub.resetBehavior();

        assert.isUndefined(stub());
    });
});
