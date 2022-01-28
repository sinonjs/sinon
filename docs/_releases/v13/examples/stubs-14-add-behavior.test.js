require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should add a custom behavior", function () {
        sinon.addBehavior("returnsNum", function (fake, n) {
            fake.returns(n);
        });

        const stub = sinon.stub().returnsNum(42);

        assert.equals(stub(), 42);
    });
});
