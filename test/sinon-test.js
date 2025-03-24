"use strict";

const assert = require("@sinonjs/referee").assert;
const functionName = require("@sinonjs/commons").functionName;
const Sandbox = require("../lib/sinon/sandbox");

describe("sinon module", function () {
    let sinon;

    before(function () {
        if (typeof Promise !== "function") {
            this.skip();
        }
    });

    describe("exports", function () {
        describe("default sandbox", function () {
            it("should be an instance of Sandbox", function () {
                sinon = require("../lib/sinon");

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
