require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stubbed callback", () => {
    it("should behave differently based on arguments", () => {
        const callback = sinon.stub();
        callback.withArgs(42).returns(1);
        callback.withArgs(1).throws("name");

        assert.equals(callback(), undefined); // No return value, no exception
        assert.equals(callback(42), 1); // Returns 1
        assert.exception(() => {
            callback(1);
        }); // Throws Error("name")
    });
});
