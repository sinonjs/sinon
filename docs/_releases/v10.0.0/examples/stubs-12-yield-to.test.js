require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

describe("stub", function () {
    it("should call specified callback", function () {
        let actual;
        const callback = sinon.stub();
        callback({
            success() {
                actual = "Success!";
            },
            failure() {
                actual = "Oh noes!";
            },
        });

        callback.yieldTo("failure");

        assert.equals(actual, "Oh noes!");
    });
});
