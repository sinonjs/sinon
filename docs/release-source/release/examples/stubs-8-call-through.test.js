require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

const obj = {};
obj.sum = function sum(a, b) {
    return a + b;
};

describe("stub", function() {
    it("should call through", function() {
        sinon
            .stub(obj, "sum")
            .withArgs(2, 2)
            .callsFake(function foo() {
                return "bar";
            });

        obj.sum.callThrough();

        assert.equals(obj.sum(2, 2), "bar");
        assert.equals(obj.sum(1, 2), 3);
    });
});
