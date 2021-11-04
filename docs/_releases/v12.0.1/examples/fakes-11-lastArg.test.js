require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("FakeTest", function () {
    it("should have working lastArg", function () {
        const f = sinon.fake();
        const date1 = new Date();
        const date2 = new Date();

        f(1, 2, date1);
        f(1, 2, date2);

        assert.isTrue(f.lastArg === date2);
        // spy call methods:
        assert.isTrue(f.getCall(0).lastArg === date1);
        assert.isTrue(f.getCall(1).lastArg === date2);
        assert.isTrue(f.lastCall.lastArg === date2);
    });
});
