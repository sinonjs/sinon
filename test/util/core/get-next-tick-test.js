"use strict";

var referee = require("@sinonjs/referee");
var getNextTick = require("../../../lib/sinon/util/core/get-next-tick");
var assert = referee.assert;

describe("util/core/get-next-tick", function () {
    it("should use process.nextTick when available", function () {
        var mockProcess = {
            nextTick: function () {}
        };

        assert.same(getNextTick(mockProcess), mockProcess.nextTick);
    });

    it("should use setImmediate when process.nextTick is not available", function () {
        function mockSetImmediate() {}

        assert.same(getNextTick(undefined, mockSetImmediate), mockSetImmediate);
    });

    it("should fallback to setTimeout", function () {
        var nextTick = getNextTick(undefined, undefined);

        assert.isFunction(nextTick);
        assert.contains(String(nextTick), "setTimeout(");
    });
});
