"use strict";

var buster = require("buster");
var sinon = require("../../../lib/sinon");
var assert = buster.assert;

buster.testCase("sinon.deepEqual", {
    "passes null": function () {
        assert(sinon.deepEqual(null, null));
    },

    "fails null and object": function () {
        assert.isFalse(sinon.deepEqual(null, {}));
    },

    "fails object and null": function () {
        assert.isFalse(sinon.deepEqual({}, null));
    },

    "fails error and object": function () {
        assert.isFalse(sinon.deepEqual(new Error(), {}));
    },

    "fails object and error": function () {
        assert.isFalse(sinon.deepEqual({}, new Error()));
    },

    "fails regexp and object": function () {
        assert.isFalse(sinon.deepEqual(/.*/, {}));
    },

    "fails object and regexp": function () {
        assert.isFalse(sinon.deepEqual({}, /.*/));
    },

    "passes primitives": function () {
        assert(sinon.deepEqual(1, 1));
    },

    "passes same object": function () {
        var object = {};

        assert(sinon.deepEqual(object, object));
    },

    "passes same function": function () {
        var func = function () {};

        assert(sinon.deepEqual(func, func));
    },

    "passes same array": function () {
        var arr = [];

        assert(sinon.deepEqual(arr, arr));
    },

    "passes same regexp": function () {
        var regexp = /foo/;

        assert(sinon.deepEqual(regexp, regexp));
    },

    "passes equal arrays": function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        assert(sinon.deepEqual(arr1, arr2));
    },

    "passes equal arrays with custom properties": function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        arr1.foo = "bar";
        arr2.foo = "bar";

        assert(sinon.deepEqual(arr1, arr2));
    },

    "fails arrays with unequal custom properties": function () {
        var arr1 = [1, 2, 3, "hey", "there"];
        var arr2 = [1, 2, 3, "hey", "there"];

        arr1.foo = "bar";
        arr2.foo = "not bar";

        assert.isFalse(sinon.deepEqual(arr1, arr2));
    },

    "passes equal regexps": function () {
        var regexp1 = /foo/;
        var regexp2 = /foo/;

        assert(sinon.deepEqual(regexp1, regexp2));

    },

    "fails unequal regexps": function () {
        var regexp1 = /foo/;
        var regexp2 = /bar/;

        assert.isFalse(sinon.deepEqual(regexp1, regexp2));

    },

    "passes equal regexps with same ignoreCase flags": function () {
        var regexp1 = /foo/i;
        var regexp2 = /foo/i;

        assert(sinon.deepEqual(regexp1, regexp2));

    },

    "fails unequal regexps with different ignoreCase flags": function () {
        var regexp1 = /foo/i;
        var regexp2 = /foo/;

        assert.isFalse(sinon.deepEqual(regexp1, regexp2));

    },

    "passes equal regexps with same multiline flags": function () {
        var regexp1 = /foo/m;
        var regexp2 = /foo/m;

        assert(sinon.deepEqual(regexp1, regexp2));

    },

    "fails unequal regexps with different multiline flags": function () {
        var regexp1 = /foo/m;
        var regexp2 = /foo/;

        assert.isFalse(sinon.deepEqual(regexp1, regexp2));
    },

    "passes equal regexps with same global flags": function () {
        var regexp1 = /foo/g;
        var regexp2 = /foo/g;

        assert(sinon.deepEqual(regexp1, regexp2));
    },

    "fails unequal regexps with different global flags": function () {
        var regexp1 = /foo/g;
        var regexp2 = /foo/;

        assert.isFalse(sinon.deepEqual(regexp1, regexp2));
    },

    "passes equal regexps with multiple flags": function () {
        var regexp1 = /bar/im;
        var regexp2 = /bar/im;

        assert(sinon.deepEqual(regexp1, regexp2));
    },

    "fails unequal regexps with multiple flags": function () {
        var regexp1 = /bar/im;
        var regexp2 = /bar/ig;

        assert.isFalse(sinon.deepEqual(regexp1, regexp2));
    },

    "passes NaN and NaN": function () {
        assert(sinon.deepEqual(NaN, NaN));
    },

    "passes equal objects": function () {
        var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
        var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

        assert(sinon.deepEqual(obj1, obj2));
    },

    "fails unequal objects with undefined properties with different names": function () {
        var obj1 = {a: 1, b: 2, c: 3};
        var obj2 = {a: 1, b: 2, foo: undefined};

        assert.isFalse(sinon.deepEqual(obj1, obj2));
    },

    "fails unequal objects with undefined properties with different names (different arg order)": function () {
        var obj1 = {a: 1, b: 2, foo: undefined};
        var obj2 = {a: 1, b: 2, c: 3};

        assert.isFalse(sinon.deepEqual(obj1, obj2));
    },

    "passes equal dates": function () {
        var date1 = new Date(2012, 3, 5);
        var date2 = new Date(2012, 3, 5);

        assert(sinon.deepEqual(date1, date2));
    },

    "fails different dates": function () {
        var date1 = new Date(2012, 3, 5);
        var date2 = new Date(2013, 3, 5);

        assert.isFalse(sinon.deepEqual(date1, date2));
    },

    "in browsers": {
        requiresSupportFor: {
            "document object": typeof document !== "undefined"
        },

        "passes same DOM elements": function () {
            var element = document.createElement("div");

            assert(sinon.deepEqual(element, element));
        },

        "fails different DOM elements": function () {
            var element = document.createElement("div");
            var el = document.createElement("div");

            assert.isFalse(sinon.deepEqual(element, el));
        },

        "does not modify DOM elements when comparing them": function () {
            var el = document.createElement("div");
            document.body.appendChild(el);
            sinon.deepEqual(el, {});

            assert.same(el.parentNode, document.body);
            assert.equals(el.childNodes.length, 0);
        }
    },

    "passes deep objects": function () {
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

        assert(sinon.deepEqual(obj1, obj2));
    },

    "passes object without prototype compared to equal object with prototype": function () {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = { a: 1, b: 2, c: "hey" };

        assert(sinon.deepEqual(obj1, obj2));
    },

    "passes object with prototype compared to equal object without prototype": function () {
        var obj1 = { a: 1, b: 2, c: "hey" };

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert(sinon.deepEqual(obj1, obj2));
    },

    "passes equal objects without prototypes": function () {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert(sinon.deepEqual(obj1, obj2));
    },

    "passes equal objects that override hasOwnProperty": function () {
        var obj1 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };
        var obj2 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };

        assert(sinon.deepEqual(obj1, obj2));
    }

});
