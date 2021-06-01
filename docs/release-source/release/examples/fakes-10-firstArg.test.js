require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should have working firstArg", function () {
        const f = sinon.fake();
        const date1 = new Date();
        const date2 = new Date();

        f(date1, 1, 2);
        f(date2, 1, 2);

        assert.isTrue(f.firstArg === date2);
    });
});
