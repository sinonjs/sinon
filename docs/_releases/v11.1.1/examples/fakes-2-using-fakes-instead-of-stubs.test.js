require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should be able to be used instead of stubs", function () {
        const foo = {
            bar: () => "baz",
        };
        // replace method with a fake one
        const fake = sinon.replace(
            foo,
            "bar",
            sinon.fake.returns("fake value")
        );

        assert.equals(fake(), "fake value"); // returns fake value
        assert.equals(fake.callCount, 1); // saves calling information
    });
});
