require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

describe("stub", function() {
    it("should define new value", function() {
        var myObj = {
            example: "oldValue"
        };

        sinon.stub(myObj, "example").value("newValue");

        assert.equals(myObj.example, "newValue");
    });
});
