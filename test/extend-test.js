(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../lib/sinon");
    var assert = buster.assert;

    buster.testCase("sinon.extend", {
        "should return unaltered target when only one argument": function () {
            var target = { hello: "world" };

            sinon.extend(target);

            assert.equals(target, { hello: "world" });
        },

        "should copy all (own) properties into first argument, from all subsequent arguments": function () {
            var target = { hello: "world" };

            sinon.extend(target, { a: "a" }, { b: "b" });

            assert.equals(target.hello, "world");
            assert.equals(target.a, "a");
            assert.equals(target.b, "b");
        },

        "should copy toString method into target": function () {
            var target = {
                hello: "world",
                toString: function () {
                    return "hello world";
                }
            };
            var source = {
                toString: function () {
                    return "hello source";
                }
            };

            sinon.extend(target, source);

            assert.same(target.toString, source.toString);
        },

        "must copy the last occuring property into the target": function () {
            var target = { a: 0, b: 0, c: 0, d: 0 };
            var source1 = { a: 1, b: 1, c: 1 };
            var source2 = { a: 2, b: 2 };
            var source3 = { a: 3 };

            sinon.extend(target, source1, source2, source3);

            assert.equals(target.a, 3);
            assert.equals(target.b, 2);
            assert.equals(target.c, 1);
            assert.equals(target.d, 0);
        }
    });
}(this));
