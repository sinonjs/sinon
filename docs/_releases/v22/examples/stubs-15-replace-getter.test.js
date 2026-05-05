require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should replace getter", function () {
        const myObj = {
            prop: "foo",
        };

        sinon.stub(myObj, "prop").get(function getterFn() {
            return "bar";
        });

        assert.equals(myObj.prop, "bar");
    });
});
