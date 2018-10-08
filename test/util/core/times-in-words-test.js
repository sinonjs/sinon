"use strict";

var referee = require("@sinonjs/referee");
var timesInWords = require("../../../lib/sinon/util/core/times-in-words");
var assert = referee.assert;

describe("util/core/timesInWords", function() {
    it('should return "once" for input of 1', function() {
        var result = timesInWords(1);
        assert.equals(result, "once");
    });

    it('should return "twice" for input of 2', function() {
        var result = timesInWords(2);
        assert.equals(result, "twice");
    });

    it('should return "thrice" for input of 3', function() {
        var result = timesInWords(3);
        assert.equals(result, "thrice");
    });

    it('should return "n times" for n larger than 3', function() {
        var result, i;

        for (i = 4; i < 100; i++) {
            result = timesInWords(i);
            assert.equals(result, i + " times");
        }
    });

    it('should return "0 times" for falsy input', function() {
        var falsies = [0, NaN, null, false, undefined, ""];
        var result, i;

        for (i = 0; i < falsies.length; i++) {
            result = timesInWords(falsies[i]);
            assert.equals(result, "0 times");
        }
    });
});
