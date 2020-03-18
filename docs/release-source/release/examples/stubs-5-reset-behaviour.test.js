const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should reset behaviour", () => {
        const stub = sinon.stub();

        stub.returns(54);

        assert.equals(stub(), 54);

        stub.resetBehavior();

        assert.equals(stub(), undefined);
    });
});
