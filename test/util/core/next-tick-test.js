"use strict";

const referee = require("@sinonjs/referee");
const nextTick = require("../../../lib/sinon/util/core/next-tick");
const assert = referee.assert;

const hasNextTick =
    typeof process === "object" && typeof process.nextTick === "function";
const hasSetImmediate = typeof setImmediate === "function";

describe("util/core/next-tick", function () {
    describe("browser environment", function () {
        before(function () {
            if (hasNextTick || hasSetImmediate) {
                this.skip();
            }
        });

        it("should use fallback", function () {
            assert.isFunction(nextTick);
            assert.contains(String(nextTick), "setTimeout(");
        });
    });

    describe("modern node environment", function () {
        before(function () {
            if (!hasNextTick) {
                this.skip();
            }
        });

        it("should use process.nextTick", function () {
            assert.same(nextTick, process.nextTick);
        });
    });

    describe("old node environment", function () {
        before(function () {
            if (hasNextTick || !hasSetImmediate) {
                this.skip();
            }
        });

        it("should use setImmediate", function () {
            assert.same(nextTick, setImmediate);
        });
    });
});
