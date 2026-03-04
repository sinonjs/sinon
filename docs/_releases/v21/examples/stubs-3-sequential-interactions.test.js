require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should behave differently on consecutive calls", function () {
        const callback = sinon.stub();
        callback.onCall(0).returns(1);
        callback.onCall(1).returns(2);
        callback.returns(3);

        assert.equals(callback(), 1); // Returns 1
        assert.equals(callback(), 2); // Returns 2
        assert.equals(callback(), 3); // All following calls return 3
    });
});
