require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

const myObj = {};
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
