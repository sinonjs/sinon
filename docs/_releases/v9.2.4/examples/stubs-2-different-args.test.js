require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const { assert } = require("@sinonjs/referee");

describe("stubbed callback", function() {
    it("should behave differently based on arguments", function() {
        const callback = sinon.stub();
        callback.withArgs(42).returns(1);
        callback.withArgs(1).throws("name");

        assert.isUndefined(callback()); // No return value, no exception
        assert.equals(callback(42), 1); // Returns 1
        assert.equals(callback.withArgs(42).callCount, 1);// Use withArgs in assertion
        assert.exception(() => {
            callback(1);
        }); // Throws Error("name")
    });
});
