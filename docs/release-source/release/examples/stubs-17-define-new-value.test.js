const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should define new value", () => {
        const myObj = {
            example: "oldValue"
        };

        sinon.stub(myObj, "example").value("newValue");

        assert.equals(myObj.example, "newValue");
    });
});
