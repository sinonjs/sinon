const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

const myObj = {};
myObj.prop = function propFn() {
    return "foo";
};

describe("stub", () => {
    it("should call fake", () => {
        sinon.stub(myObj, "prop").callsFake(function fakeFn() {
            return "bar";
        });

        assert.equals(myObj.prop(), "bar");
    });
});
