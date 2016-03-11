"use strict";

var referee = require("referee");
var deepEqual = require("../../../lib/sinon/util/core/deep-equal");
var assert = referee.assert;

describe("util/core/deepEqual", function () {
    it("passes null", function () {
        assert(deepEqual(null, null));
    });

    it("fails null and object", function () {
        assert.isFalse(deepEqual(null, {}));
    });

    it("fails object and null", function () {
        assert.isFalse(deepEqual({}, null));
    });

    it("fails error and object", function () {
        assert.isFalse(deepEqual(new Error(), {}));
    });

    it("fails object and error", function () {
        assert.isFalse(deepEqual({}, new Error()));
    });

    it("fails regexp and object", function () {
        assert.isFalse(deepEqual(/.*/, {}));
    });

    it("fails object and regexp", function () {
        assert.isFalse(deepEqual({}, /.*/));
    });

    it("passes primitives", function () {
        assert(deepEqual(1, 1));
    });

    it("passes same object", function () {
        var object = {};

        assert(deepEqual(object, object));
    });

    it("passes same function", function () {
        var func = function () {};

        assert(deepEqual(func, func));
    });

    it("passes same array", function () {
        var arr = [];

        assert(deepEqual(arr, arr));
    });

    it("passes same regexp", function () {
        var regexp = /foo/;

        assert(deepEqual(regexp, regexp));
    });

    it("passes equal arrays", function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        assert(deepEqual(arr1, arr2));
    });

    it("passes equal arrays with custom properties", function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        arr1.foo = "bar";
        arr2.foo = "bar";

        assert(deepEqual(arr1, arr2));
    });

    it("fails arrays with unequal custom properties", function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        arr1.foo = "bar";
        arr2.foo = "not bar";

        assert.isFalse(deepEqual(arr1, arr2));
    });

    it("passes equal regexps", function () {
        var regexp1 = /foo/;
        var regexp2 = /foo/;

        assert(deepEqual(regexp1, regexp2));

    });

    it("fails unequal regexps", function () {
        var regexp1 = /foo/;
        var regexp2 = /bar/;

        assert.isFalse(deepEqual(regexp1, regexp2));

    });

    it("passes equal regexps with same ignoreCase flags", function () {
        var regexp1 = /foo/i;
        var regexp2 = /foo/i;

        assert(deepEqual(regexp1, regexp2));

    });

    it("fails unequal regexps with different ignoreCase flags", function () {
        var regexp1 = /foo/i;
        var regexp2 = /foo/;

        assert.isFalse(deepEqual(regexp1, regexp2));

    });

    it("passes equal regexps with same multiline flags", function () {
        var regexp1 = /foo/m;
        var regexp2 = /foo/m;

        assert(deepEqual(regexp1, regexp2));

    });

    it("fails unequal regexps with different multiline flags", function () {
        var regexp1 = /foo/m;
        var regexp2 = /foo/;

        assert.isFalse(deepEqual(regexp1, regexp2));
    });

    it("passes equal regexps with same global flags", function () {
        var regexp1 = /foo/g;
        var regexp2 = /foo/g;

        assert(deepEqual(regexp1, regexp2));
    });

    it("fails unequal regexps with different global flags", function () {
        var regexp1 = /foo/g;
        var regexp2 = /foo/;

        assert.isFalse(deepEqual(regexp1, regexp2));
    });

    it("passes equal regexps with multiple flags", function () {
        var regexp1 = /bar/im;
        var regexp2 = /bar/im;

        assert(deepEqual(regexp1, regexp2));
    });

    it("fails unequal regexps with multiple flags", function () {
        var regexp1 = /bar/im;
        var regexp2 = /bar/ig;

        assert.isFalse(deepEqual(regexp1, regexp2));
    });

    it("passes NaN and NaN", function () {
        assert(deepEqual(NaN, NaN));
    });

    it("passes equal objects", function () {
        var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
        var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

        assert(deepEqual(obj1, obj2));
    });

    it("fails unequal objects with undefined properties with different names", function () {
        var obj1 = {a: 1, b: 2, c: 3};
        var obj2 = {a: 1, b: 2, foo: undefined};

        assert.isFalse(deepEqual(obj1, obj2));
    });

    it("fails unequal objects with undefined properties with different names (different arg order)", function () {
        var obj1 = {a: 1, b: 2, foo: undefined};
        var obj2 = {a: 1, b: 2, c: 3};

        assert.isFalse(deepEqual(obj1, obj2));
    });

    it("passes equal dates", function () {
        var date1 = new Date(2012, 3, 5);
        var date2 = new Date(2012, 3, 5);

        assert(deepEqual(date1, date2));
    });

    it("fails different dates", function () {
        var date1 = new Date(2012, 3, 5);
        var date2 = new Date(2013, 3, 5);

        assert.isFalse(deepEqual(date1, date2));
    });

    if (typeof document !== "undefined") {
        describe("in browsers", function () {

            it("passes same DOM elements", function () {
                var element = document.createElement("div");

                assert(deepEqual(element, element));
            });

            it("fails different DOM elements", function () {
                var element = document.createElement("div");
                var el = document.createElement("div");

                assert.isFalse(deepEqual(element, el));
            });

            it("does not modify DOM elements when comparing them", function () {
                var el = document.createElement("div");
                document.body.appendChild(el);
                deepEqual(el, {});

                assert.same(el.parentNode, document.body);
                assert.equals(el.childNodes.length, 0);
            });
        });
    }

    it("passes deep objects", function () {
        var func = function () {};

        var obj1 = {
            a: 1,
            b: 2,
            c: 3,
            d: "hey",
            e: "there",
            f: func,
            g: {
                a1: [1, 2, "3", {
                    prop: [func, "b"]
                }]
            }
        };

        var obj2 = {
            a: 1,
            b: 2,
            c: 3,
            d: "hey",
            e: "there",
            f: func,
            g: {
                a1: [1, 2, "3", {
                    prop: [func, "b"]
                }]
            }
        };

        assert(deepEqual(obj1, obj2));
    });

    it("passes object without prototype compared to equal object with prototype", function () {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = { a: 1, b: 2, c: "hey" };

        assert(deepEqual(obj1, obj2));
    });

    it("passes object with prototype compared to equal object without prototype", function () {
        var obj1 = { a: 1, b: 2, c: "hey" };

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert(deepEqual(obj1, obj2));
    });

    it("passes equal objects without prototypes", function () {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert(deepEqual(obj1, obj2));
    });

    it("passes equal objects that override hasOwnProperty", function () {
        var obj1 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };
        var obj2 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };

        assert(deepEqual(obj1, obj2));
    });

});
