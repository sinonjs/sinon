"use strict";

var referee = require("@sinonjs/referee");
var extend = require("../lib/sinon/util/core/extend");
var assert = referee.assert;

describe("extend", function() {
    it("should return unaltered target when only one argument", function() {
        var target = { hello: "world" };

        extend(target);

        assert.equals(target, { hello: "world" });
    });

    it("should copy all (own) properties into first argument, from all subsequent arguments", function() {
        var target = { hello: "world" };

        extend(target, { a: "a" }, { b: "b" });

        assert.equals(target.hello, "world");
        assert.equals(target.a, "a");
        assert.equals(target.b, "b");
    });

    it("should copy toString method into target", function() {
        var target = {
            hello: "world",
            toString: function() {
                return "hello world";
            }
        };
        var source = {
            toString: function() {
                return "hello source";
            }
        };

        extend(target, source);

        assert.same(target.toString, source.toString);
    });

    it("must copy the last occurring property into the target", function() {
        var target = { a: 0, b: 0, c: 0, d: 0 };
        var source1 = { a: 1, b: 1, c: 1 };
        var source2 = { a: 2, b: 2 };
        var source3 = { a: 3 };

        extend(target, source1, source2, source3);

        assert.equals(target.a, 3);
        assert.equals(target.b, 2);
        assert.equals(target.c, 1);
        assert.equals(target.d, 0);
    });

    it("copies all properties", function() {
        var object1 = {
            prop1: null,
            prop2: false
        };

        var object2 = {
            prop3: "hey",
            prop4: 4
        };

        var result = extend({}, object1, object2);

        var expected = {
            prop1: null,
            prop2: false,
            prop3: "hey",
            prop4: 4
        };

        assert.equals(result, expected);
    });
});
