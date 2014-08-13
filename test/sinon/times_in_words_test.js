"use strict";

if (typeof require === "function" && typeof module === "object") {
    var buster = require("../runner");
    var sinon = require("../../lib/sinon");
}

buster.testCase("sinon.timesInWords", {
    "should return \"once\" for input of 1": function () {
        var result = sinon.timesInWords(1);
        assert.equals(result, "once");
    },

    "should return \"twice\" for input of 2": function () {
        var result = sinon.timesInWords(2);
        assert.equals(result, "twice");
    },

    "should return \"thrice\" for input of 3": function () {
        var result = sinon.timesInWords(3);
        assert.equals(result, "thrice");
    },

    "should return \"n times\" for n larger than 3": function () {
        var result, i;

        for (i = 4; i < 100; i++) {
            result = sinon.timesInWords(i);
            assert.equals(result, i + " times");
        }
    },

    "should return \"0 times\" for falsy input": function () {
        var falsies = [0, NaN, null, false, undefined, ""],
            result, i;

        for (i = 0; i < falsies.length; i++) {
            result = sinon.timesInWords(falsies[i]);
            assert.equals(result, "0 times");
        }
    }
});
