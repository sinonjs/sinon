const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should replace getter", () => {
        const myObj = {
            prop: "foo"
        };

        sinon.stub(myObj, "prop").get(function getterFn() {
            return "bar";
        });

        assert.equals(myObj.prop, "bar");
    });
});
