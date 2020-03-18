require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

var obj = {};
obj.Sum = function MyConstructor(a, b) {
    this.result = a + b;
};

describe("stub", function() {
    it("should call through with new operator", function() {
        sinon
            .stub(obj, "Sum")
            .callThroughWithNew()
            .withArgs(1, 2)
            .returns({ result: 9000 });

        assert.equals(new obj.Sum(2, 2).result, 4);
        assert.equals(new obj.Sum(1, 2).result, 9000);
    });
});
