"use strict";

var referee = require("@sinonjs/referee");
var createSpy = require("../../../lib/sinon/spy");
var functionToString = require("../../../lib/sinon/util/core/function-to-string");
var assert = referee.assert;

describe("util/core/functionToString", function() {
    it("returns function's displayName property", function() {
        var fn = function() {
            return;
        };
        fn.displayName = "Larry";

        assert.equals(functionToString.call(fn), "Larry");
    });

    it("guesses name from last call's this object", function() {
        var obj = {};
        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    });

    it("guesses name from any call where property can be located", function() {
        var obj = {};
        var otherObj = { id: 42 };

        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();
        obj.doStuff.call(otherObj);

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    });
});
