require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("stubbed callback", function() {
    it("should behave differently based on arguments", function() {
        var callback = sinon.stub();
        callback.withArgs(42).returns(1);
        callback.withArgs(1).throws("name");

        assert.equals(callback(), undefined); // No return value, no exception
        assert.equals(callback(42), 1); // Returns 1
        assert.exception(function() {
            callback(1);
        }); // Throws Error("name")
    });
});
