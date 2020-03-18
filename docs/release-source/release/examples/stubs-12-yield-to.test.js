const { it, describe } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", () => {
    it("should call specified callback", () => {
        let actual;
        const callback = sinon.stub();
        callback({
            success() {
                actual = "Success!";
            },
            failure() {
                actual = "Oh noes!";
            }
        });

        callback.yieldTo("failure");

        assert.equals(actual, "Oh noes!");
    });
});
