require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should define new setter", function () {
        const myObj = {
            example: "oldValue",
            prop: "foo",
        };

        sinon.stub(myObj, "prop").set(function setterFn(val) {
            myObj.example = val;
        });

        myObj.prop = "baz";

        assert.equals(myObj.example, "baz");
    });
});
