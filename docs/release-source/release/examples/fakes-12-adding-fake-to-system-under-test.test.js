require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should have working lastArg property", function () {
        const fake = sinon.fake.returns("42");

        sinon.replace(console, "log", fake);

        assert.equals(console.log("apple pie"), 42);

        // restores all replaced properties set by sinon methods (replace, spy, stub)
        sinon.restore();

        assert.equals(console.log("apple pie"), undefined);
        assert.equals(fake.callCount, 1);
    });
});
