"use strict";

var referee = require("referee");
var iterableToString = require("../../../lib/sinon/util/core/iterable-to-string");
var assert = referee.assert;

describe("util/core/iterable-to-string", function () {
    it("returns an String representation of Array objects", function () {
        var arr = [1, "one", true, undefined, null];
        var expected = "1,'one',true,undefined,null";

        assert.equals(iterableToString(arr), expected);
    });

    if (typeof Map === "function") {
        it("returns an String representation of Map objects", function () {
            var map = new Map();
            map.set(1, 1);
            map.set("one", "one");
            map.set(true, true);
            map.set(undefined, undefined);
            map.set(null, null);
            var expected = "[1,1]," +
                "['one','one']," +
                "[true,true]," +
                "[undefined,undefined]," +
                "[null,null]";

            assert.equals(iterableToString(map), expected);
        });
    }

    if (typeof Set === "function") {
        it("returns an String representation of Set objects", function () {
            var set = new Set();
            set.add(1);
            set.add("one");
            set.add(true);
            set.add(undefined);
            set.add(null);

            var expected = "1,'one',true,undefined,null";

            assert.equals(iterableToString(set), expected);
        });
    }
});
