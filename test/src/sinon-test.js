import commons from "@sinonjs/commons";
import referee from "@sinonjs/referee";
import sinon from "../../src/sinon.js";
import Sandbox from "../../src/sinon/sandbox.js";

const assert = referee.assert;
const functionName = commons.functionName;

describe("sinon module", function () {
    before(function () {
        if (typeof Promise !== "function") {
            this.skip();
        }
    });

    describe("exports", function () {
        describe("default sandbox", function () {
            it("should be an instance of Sandbox", function () {
                assert.hasPrototype(sinon, Sandbox.prototype);
            });
        });

        describe("createSandbox", function () {
            it("should be a unary Function named 'createSandbox'", function () {
                assert.isFunction(sinon.createSandbox);
                assert.equals(sinon.createSandbox.length, 1);
                // Use helper because IE 11 doesn't support the `name` property:
                assert.equals(
                    functionName(sinon.createSandbox),
                    "createSandbox",
                );
            });
        });
    });
});
