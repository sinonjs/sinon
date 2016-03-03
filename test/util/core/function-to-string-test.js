"use strict";

var buster = require("buster");
var createSpy = require("../../../lib/sinon/spy");
var functionToString = require("../../../lib/sinon/util/core/function-to-string");
var assert = buster.assert;

buster.testCase("util/core/functionToString", {
    "returns function's displayName property": function () {
        var fn = function () {};
        fn.displayName = "Larry";

        assert.equals(functionToString.call(fn), "Larry");
    },

    "guesses name from last call's this object": function () {
        var obj = {};
        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    },

    "guesses name from any call where property can be located": function () {
        var obj = {};
        var otherObj = { id: 42 };

        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();
        obj.doStuff.call(otherObj);

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    }
});
