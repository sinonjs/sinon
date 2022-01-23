require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should create a fake that 'throws'", function () {
        const fake = sinon.fake.throws(new Error("not apple pie"));

        // Expected to throw an error with message 'not apple pie'
        assert.exception(fake, { name: "Error", message: "not apple pie" });
    });
});
