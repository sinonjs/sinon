"use strict";

const referee = require("@sinonjs/referee");
const getNextTick = require("../../../lib/sinon/util/core/get-next-tick");
const assert = referee.assert;

describe("util/core/get-next-tick", function () {
    it("should use process.nextTick when available", function () {
        const mockProcess = {
            nextTick: function () {
                return;
            },
        };

        assert.same(getNextTick(mockProcess), mockProcess.nextTick);
    });

    it("should use setImmediate when process.nextTick is not available", function () {
        function mockSetImmediate() {
            return;
        }

        assert.same(getNextTick(undefined, mockSetImmediate), mockSetImmediate);
    });

    it("should fallback to setTimeout", function () {
        const nextTick = getNextTick(undefined, undefined);

        assert.isFunction(nextTick);
        assert.contains(String(nextTick), "setTimeout(");
    });
});
