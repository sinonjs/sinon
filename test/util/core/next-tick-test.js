"use strict";

var referee = require("@sinonjs/referee");
var nextTick = require("../../../lib/sinon/util/core/next-tick");
var assert = referee.assert;

var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
var hasSetImmediate = typeof setImmediate === "function";

describe("util/core/next-tick", function() {
    describe("browser environment", function() {
        before(function() {
            if (hasNextTick || hasSetImmediate) {
                this.skip();
            }
        });

        it("should use fallback", function() {
            assert.isFunction(nextTick);
            assert.contains(String(nextTick), "setTimeout(");
        });
    });

    describe("modern node environment", function() {
        before(function() {
            if (!hasNextTick) {
                this.skip();
            }
        });

        it("should use process.nextTick", function() {
            assert.same(nextTick, process.nextTick);
        });
    });

    describe("old node environment", function() {
        before(function() {
            if (hasNextTick || !hasSetImmediate) {
                this.skip();
            }
        });

        it("should use setImmediate", function() {
            assert.same(nextTick, setImmediate);
        });
    });
});
