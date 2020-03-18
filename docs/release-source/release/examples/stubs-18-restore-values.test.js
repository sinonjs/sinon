require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("stub", function() {
    it("should restore values", function() {
        var myObj = {
            example: "oldValue"
        };

        var stub = sinon.stub(myObj, "example").value("newValue");
        stub.restore();

        assert.equals(myObj.example, "oldValue");
    });
});
