const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

const obj = {};
obj.Sum = function MyConstructor(a, b) {
    this.result = a + b;
};

describe("stub", () => {
    it("should call through with new operator", () => {
        sinon
            .stub(obj, "Sum")
            .callThroughWithNew()
            .withArgs(1, 2)
            .returns({ result: 9000 });

        assert.equals(new obj.Sum(2, 2).result, 4);
        assert.equals(new obj.Sum(1, 2).result, 9000);
    });
});
