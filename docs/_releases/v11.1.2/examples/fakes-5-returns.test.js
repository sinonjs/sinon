require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should create a fake that 'returns'", function () {
        const fake = sinon.fake.returns("apple pie");

        assert.equals(fake(), "apple pie");
    });
});
