var buster = require("buster");
var assert = buster.assert;

var match = require("../../lib/sinon/match");

function propertyMatcherTests(matcher) {
    return {
        "returns matcher": function () {
            var has = matcher("foo");

            assert(match.isMatcher(has));
        },

        "throws if first argument is not string": function () {
            assert.exception(function () {
                matcher();
            }, "TypeError");
            assert.exception(function () {
                matcher(123);
            }, "TypeError");
        },

        "returns false if value is undefined or null": function () {
            var has = matcher("foo");

            assert.isFalse(has.test(undefined));
            assert.isFalse(has.test(null));
        },

        "returns true if object has property": function () {
            var has = matcher("foo");

            assert(has.test({ foo: null }));
        },

        "returns false if object value is not equal to given value": function () {
            var has = matcher("foo", 1);

            assert.isFalse(has.test({ foo: null }));
        },

        "returns true if object value is equal to given value": function () {
            var has = matcher("message", "sinon rocks");

            assert(has.test({ message: "sinon rocks" }));
            assert(has.test(new Error("sinon rocks")));
        },

        "returns true if string property matches": function () {
            var has = matcher("length", 5);

            assert(has.test("sinon"));
        },

        "allows to expect undefined": function () {
            var has = matcher("foo", undefined);

            assert.isFalse(has.test({ foo: 1 }));
        },

        "compares value deeply": function () {
            var has = matcher("foo", { bar: "doo", test: 42 });

            assert(has.test({ foo: { bar: "doo", test: 42 } }));
        },

        "compares with matcher": function () {
            var has = matcher("callback", match.typeOf("function"));

            assert(has.test({ callback: function () {} }));
        }
    };
}

buster.testCase("match", {
    "returns matcher": function () {
        var m = match(function () {});

        assert(match.isMatcher(m));
    },

    "exposes test function": function () {
        var test = function () {};

        var m = match(test);

        assert.same(m.test, test);
    },

    "returns true if properties are equal": function () {
        var m = match({ str: "sinon", nr: 1 });

        assert(m.test({ str: "sinon", nr: 1, other: "ignored" }));
    },

    "returns true if properties are deep equal": function () {
        var m = match({ deep: { str: "sinon" } });

        assert(m.test({ deep: { str: "sinon", ignored: "value" } }));
    },

    "returns false if a property is not equal": function () {
        var m = match({ str: "sinon", nr: 1 });

        assert.isFalse(m.test({ str: "sinon", nr: 2 }));
    },

    "returns false if a property is missing": function () {
        var m = match({ str: "sinon", nr: 1 });

        assert.isFalse(m.test({ nr: 1 }));
    },

    "returns true if array is equal": function () {
        var m = match({ arr: ["a", "b"] });

        assert(m.test({ arr: ["a", "b"] }));
    },

    "returns false if array is not equal": function () {
        var m = match({ arr: ["b", "a"] });

        assert.isFalse(m.test({ arr: ["a", "b"] }));
    },

    "returns true if number objects are equal": function () {
        var m = match({ one: new Number(1) });

        assert(m.test({ one: new Number(1) }));
    },

    "returns true if test matches": function () {
        var m = match({ prop: match.typeOf("boolean") });

        assert(m.test({ prop: true }));
    },

    "returns false if test does not match": function () {
        var m = match({ prop: match.typeOf("boolean") });

        assert.isFalse(m.test({ prop: "no" }));
    },

    "returns true if deep test matches": function () {
        var m = match({ deep: { prop: match.typeOf("boolean") } });

        assert(m.test({ deep: { prop: true } }));
    },

    "returns false if deep test does not match": function () {
        var m = match({ deep: { prop: match.typeOf("boolean") } });

        assert.isFalse(m.test({ deep: { prop: "no" } }));
    },

    "returns false if tested value is null or undefined": function () {
        var m = match({});

        assert.isFalse(m.test(null));
        assert.isFalse(m.test(undefined));
    },

    "returns true if error message matches": function () {
        var m = match({ message: "evil error" });

        assert(m.test(new Error("evil error")));
    },

    "returns true if string property matches": function () {
        var m = match({ length: 5 });

        assert(m.test("sinon"));
    },

    "returns true if number property matches": function () {
        var m = match({ toFixed: match.func });

        assert(m.test(0));
    },

    "returns true for string match": function () {
        var m = match("sinon");

        assert(m.test("sinon"));
    },

    "returns true for substring match": function () {
        var m = match("no");

        assert(m.test("sinon"));
    },

    "returns false for string mismatch": function () {
        var m = match("Sinon.JS");

        assert.isFalse(m.test(null));
        assert.isFalse(m.test({}));
        assert.isFalse(m.test("sinon"));
        assert.isFalse(m.test("sinon.js"));
    },

    "returns true for regexp match": function () {
        var m = match(/^[sino]+$/);

        assert(m.test("sinon"));
    },

    "returns false for regexp string mismatch": function () {
        var m = match(/^[sin]+$/);

        assert.isFalse(m.test("sinon"));
    },

    "returns false for regexp type mismatch": function () {
        var m = match(/.*/);

        assert.isFalse(m.test());
        assert.isFalse(m.test(null));
        assert.isFalse(m.test(123));
        assert.isFalse(m.test({}));
    },

    "returns true for number match": function () {
        var m = match(1);

        assert(m.test(1));
        assert(m.test("1"));
        assert(m.test(true));
    },

    "returns false for number mismatch": function () {
        var m = match(1);

        assert.isFalse(m.test());
        assert.isFalse(m.test(null));
        assert.isFalse(m.test(2));
        assert.isFalse(m.test(false));
        assert.isFalse(m.test({}));
    },

    "returns true if test function in object returns true": function () {
        var m = match({ test: function () { return true; }});

        assert(m.test());
    },

    "returns false if test function in object returns false": function () {
        var m = match({ test: function () { return false; }});

        assert.isFalse(m.test());
    },

    "returns false if test function in object returns nothing": function () {
        var m = match({ test: function () {}});

        assert.isFalse(m.test());
    },

    "passes actual value to test function in object": function () {
        var m = match({ test: function (arg) { return arg; }});

        assert(m.test(true));
    },

    "uses matcher": function () {
        var m = match(match("test"));

        assert(m.test("testing"));
    },

    ".toString": {
        "returns message": function () {
            var message = "hello sinon.match";

            var m = match(function () {}, message);

            assert.same(m.toString(), message);
        },

        "defaults to match(functionName)": function () {
            var func = function custom() {};
            var m = match(func);

            assert.same(m.toString(), "match(custom)");
        }
    },

    ".any": {
        "is matcher": function () {
            assert(match.isMatcher(match.any));
        },

        "returns true when tested": function () {
            assert(match.any.test());
        }
    },

    ".defined": {
        "is matcher": function () {
            assert(match.isMatcher(match.defined));
        },

        "returns false if test is called with null": function () {
            assert.isFalse(match.defined.test(null));
        },

        "returns false if test is called with undefined": function () {
            assert.isFalse(match.defined.test(undefined));
        },

        "returns true if test is called with any value": function () {
            assert(match.defined.test(false));
            assert(match.defined.test(true));
            assert(match.defined.test(0));
            assert(match.defined.test(1));
            assert(match.defined.test(""));
        },

        "returns true if test is called with any object": function () {
            assert(match.defined.test({}));
            assert(match.defined.test(function () {}));
        }
    },

    ".truthy": {
        "is matcher": function () {
            assert(match.isMatcher(match.truthy));
        },

        "returns true if test is called with trueish value": function () {
            assert(match.truthy.test(true));
            assert(match.truthy.test(1));
            assert(match.truthy.test("yes"));
        },

        "returns false if test is called falsy value": function () {
            assert.isFalse(match.truthy.test(false));
            assert.isFalse(match.truthy.test(null));
            assert.isFalse(match.truthy.test(undefined));
            assert.isFalse(match.truthy.test(""));
        }
    },

    ".falsy": {
        "is matcher": function () {
            assert(match.isMatcher(match.falsy));
        },

        "returns true if test is called falsy value": function () {
            assert(match.falsy.test(false));
            assert(match.falsy.test(null));
            assert(match.falsy.test(undefined));
            assert(match.falsy.test(""));
        },

        "returns false if test is called with trueish value": function () {
            assert.isFalse(match.falsy.test(true));
            assert.isFalse(match.falsy.test(1));
            assert.isFalse(match.falsy.test("yes"));
        }
    },

    ".same": {
        "returns matcher": function () {
            var same = match.same();

            assert(match.isMatcher(same));
        },

        "returns true if test is called with same argument": function () {
            var object = {};
            var same = match.same(object);

            assert(same.test(object));
        },

        "returns false if test is not called with same argument": function () {
            var same = match.same({});

            assert.isFalse(same.test({}));
        }
    },

    ".typeOf": {
        "throws if given argument is not a string": function () {
            assert.exception(function () {
                match.typeOf();
            }, "TypeError");
            assert.exception(function () {
                match.typeOf(123);
            }, "TypeError");
        },

        "returns matcher": function () {
            var typeOf = match.typeOf("string");

            assert(match.isMatcher(typeOf));
        },

        "returns true if test is called with string": function () {
            var typeOf = match.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        },

        "returns false if test is not called with string": function () {
            var typeOf = match.typeOf("string");

            assert.isFalse(typeOf.test(123));
        },

        "returns true if test is called with regexp": function () {
            var typeOf = match.typeOf("regexp");

            assert(typeOf.test(/.+/));
        },

        "returns false if test is not called with regexp": function () {
            var typeOf = match.typeOf("regexp");

            assert.isFalse(typeOf.test(true));
        }
    },

    ".instanceOf": {
        "throws if given argument is not a function": function () {
            assert.exception(function () {
                match.instanceOf();
            }, "TypeError");
            assert.exception(function () {
                match.instanceOf("foo");
            }, "TypeError");
        },

        "returns matcher": function () {
            var instanceOf = match.instanceOf(function () {});

            assert(match.isMatcher(instanceOf));
        },

        "returns true if test is called with instance of argument": function () {
            var instanceOf = match.instanceOf(Array);

            assert(instanceOf.test([]));
        },

        "returns false if test is not called with instance of argument": function () {
            var instanceOf = match.instanceOf(Array);

            assert.isFalse(instanceOf.test({}));
        }
    },

    ".has": propertyMatcherTests(match.has),
    ".hasOwn": propertyMatcherTests(match.hasOwn),

    ".hasSpecial": {
        "returns true if object has inherited property": function () {
            var has = match.has("toString");

            assert(has.test({}));
        },

        "only includes property in message": function () {
            var has = match.has("test");

            assert.equals(has.toString(), "has(\"test\")");
        },

        "includes property and value in message": function () {
            var has = match.has("test", undefined);

            assert.equals(has.toString(), "has(\"test\", undefined)");
        },

        "returns true if string function matches": function () {
            var has = match.has("toUpperCase", match.func);

            assert(has.test("sinon"));
        },

        "returns true if number function matches": function () {
            var has = match.has("toFixed", match.func);

            assert(has.test(0));
        }
    },

    ".hasOwnSpecial": {
        "returns false if object has inherited property": function () {
            var hasOwn = match.hasOwn("toString");

            assert.isFalse(hasOwn.test({}));
        },

        "only includes property in message": function () {
            var hasOwn = match.hasOwn("test");

            assert.equals(hasOwn.toString(), "hasOwn(\"test\")");
        },

        "includes property and value in message": function () {
            var hasOwn = match.hasOwn("test", undefined);

            assert.equals(hasOwn.toString(), "hasOwn(\"test\", undefined)");
        }
    },

    ".bool": {
        "is typeOf boolean matcher": function () {
            var bool = match.bool;

            assert(match.isMatcher(bool));
            assert.equals(bool.toString(), "typeOf(\"boolean\")");
        }
    },

    ".number": {
        "is typeOf number matcher": function () {
            var number = match.number;

            assert(match.isMatcher(number));
            assert.equals(number.toString(), "typeOf(\"number\")");
        }
    },

    ".string": {
        "is typeOf string matcher": function () {
            var string = match.string;

            assert(match.isMatcher(string));
            assert.equals(string.toString(), "typeOf(\"string\")");
        }
    },

    ".object": {
        "is typeOf object matcher": function () {
            var object = match.object;

            assert(match.isMatcher(object));
            assert.equals(object.toString(), "typeOf(\"object\")");
        }
    },

    ".func": {
        "is typeOf function matcher": function () {
            var func = match.func;

            assert(match.isMatcher(func));
            assert.equals(func.toString(), "typeOf(\"function\")");
        }
    },

    ".array": {
        "is typeOf array matcher": function () {
            var array = match.array;

            assert(match.isMatcher(array));
            assert.equals(array.toString(), "typeOf(\"array\")");
        }
    },

    ".regexp": {
        "is typeOf regexp matcher": function () {
            var regexp = match.regexp;

            assert(match.isMatcher(regexp));
            assert.equals(regexp.toString(), "typeOf(\"regexp\")");
        }
    },

    ".date": {
        "is typeOf regexp matcher": function () {
            var date = match.date;

            assert(match.isMatcher(date));
            assert.equals(date.toString(), "typeOf(\"date\")");
        }
    },

    ".or": {
        "is matcher": function () {
            var numberOrString = match.number.or(match.string);

            assert(match.isMatcher(numberOrString));
            assert.equals(numberOrString.toString(),
                          "typeOf(\"number\").or(typeOf(\"string\"))");
        },

        "requires matcher argument": function () {
            assert.exception(function () {
                match.instanceOf(Error).or();
            }, "TypeError");
        },

        "will coerce argument to matcher": function () {
            var abcOrDef = match("abc").or("def");

            assert(match.isMatcher(abcOrDef));
            assert.equals(abcOrDef.toString(),
                          "match(\"abc\").or(match(\"def\"))");
        },

        "returns true if either matcher matches": function () {
            var numberOrString = match.number.or(match.string);

            assert(numberOrString.test(123));
            assert(numberOrString.test("abc"));
        },

        "returns false if neither matcher matches": function () {
            var numberOrAbc = match.number.or("abc");

            assert.isFalse(numberOrAbc.test(/.+/));
            assert.isFalse(numberOrAbc.test(new Date()));
            assert.isFalse(numberOrAbc.test({}));
        },

        "can be used with undefined": function () {
            var numberOrUndef = match.number.or(undefined);

            assert(numberOrUndef.test(123));
            assert(numberOrUndef.test(undefined));
        }
    },

    ".and": {
        "is matcher": function () {
            var fooAndBar = match.has("foo").and(match.has("bar"));

            assert(match.isMatcher(fooAndBar));
            assert.equals(fooAndBar.toString(), "has(\"foo\").and(has(\"bar\"))");
        },

        "requires matcher argument": function () {
            assert.exception(function () {
                match.instanceOf(Error).and();
            }, "TypeError");
        },

        "will coerce to matcher": function () {
            var abcOrObj = match("abc").or({a:1});

            assert(match.isMatcher(abcOrObj));
            assert.equals(abcOrObj.toString(),
                          "match(\"abc\").or(match(a: 1))");
        },

        "returns true if both matchers match": function () {
            var fooAndBar = match.has("foo").and({ bar: "bar" });

            assert(fooAndBar.test({ foo: "foo", bar: "bar" }));
        },

        "returns false if either matcher does not match": function () {
            var fooAndBar = match.has("foo").and(match.has("bar"));

            assert.isFalse(fooAndBar.test({ foo: "foo" }));
            assert.isFalse(fooAndBar.test({ bar: "bar" }));
        },

        "can be used with undefined": function () {
            var falsyAndUndefined = match.falsy.and(undefined);

            assert.isFalse(falsyAndUndefined.test(false));
            assert(falsyAndUndefined.test(undefined));
        }
    }
});
