require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should create fake without behaviour", function () {
        // create a basic fake, with no behavior
        const fake = sinon.fake();

        assert.isUndefined(fake()); // by default returns undefined
        assert.equals(fake.callCount, 1); // saves call information
    });
});
