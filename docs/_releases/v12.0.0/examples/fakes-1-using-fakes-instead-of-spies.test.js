require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should be able to be used instead of spies", function () {
        const foo = {
            bar: () => "baz",
        };
        // wrap existing method without changing its behaviour
        const fake = sinon.replace(foo, "bar", sinon.fake(foo.bar));

        assert.equals(fake(), "baz"); // behaviour is the same
        assert.equals(fake.callCount, 1); // calling information is saved
    });
});
