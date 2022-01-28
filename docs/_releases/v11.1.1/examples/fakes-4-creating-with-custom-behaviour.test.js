require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should create fake with custom behaviour", function () {
        // create a fake that returns the text "foo"
        const fake = sinon.fake.returns("foo");

        assert.equals(fake(), "foo");
    });
});
