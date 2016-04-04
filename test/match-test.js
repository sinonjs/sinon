"use strict";

var assert = require("referee").assert;
var sinon = require("../lib/sinon");

function propertyMatcherTests(matcher) {
    return function () {
        it("returns matcher", function () {
            var has = matcher("foo");

            assert(sinon.match.isMatcher(has));
        });

        it("throws if first argument is not string", function () {
            assert.exception(function () {
                matcher();
            }, "TypeError");
            assert.exception(function () {
                matcher(123);
            }, "TypeError");
        });

        it("returns false if value is undefined or null", function () {
            var has = matcher("foo");

            assert.isFalse(has.test(undefined));
            assert.isFalse(has.test(null));
        });

        it("returns true if object has property", function () {
            var has = matcher("foo");

            assert(has.test({ foo: null }));
        });

        it("returns false if object value is not equal to given value", function () {
            var has = matcher("foo", 1);

            assert.isFalse(has.test({ foo: null }));
        });

        it("returns true if object value is equal to given value", function () {
            var has = matcher("message", "sinon rocks");

            assert(has.test({ message: "sinon rocks" }));
            assert(has.test(new Error("sinon rocks")));
        });

        it("returns true if string property matches", function () {
            var has = matcher("length", 5);

            assert(has.test("sinon"));
        });

        it("allows to expect undefined", function () {
            var has = matcher("foo", undefined);

            assert.isFalse(has.test({ foo: 1 }));
        });

        it("compares value deeply", function () {
            var has = matcher("foo", { bar: "doo", test: 42 });

            assert(has.test({ foo: { bar: "doo", test: 42 } }));
        });

        it("compares with matcher", function () {
            var has = matcher("callback", sinon.match.typeOf("function"));

            assert(has.test({ callback: function () {} }));
        });
    };
}

describe("sinon.match", function () {
    it("returns matcher", function () {
        var match = sinon.match(function () {});

        assert(sinon.match.isMatcher(match));
    });

    it("exposes test function", function () {
        var test = function () {};

        var match = sinon.match(test);

        assert.same(match.test, test);
    });

    it("returns true if properties are equal", function () {
        var match = sinon.match({ str: "sinon", nr: 1 });

        assert(match.test({ str: "sinon", nr: 1, other: "ignored" }));
    });

    it("returns true if properties are deep equal", function () {
        var match = sinon.match({ deep: { str: "sinon" } });

        assert(match.test({ deep: { str: "sinon", ignored: "value" } }));
    });

    it("returns false if a property is not equal", function () {
        var match = sinon.match({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ str: "sinon", nr: 2 }));
    });

    it("returns false if a property is missing", function () {
        var match = sinon.match({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ nr: 1 }));
    });

    it("returns true if array is equal", function () {
        var match = sinon.match({ arr: ["a", "b"] });

        assert(match.test({ arr: ["a", "b"] }));
    });

    it("returns false if array is not equal", function () {
        var match = sinon.match({ arr: ["b", "a"] });

        assert.isFalse(match.test({ arr: ["a", "b"] }));
    });

    it("returns true if number objects are equal", function () {
        /*eslint-disable no-new-wrappers*/
        var match = sinon.match({ one: new Number(1) });

        assert(match.test({ one: new Number(1) }));
        /*eslint-enable no-new-wrappers*/
    });

    it("returns true if test matches", function () {
        var match = sinon.match({ prop: sinon.match.typeOf("boolean") });

        assert(match.test({ prop: true }));
    });

    it("returns false if test does not match", function () {
        var match = sinon.match({ prop: sinon.match.typeOf("boolean") });

        assert.isFalse(match.test({ prop: "no" }));
    });

    it("returns true if deep test matches", function () {
        var match = sinon.match({ deep: { prop: sinon.match.typeOf("boolean") } });

        assert(match.test({ deep: { prop: true } }));
    });

    it("returns false if deep test does not match", function () {
        var match = sinon.match({ deep: { prop: sinon.match.typeOf("boolean") } });

        assert.isFalse(match.test({ deep: { prop: "no" } }));
    });

    it("returns false if tested value is null or undefined", function () {
        var match = sinon.match({});

        assert.isFalse(match.test(null));
        assert.isFalse(match.test(undefined));
    });

    it("returns true if error message matches", function () {
        var match = sinon.match({ message: "evil error" });

        assert(match.test(new Error("evil error")));
    });

    it("returns true if string property matches", function () {
        var match = sinon.match({ length: 5 });

        assert(match.test("sinon"));
    });

    it("returns true if number property matches", function () {
        var match = sinon.match({ toFixed: sinon.match.func });

        assert(match.test(0));
    });

    it("returns true for string match", function () {
        var match = sinon.match("sinon");

        assert(match.test("sinon"));
    });

    it("returns true for substring match", function () {
        var match = sinon.match("no");

        assert(match.test("sinon"));
    });

    it("returns false for string mismatch", function () {
        var match = sinon.match("Sinon.JS");

        assert.isFalse(match.test(null));
        assert.isFalse(match.test({}));
        assert.isFalse(match.test("sinon"));
        assert.isFalse(match.test("sinon.js"));
    });

    it("returns true for regexp match", function () {
        var match = sinon.match(/^[sino]+$/);

        assert(match.test("sinon"));
    });

    it("returns false for regexp string mismatch", function () {
        var match = sinon.match(/^[sin]+$/);

        assert.isFalse(match.test("sinon"));
    });

    it("returns false for regexp type mismatch", function () {
        var match = sinon.match(/.*/);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(123));
        assert.isFalse(match.test({}));
    });

    it("returns true for number match", function () {
        var match = sinon.match(1);

        assert(match.test(1));
        assert(match.test("1"));
        assert(match.test(true));
    });

    it("returns false for number mismatch", function () {
        var match = sinon.match(1);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(2));
        assert.isFalse(match.test(false));
        assert.isFalse(match.test({}));
    });

    it("returns true for Symbol match", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = sinon.match(symbol);

            assert(match.test(symbol));
        }
    });

    it("returns false for Symbol mismatch", function () {
        if (typeof Symbol === "function") {
            var match = sinon.match(Symbol());

            assert.isFalse(match.test());
            assert.isFalse(match.test(Symbol(null)));
            assert.isFalse(match.test(Symbol()));
            assert.isFalse(match.test(Symbol({})));
        }
    });

    it("returns true for Symbol inside object", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = sinon.match({ prop: symbol });

            assert(match.test({ prop: symbol }));
        }
    });

    it("returns true if test function in object returns true", function () {
        var match = sinon.match({ test: function () {
            return true;
        }});

        assert(match.test());
    });

    it("returns false if test function in object returns false", function () {
        var match = sinon.match({ test: function () {
            return false;
        }});

        assert.isFalse(match.test());
    });

    it("returns false if test function in object returns nothing", function () {
        var match = sinon.match({ test: function () {}});

        assert.isFalse(match.test());
    });

    it("passes actual value to test function in object", function () {
        var match = sinon.match({ test: function (arg) {
            return arg;
        }});

        assert(match.test(true));
    });

    it("uses matcher", function () {
        var match = sinon.match(sinon.match("test"));

        assert(match.test("testing"));
    });

    describe(".toString", function () {
        it("returns message", function () {
            var message = "hello sinon.match";

            var match = sinon.match(function () {}, message);

            assert.same(match.toString(), message);
        });

        it("defaults to match(functionName)", function () {
            var match = sinon.match(function custom() {});

            assert.same(match.toString(), "match(custom)");
        });
    });

    describe(".any", function () {
        it("is matcher", function () {
            assert(sinon.match.isMatcher(sinon.match.any));
        });

        it("returns true when tested", function () {
            assert(sinon.match.any.test());
        });
    });

    describe(".defined", function () {
        it("is matcher", function () {
            assert(sinon.match.isMatcher(sinon.match.defined));
        });

        it("returns false if test is called with null", function () {
            assert.isFalse(sinon.match.defined.test(null));
        });

        it("returns false if test is called with undefined", function () {
            assert.isFalse(sinon.match.defined.test(undefined));
        });

        it("returns true if test is called with any value", function () {
            assert(sinon.match.defined.test(false));
            assert(sinon.match.defined.test(true));
            assert(sinon.match.defined.test(0));
            assert(sinon.match.defined.test(1));
            assert(sinon.match.defined.test(""));
        });

        it("returns true if test is called with any object", function () {
            assert(sinon.match.defined.test({}));
            assert(sinon.match.defined.test(function () {}));
        });
    });

    describe(".truthy", function () {
        it("is matcher", function () {
            assert(sinon.match.isMatcher(sinon.match.truthy));
        });

        it("returns true if test is called with trueish value", function () {
            assert(sinon.match.truthy.test(true));
            assert(sinon.match.truthy.test(1));
            assert(sinon.match.truthy.test("yes"));
        });

        it("returns false if test is called falsy value", function () {
            assert.isFalse(sinon.match.truthy.test(false));
            assert.isFalse(sinon.match.truthy.test(null));
            assert.isFalse(sinon.match.truthy.test(undefined));
            assert.isFalse(sinon.match.truthy.test(""));
        });
    });

    describe(".falsy", function () {
        it("is matcher", function () {
            assert(sinon.match.isMatcher(sinon.match.falsy));
        });

        it("returns true if test is called falsy value", function () {
            assert(sinon.match.falsy.test(false));
            assert(sinon.match.falsy.test(null));
            assert(sinon.match.falsy.test(undefined));
            assert(sinon.match.falsy.test(""));
        });

        it("returns false if test is called with trueish value", function () {
            assert.isFalse(sinon.match.falsy.test(true));
            assert.isFalse(sinon.match.falsy.test(1));
            assert.isFalse(sinon.match.falsy.test("yes"));
        });
    });

    describe(".same", function () {
        it("returns matcher", function () {
            var same = sinon.match.same();

            assert(sinon.match.isMatcher(same));
        });

        it("returns true if test is called with same argument", function () {
            var object = {};
            var same = sinon.match.same(object);

            assert(same.test(object));
        });

        it("returns true if test is called with same symbol", function () {
            if (typeof Symbol === "function") {
                var symbol = Symbol();
                var same = sinon.match.same(symbol);

                assert(same.test(symbol));
            }
        });

        it("returns false if test is not called with same argument", function () {
            var same = sinon.match.same({});

            assert.isFalse(same.test({}));
        });
    });

    describe(".typeOf", function () {
        it("throws if given argument is not a string", function () {
            assert.exception(function () {
                sinon.match.typeOf();
            }, "TypeError");
            assert.exception(function () {
                sinon.match.typeOf(123);
            }, "TypeError");
        });

        it("returns matcher", function () {
            var typeOf = sinon.match.typeOf("string");

            assert(sinon.match.isMatcher(typeOf));
        });

        it("returns true if test is called with string", function () {
            var typeOf = sinon.match.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        });

        it("returns false if test is not called with string", function () {
            var typeOf = sinon.match.typeOf("string");

            assert.isFalse(typeOf.test(123));
        });

        it("returns true if test is called with symbol", function () {
            if (typeof Symbol === "function") {
                var typeOf = sinon.match.typeOf("symbol");

                assert(typeOf.test(Symbol()));
            }
        });

        it("returns true if test is called with regexp", function () {
            var typeOf = sinon.match.typeOf("regexp");

            assert(typeOf.test(/.+/));
        });

        it("returns false if test is not called with regexp", function () {
            var typeOf = sinon.match.typeOf("regexp");

            assert.isFalse(typeOf.test(true));
        });
    });

    describe(".instanceOf", function () {
        it("throws if given argument is not a function", function () {
            assert.exception(function () {
                sinon.match.instanceOf();
            }, "TypeError");
            assert.exception(function () {
                sinon.match.instanceOf("foo");
            }, "TypeError");
        });

        it("returns matcher", function () {
            var instanceOf = sinon.match.instanceOf(function () {});

            assert(sinon.match.isMatcher(instanceOf));
        });

        it("returns true if test is called with instance of argument", function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assert(instanceOf.test([]));
        });

        it("returns false if test is not called with instance of argument", function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assert.isFalse(instanceOf.test({}));
        });
    });

    describe(".has", propertyMatcherTests(sinon.match.has));
    describe(".hasOwn", propertyMatcherTests(sinon.match.hasOwn));

    describe(".hasSpecial", function () {
        it("returns true if object has inherited property", function () {
            var has = sinon.match.has("toString");

            assert(has.test({}));
        });

        it("only includes property in message", function () {
            var has = sinon.match.has("test");

            assert.equals(has.toString(), "has(\"test\")");
        });

        it("includes property and value in message", function () {
            var has = sinon.match.has("test", undefined);

            assert.equals(has.toString(), "has(\"test\", undefined)");
        });

        it("returns true if string function matches", function () {
            var has = sinon.match.has("toUpperCase", sinon.match.func);

            assert(has.test("sinon"));
        });

        it("returns true if number function matches", function () {
            var has = sinon.match.has("toFixed", sinon.match.func);

            assert(has.test(0));
        });

        it("returns true if object has Symbol", function () {
            if (typeof Symbol === "function") {
                var symbol = Symbol();

                var has = sinon.match.has("prop", symbol);

                assert(has.test({ prop: symbol }));
            }
        });
    });

    describe(".hasOwnSpecial", function () {
        it("returns false if object has inherited property", function () {
            var hasOwn = sinon.match.hasOwn("toString");

            assert.isFalse(hasOwn.test({}));
        });

        it("only includes property in message", function () {
            var hasOwn = sinon.match.hasOwn("test");

            assert.equals(hasOwn.toString(), "hasOwn(\"test\")");
        });

        it("includes property and value in message", function () {
            var hasOwn = sinon.match.hasOwn("test", undefined);

            assert.equals(hasOwn.toString(), "hasOwn(\"test\", undefined)");
        });
    });

    describe(".bool", function () {
        it("is typeOf boolean matcher", function () {
            var bool = sinon.match.bool;

            assert(sinon.match.isMatcher(bool));
            assert.equals(bool.toString(), "typeOf(\"boolean\")");
        });
    });

    describe(".number", function () {
        it("is typeOf number matcher", function () {
            var number = sinon.match.number;

            assert(sinon.match.isMatcher(number));
            assert.equals(number.toString(), "typeOf(\"number\")");
        });
    });

    describe(".string", function () {
        it("is typeOf string matcher", function () {
            var string = sinon.match.string;

            assert(sinon.match.isMatcher(string));
            assert.equals(string.toString(), "typeOf(\"string\")");
        });
    });

    describe(".object", function () {
        it("is typeOf object matcher", function () {
            var object = sinon.match.object;

            assert(sinon.match.isMatcher(object));
            assert.equals(object.toString(), "typeOf(\"object\")");
        });
    });

    describe(".func", function () {
        it("is typeOf function matcher", function () {
            var func = sinon.match.func;

            assert(sinon.match.isMatcher(func));
            assert.equals(func.toString(), "typeOf(\"function\")");
        });
    });

    describe(".array", function () {
        it("is typeOf array matcher", function () {
            var array = sinon.match.array;

            assert(sinon.match.isMatcher(array));
            assert.equals(array.toString(), "typeOf(\"array\")");
        });
    });

    describe(".regexp", function () {
        it("is typeOf regexp matcher", function () {
            var regexp = sinon.match.regexp;

            assert(sinon.match.isMatcher(regexp));
            assert.equals(regexp.toString(), "typeOf(\"regexp\")");
        });
    });

    describe(".date", function () {
        it("is typeOf regexp matcher", function () {
            var date = sinon.match.date;

            assert(sinon.match.isMatcher(date));
            assert.equals(date.toString(), "typeOf(\"date\")");
        });
    });

    describe(".symbol", function () {
        it("is typeOf symbol matcher", function () {
            var symbol = sinon.match.symbol;

            assert(sinon.match.isMatcher(symbol));
            assert.equals(symbol.toString(), "typeOf(\"symbol\")");
        });
    });

    describe(".or", function () {
        it("is matcher", function () {
            var numberOrString = sinon.match.number.or(sinon.match.string);

            assert(sinon.match.isMatcher(numberOrString));
            assert.equals(numberOrString.toString(),
                          "typeOf(\"number\").or(typeOf(\"string\"))");
        });

        it("requires matcher argument", function () {
            assert.exception(function () {
                sinon.match.instanceOf(Error).or();
            }, "TypeError");
        });

        it("will coerce argument to matcher", function () {
            var abcOrDef = sinon.match("abc").or("def");

            assert(sinon.match.isMatcher(abcOrDef));
            assert.equals(abcOrDef.toString(),
                          "match(\"abc\").or(match(\"def\"))");
        });

        it("returns true if either matcher matches", function () {
            var numberOrString = sinon.match.number.or(sinon.match.string);

            assert(numberOrString.test(123));
            assert(numberOrString.test("abc"));
        });

        it("returns false if neither matcher matches", function () {
            var numberOrAbc = sinon.match.number.or("abc");

            assert.isFalse(numberOrAbc.test(/.+/));
            assert.isFalse(numberOrAbc.test(new Date()));
            assert.isFalse(numberOrAbc.test({}));
        });

        it("can be used with undefined", function () {
            var numberOrUndef = sinon.match.number.or(undefined);

            assert(numberOrUndef.test(123));
            assert(numberOrUndef.test(undefined));
        });
    });

    describe(".and", function () {
        it("is matcher", function () {
            var fooAndBar = sinon.match.has("foo").and(sinon.match.has("bar"));

            assert(sinon.match.isMatcher(fooAndBar));
            assert.equals(fooAndBar.toString(), "has(\"foo\").and(has(\"bar\"))");
        });

        it("requires matcher argument", function () {
            assert.exception(function () {
                sinon.match.instanceOf(Error).and();
            }, "TypeError");
        });

        it("will coerce to matcher", function () {
            var abcOrObj = sinon.match("abc").or({a: 1});

            assert(sinon.match.isMatcher(abcOrObj));
            assert.equals(abcOrObj.toString(),
                          "match(\"abc\").or(match(a: 1))");
        });

        it("returns true if both matchers match", function () {
            var fooAndBar = sinon.match.has("foo").and({ bar: "bar" });

            assert(fooAndBar.test({ foo: "foo", bar: "bar" }));
        });

        it("returns false if either matcher does not match", function () {
            var fooAndBar = sinon.match.has("foo").and(sinon.match.has("bar"));

            assert.isFalse(fooAndBar.test({ foo: "foo" }));
            assert.isFalse(fooAndBar.test({ bar: "bar" }));
        });

        it("can be used with undefined", function () {
            var falsyAndUndefined = sinon.match.falsy.and(undefined);

            assert.isFalse(falsyAndUndefined.test(false));
            assert(falsyAndUndefined.test(undefined));
        });
    });
});
