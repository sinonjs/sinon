require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should have working callback", function () {
        const f = sinon.fake();
        const cb1 = function () {};
        const cb2 = function () {};

        f(1, 2, 3, cb1);
        f(1, 2, 3, cb2);

        assert.isTrue(f.callback === cb2);
        // spy call methods:
        assert.isTrue(f.getCall(1).callback === cb2);
        assert.isTrue(f.lastCall.callback === cb2);
    });
});
