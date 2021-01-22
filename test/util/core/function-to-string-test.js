"use strict";

var referee = require("@sinonjs/referee");
var createSpy = require("../../../lib/sinon/spy");
var functionToString = require("../../../lib/sinon/util/core/function-to-string");
var assert = referee.assert;

describe("util/core/functionToString", function () {
    it("returns function's displayName property", function () {
        var fn = function () {
            return;
        };
        fn.displayName = "Larry";

        assert.equals(functionToString.call(fn), "Larry");
    });

    it("guesses name from last call's this object", function () {
        var obj = {};
        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    });

    it("guesses name from any call where property can be located", function () {
        var obj = {};
        var otherObj = { id: 42 };

        obj.doStuff = createSpy();
        obj.doStuff.call({});
        obj.doStuff();
        obj.doStuff.call(otherObj);

        assert.equals(functionToString.call(obj.doStuff), "doStuff");
    });

    // https://github.com/sinonjs/sinon/issues/2215
    it("ignores errors thrown by property accessors on thisValue", function () {
        var obj = {};

        Object.defineProperty(obj, "foo", {
            enumerable: true,
            get: function () {
                throw new Error();
            },
        });

        // this will cause `fn` to be after `foo` when enumerated
        obj.fn = function () {
            return "foo";
        };

        // validate that the keys are in the expected order that will cause the bug
        var keys = Object.keys(obj);
        assert.equals(keys[0], "foo");
        assert.equals(keys[1], "fn");

        var spy = createSpy(obj, "fn");

        obj.fn();

        assert.equals(spy.toString(), "fn");
    });
});
