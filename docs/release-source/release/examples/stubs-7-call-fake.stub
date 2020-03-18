require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;

var myObj = {};
myObj.prop = function propFn() {
    return "foo";
};

describe("stub", function() {
    it("should call fake", function() {
        sinon.stub(myObj, "prop").callsFake(function fakeFn() {
            return "bar";
        });

        assert.equals(myObj.prop(), "bar");
    });
});
