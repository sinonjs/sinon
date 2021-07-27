require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should behave differently on consecutive calls with certain argument", function () {
        const callback = sinon.stub();
        callback
            .withArgs(42)
            .onFirstCall()
            .returns(1)
            .onSecondCall()
            .returns(2);
        callback.returns(0);

        assert.equals(callback(1), 0);
        assert.equals(callback(42), 1);
        assert.equals(callback(1), 0);
        assert.equals(callback(42), 2);
        assert.equals(callback(1), 0);
        assert.equals(callback(42), 0);
    });
});
