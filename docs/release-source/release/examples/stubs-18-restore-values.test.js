require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should restore values", () => {
        const myObj = {
            example: "oldValue"
        };

        const stub = sinon.stub(myObj, "example").value("newValue");
        stub.restore();

        assert.equals(myObj.example, "oldValue");
    });
});
