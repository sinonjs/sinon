"use strict";

var assert = require("referee").assert;
var sinonMatch = require("../lib/sinon/match");

function propertyMatcherTests(matcher) {
    return function () {
        it("returns matcher", function () {
            var has = matcher("foo");

            assert(sinonMatch.isMatcher(has));
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
            var has = matcher("callback", sinonMatch.typeOf("function"));

            assert(has.test({ callback: function () {} }));
        });
    };
}

describe("sinonMatch", function () {
    it("returns matcher", function () {
        var match = sinonMatch(function () {});

        assert(sinonMatch.isMatcher(match));
    });

    it("exposes test function", function () {
        var test = function () {};

        var match = sinonMatch(test);

        assert.same(match.test, test);
    });

    it("returns true if properties are equal", function () {
        var match = sinonMatch({ str: "sinon", nr: 1 });

        assert(match.test({ str: "sinon", nr: 1, other: "ignored" }));
    });

    it("returns true if properties are deep equal", function () {
        var match = sinonMatch({ deep: { str: "sinon" } });

        assert(match.test({ deep: { str: "sinon", ignored: "value" } }));
    });

    it("returns false if a property is not equal", function () {
        var match = sinonMatch({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ str: "sinon", nr: 2 }));
    });

    it("returns false if a property is missing", function () {
        var match = sinonMatch({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ nr: 1 }));
    });

    it("returns true if array is equal", function () {
        var match = sinonMatch({ arr: ["a", "b"] });

        assert(match.test({ arr: ["a", "b"] }));
    });

    it("returns false if array is not equal", function () {
        var match = sinonMatch({ arr: ["b", "a"] });

        assert.isFalse(match.test({ arr: ["a", "b"] }));
    });

    it("returns true if number objects are equal", function () {
        /*eslint-disable no-new-wrappers*/
        var match = sinonMatch({ one: new Number(1) });

        assert(match.test({ one: new Number(1) }));
        /*eslint-enable no-new-wrappers*/
    });

    it("returns true if test matches", function () {
        var match = sinonMatch({ prop: sinonMatch.typeOf("boolean") });

        assert(match.test({ prop: true }));
    });

    it("returns false if test does not match", function () {
        var match = sinonMatch({ prop: sinonMatch.typeOf("boolean") });

        assert.isFalse(match.test({ prop: "no" }));
    });

    it("returns true if deep test matches", function () {
        var match = sinonMatch({ deep: { prop: sinonMatch.typeOf("boolean") } });

        assert(match.test({ deep: { prop: true } }));
    });

    it("returns false if deep test does not match", function () {
        var match = sinonMatch({ deep: { prop: sinonMatch.typeOf("boolean") } });

        assert.isFalse(match.test({ deep: { prop: "no" } }));
    });

    it("returns false if tested value is null or undefined", function () {
        var match = sinonMatch({});

        assert.isFalse(match.test(null));
        assert.isFalse(match.test(undefined));
    });

    it("returns true if error message matches", function () {
        var match = sinonMatch({ message: "evil error" });

        assert(match.test(new Error("evil error")));
    });

    it("returns true if string property matches", function () {
        var match = sinonMatch({ length: 5 });

        assert(match.test("sinon"));
    });

    it("returns true if number property matches", function () {
        var match = sinonMatch({ toFixed: sinonMatch.func });

        assert(match.test(0));
    });

    it("returns true for string match", function () {
        var match = sinonMatch("sinon");

        assert(match.test("sinon"));
    });

    it("returns true for substring match", function () {
        var match = sinonMatch("no");

        assert(match.test("sinon"));
    });

    it("returns false for string mismatch", function () {
        var match = sinonMatch("Sinon.JS");

        assert.isFalse(match.test(null));
        assert.isFalse(match.test({}));
        assert.isFalse(match.test("sinon"));
        assert.isFalse(match.test("sinon.js"));
    });

    it("returns true for regexp match", function () {
        var match = sinonMatch(/^[sino]+$/);

        assert(match.test("sinon"));
    });

    it("returns false for regexp string mismatch", function () {
        var match = sinonMatch(/^[sin]+$/);

        assert.isFalse(match.test("sinon"));
    });

    it("returns false for regexp type mismatch", function () {
        var match = sinonMatch(/.*/);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(123));
        assert.isFalse(match.test({}));
    });

    it("returns true for number match", function () {
        var match = sinonMatch(1);

        assert(match.test(1));
        assert(match.test("1"));
        assert(match.test(true));
    });

    it("returns false for number mismatch", function () {
        var match = sinonMatch(1);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(2));
        assert.isFalse(match.test(false));
        assert.isFalse(match.test({}));
    });

    it("returns true for Symbol match", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = sinonMatch(symbol);

            assert(match.test(symbol));
        }
    });

    it("returns false for Symbol mismatch", function () {
        if (typeof Symbol === "function") {
            var match = sinonMatch(Symbol());

            assert.isFalse(match.test());
            assert.isFalse(match.test(Symbol(null)));
            assert.isFalse(match.test(Symbol()));
            assert.isFalse(match.test(Symbol({})));
        }
    });

    it("returns true for Symbol inside object", function () {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = sinonMatch({ prop: symbol });

            assert(match.test({ prop: symbol }));
        }
    });

    it("returns true if test function in object returns true", function () {
        var match = sinonMatch({ test: function () {
            return true;
        }});

        assert(match.test());
    });

    it("returns false if test function in object returns false", function () {
        var match = sinonMatch({ test: function () {
            return false;
        }});

        assert.isFalse(match.test());
    });

    it("returns false if test function in object returns nothing", function () {
        var match = sinonMatch({ test: function () {}});

        assert.isFalse(match.test());
    });

    it("passes actual value to test function in object", function () {
        var match = sinonMatch({ test: function (arg) {
            return arg;
        }});

        assert(match.test(true));
    });

    it("uses matcher", function () {
        var match = sinonMatch(sinonMatch("test"));

        assert(match.test("testing"));
    });

    describe(".toString", function () {
        it("returns message", function () {
            var message = "hello sinonMatch";

            var match = sinonMatch(function () {}, message);

            assert.same(match.toString(), message);
        });

        it("defaults to match(functionName)", function () {
            var match = sinonMatch(function custom() {});

            assert.same(match.toString(), "match(custom)");
        });
    });

    describe(".any", function () {
        it("is matcher", function () {
            assert(sinonMatch.isMatcher(sinonMatch.any));
        });

        it("returns true when tested", function () {
            assert(sinonMatch.any.test());
        });
    });

    describe(".defined", function () {
        it("is matcher", function () {
            assert(sinonMatch.isMatcher(sinonMatch.defined));
        });

        it("returns false if test is called with null", function () {
            assert.isFalse(sinonMatch.defined.test(null));
        });

        it("returns false if test is called with undefined", function () {
            assert.isFalse(sinonMatch.defined.test(undefined));
        });

        it("returns true if test is called with any value", function () {
            assert(sinonMatch.defined.test(false));
            assert(sinonMatch.defined.test(true));
            assert(sinonMatch.defined.test(0));
            assert(sinonMatch.defined.test(1));
            assert(sinonMatch.defined.test(""));
        });

        it("returns true if test is called with any object", function () {
            assert(sinonMatch.defined.test({}));
            assert(sinonMatch.defined.test(function () {}));
        });
    });

    describe(".truthy", function () {
        it("is matcher", function () {
            assert(sinonMatch.isMatcher(sinonMatch.truthy));
        });

        it("returns true if test is called with trueish value", function () {
            assert(sinonMatch.truthy.test(true));
            assert(sinonMatch.truthy.test(1));
            assert(sinonMatch.truthy.test("yes"));
        });

        it("returns false if test is called falsy value", function () {
            assert.isFalse(sinonMatch.truthy.test(false));
            assert.isFalse(sinonMatch.truthy.test(null));
            assert.isFalse(sinonMatch.truthy.test(undefined));
            assert.isFalse(sinonMatch.truthy.test(""));
        });
    });

    describe(".falsy", function () {
        it("is matcher", function () {
            assert(sinonMatch.isMatcher(sinonMatch.falsy));
        });

        it("returns true if test is called falsy value", function () {
            assert(sinonMatch.falsy.test(false));
            assert(sinonMatch.falsy.test(null));
            assert(sinonMatch.falsy.test(undefined));
            assert(sinonMatch.falsy.test(""));
        });

        it("returns false if test is called with trueish value", function () {
            assert.isFalse(sinonMatch.falsy.test(true));
            assert.isFalse(sinonMatch.falsy.test(1));
            assert.isFalse(sinonMatch.falsy.test("yes"));
        });
    });

    describe(".same", function () {
        it("returns matcher", function () {
            var same = sinonMatch.same();

            assert(sinonMatch.isMatcher(same));
        });

        it("returns true if test is called with same argument", function () {
            var object = {};
            var same = sinonMatch.same(object);

            assert(same.test(object));
        });

        it("returns true if test is called with same symbol", function () {
            if (typeof Symbol === "function") {
                var symbol = Symbol();
                var same = sinonMatch.same(symbol);

                assert(same.test(symbol));
            }
        });

        it("returns false if test is not called with same argument", function () {
            var same = sinonMatch.same({});

            assert.isFalse(same.test({}));
        });
    });

    describe(".typeOf", function () {
        it("throws if given argument is not a string", function () {
            assert.exception(function () {
                sinonMatch.typeOf();
            }, "TypeError");
            assert.exception(function () {
                sinonMatch.typeOf(123);
            }, "TypeError");
        });

        it("returns matcher", function () {
            var typeOf = sinonMatch.typeOf("string");

            assert(sinonMatch.isMatcher(typeOf));
        });

        it("returns true if test is called with string", function () {
            var typeOf = sinonMatch.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        });

        it("returns false if test is not called with string", function () {
            var typeOf = sinonMatch.typeOf("string");

            assert.isFalse(typeOf.test(123));
        });

        it("returns true if test is called with symbol", function () {
            if (typeof Symbol === "function") {
                var typeOf = sinonMatch.typeOf("symbol");

                assert(typeOf.test(Symbol()));
            }
        });

        it("returns true if test is called with regexp", function () {
            var typeOf = sinonMatch.typeOf("regexp");

            assert(typeOf.test(/.+/));
        });

        it("returns false if test is not called with regexp", function () {
            var typeOf = sinonMatch.typeOf("regexp");

            assert.isFalse(typeOf.test(true));
        });
    });

    describe(".instanceOf", function () {
        it("throws if given argument is not a function", function () {
            assert.exception(function () {
                sinonMatch.instanceOf();
            }, "TypeError");
            assert.exception(function () {
                sinonMatch.instanceOf("foo");
            }, "TypeError");
        });

        it("returns matcher", function () {
            var instanceOf = sinonMatch.instanceOf(function () {});

            assert(sinonMatch.isMatcher(instanceOf));
        });

        it("returns true if test is called with instance of argument", function () {
            var instanceOf = sinonMatch.instanceOf(Array);

            assert(instanceOf.test([]));
        });

        it("returns false if test is not called with instance of argument", function () {
            var instanceOf = sinonMatch.instanceOf(Array);

            assert.isFalse(instanceOf.test({}));
        });
    });

    describe(".has", propertyMatcherTests(sinonMatch.has));
    describe(".hasOwn", propertyMatcherTests(sinonMatch.hasOwn));

    describe(".hasSpecial", function () {
        it("returns true if object has inherited property", function () {
            var has = sinonMatch.has("toString");

            assert(has.test({}));
        });

        it("only includes property in message", function () {
            var has = sinonMatch.has("test");

            assert.equals(has.toString(), "has(\"test\")");
        });

        it("includes property and value in message", function () {
            var has = sinonMatch.has("test", undefined);

            assert.equals(has.toString(), "has(\"test\", undefined)");
        });

        it("returns true if string function matches", function () {
            var has = sinonMatch.has("toUpperCase", sinonMatch.func);

            assert(has.test("sinon"));
        });

        it("returns true if number function matches", function () {
            var has = sinonMatch.has("toFixed", sinonMatch.func);

            assert(has.test(0));
        });

        it("returns true if object has Symbol", function () {
            if (typeof Symbol === "function") {
                var symbol = Symbol();

                var has = sinonMatch.has("prop", symbol);

                assert(has.test({ prop: symbol }));
            }
        });
    });

    describe(".hasOwnSpecial", function () {
        it("returns false if object has inherited property", function () {
            var hasOwn = sinonMatch.hasOwn("toString");

            assert.isFalse(hasOwn.test({}));
        });

        it("only includes property in message", function () {
            var hasOwn = sinonMatch.hasOwn("test");

            assert.equals(hasOwn.toString(), "hasOwn(\"test\")");
        });

        it("includes property and value in message", function () {
            var hasOwn = sinonMatch.hasOwn("test", undefined);

            assert.equals(hasOwn.toString(), "hasOwn(\"test\", undefined)");
        });
    });

    describe(".bool", function () {
        it("is typeOf boolean matcher", function () {
            var bool = sinonMatch.bool;

            assert(sinonMatch.isMatcher(bool));
            assert.equals(bool.toString(), "typeOf(\"boolean\")");
        });
    });

    describe(".number", function () {
        it("is typeOf number matcher", function () {
            var number = sinonMatch.number;

            assert(sinonMatch.isMatcher(number));
            assert.equals(number.toString(), "typeOf(\"number\")");
        });
    });

    describe(".string", function () {
        it("is typeOf string matcher", function () {
            var string = sinonMatch.string;

            assert(sinonMatch.isMatcher(string));
            assert.equals(string.toString(), "typeOf(\"string\")");
        });
    });

    describe(".object", function () {
        it("is typeOf object matcher", function () {
            var object = sinonMatch.object;

            assert(sinonMatch.isMatcher(object));
            assert.equals(object.toString(), "typeOf(\"object\")");
        });
    });

    describe(".func", function () {
        it("is typeOf function matcher", function () {
            var func = sinonMatch.func;

            assert(sinonMatch.isMatcher(func));
            assert.equals(func.toString(), "typeOf(\"function\")");
        });
    });

    describe(".array", function () {
        it("is typeOf array matcher", function () {
            var array = sinonMatch.array;

            assert(sinonMatch.isMatcher(array));
            assert.equals(array.toString(), "typeOf(\"array\")");
        });

        describe("array.deepEquals", function () {
            it("has a .deepEquals matcher", function () {
                var deepEquals = sinonMatch.array.deepEquals([1, 2, 3]);

                assert(sinonMatch.isMatcher(deepEquals));
                assert.equals(deepEquals.toString(), "deepEquals([1,2,3])");
            });

            it("matches arrays with the exact same elements", function () {
                var deepEquals = sinonMatch.array.deepEquals([1, 2, 3]);
                assert(deepEquals.test([1, 2, 3]));
                assert.isFalse(deepEquals.test([1, 2]));
                assert.isFalse(deepEquals.test([3]));
            });

            it("fails when passed a non-array object", function () {
                var deepEquals = sinonMatch.array.deepEquals(["one", "two", "three"]);
                assert.isFalse(deepEquals.test({0: "one", 1: "two", 2: "three", length: 3}));
            });
        });

        describe("array.startsWith", function () {
            it("has a .startsWith matcher", function () {
                var startsWith = sinonMatch.array.startsWith([1, 2]);

                assert(sinonMatch.isMatcher(startsWith));
                assert.equals(startsWith.toString(), "startsWith([1,2])");
            });

            it("matches arrays starting with the same elements", function () {
                assert(sinonMatch.array.startsWith([1]).test([1, 2]));
                assert(sinonMatch.array.startsWith([1, 2]).test([1, 2]));
                assert.isFalse(sinonMatch.array.startsWith([1, 2, 3]).test([1, 2]));
                assert.isFalse(sinonMatch.array.startsWith([2]).test([1, 2]));
            });

            it("fails when passed a non-array object", function () {
                var startsWith = sinonMatch.array.startsWith(["one", "two"]);
                assert.isFalse(startsWith.test({0: "one", 1: "two", 2: "three", length: 3}));
            });
        });

        describe("array.endsWith", function () {
            it("has an .endsWith matcher", function () {
                var endsWith = sinonMatch.array.endsWith([2, 3]);

                assert(sinonMatch.isMatcher(endsWith));
                assert.equals(endsWith.toString(), "endsWith([2,3])");
            });

            it("matches arrays ending with the same elements", function () {
                assert(sinonMatch.array.endsWith([2]).test([1, 2]));
                assert(sinonMatch.array.endsWith([1, 2]).test([1, 2]));
                assert.isFalse(sinonMatch.array.endsWith([1, 2, 3]).test([1, 2]));
                assert.isFalse(sinonMatch.array.endsWith([3]).test([1, 2]));
            });

            it("fails when passed a non-array object", function () {
                var endsWith = sinonMatch.array.endsWith(["two", "three"]);

                assert.isFalse(endsWith.test({0: "one", 1: "two", 2: "three", length: 3}));
            });
        });

        describe("array.contains", function () {
            it("has a .contains matcher", function () {
                var contains = sinonMatch.array.contains([2, 3]);

                assert(sinonMatch.isMatcher(contains));
                assert.equals(contains.toString(), "contains([2,3])");
            });

            it("matches arrays containing all the expected elements", function () {
                assert(sinonMatch.array.contains([2]).test([1, 2, 3]));
                assert(sinonMatch.array.contains([1, 2]).test([1, 2]));
                assert.isFalse(sinonMatch.array.contains([1, 2, 3]).test([1, 2]));
                assert.isFalse(sinonMatch.array.contains([3]).test([1, 2]));
            });

            it("fails when passed a non-array object", function () {
                var contains = sinonMatch.array.contains(["one", "three"]);

                assert.isFalse(contains.test({0: "one", 1: "two", 2: "three", length: 3}));
            });
        });
    });

    describe(".regexp", function () {
        it("is typeOf regexp matcher", function () {
            var regexp = sinonMatch.regexp;

            assert(sinonMatch.isMatcher(regexp));
            assert.equals(regexp.toString(), "typeOf(\"regexp\")");
        });
    });

    describe(".date", function () {
        it("is typeOf regexp matcher", function () {
            var date = sinonMatch.date;

            assert(sinonMatch.isMatcher(date));
            assert.equals(date.toString(), "typeOf(\"date\")");
        });
    });

    describe(".symbol", function () {
        it("is typeOf symbol matcher", function () {
            var symbol = sinonMatch.symbol;

            assert(sinonMatch.isMatcher(symbol));
            assert.equals(symbol.toString(), "typeOf(\"symbol\")");
        });
    });

    describe(".or", function () {
        it("is matcher", function () {
            var numberOrString = sinonMatch.number.or(sinonMatch.string);

            assert(sinonMatch.isMatcher(numberOrString));
            assert.equals(numberOrString.toString(),
                          "typeOf(\"number\").or(typeOf(\"string\"))");
        });

        it("requires matcher argument", function () {
            assert.exception(function () {
                sinonMatch.instanceOf(Error).or();
            }, "TypeError");
        });

        it("will coerce argument to matcher", function () {
            var abcOrDef = sinonMatch("abc").or("def");

            assert(sinonMatch.isMatcher(abcOrDef));
            assert.equals(abcOrDef.toString(),
                          "match(\"abc\").or(match(\"def\"))");
        });

        it("returns true if either matcher matches", function () {
            var numberOrString = sinonMatch.number.or(sinonMatch.string);

            assert(numberOrString.test(123));
            assert(numberOrString.test("abc"));
        });

        it("returns false if neither matcher matches", function () {
            var numberOrAbc = sinonMatch.number.or("abc");

            assert.isFalse(numberOrAbc.test(/.+/));
            assert.isFalse(numberOrAbc.test(new Date()));
            assert.isFalse(numberOrAbc.test({}));
        });

        it("can be used with undefined", function () {
            var numberOrUndef = sinonMatch.number.or(undefined);

            assert(numberOrUndef.test(123));
            assert(numberOrUndef.test(undefined));
        });
    });

    describe(".and", function () {
        it("is matcher", function () {
            var fooAndBar = sinonMatch.has("foo").and(sinonMatch.has("bar"));

            assert(sinonMatch.isMatcher(fooAndBar));
            assert.equals(fooAndBar.toString(), "has(\"foo\").and(has(\"bar\"))");
        });

        it("requires matcher argument", function () {
            assert.exception(function () {
                sinonMatch.instanceOf(Error).and();
            }, "TypeError");
        });

        it("will coerce to matcher", function () {
            var abcOrObj = sinonMatch("abc").or({a: 1});

            assert(sinonMatch.isMatcher(abcOrObj));
            assert.equals(abcOrObj.toString(),
                          "match(\"abc\").or(match(a: 1))");
        });

        it("returns true if both matchers match", function () {
            var fooAndBar = sinonMatch.has("foo").and({ bar: "bar" });

            assert(fooAndBar.test({ foo: "foo", bar: "bar" }));
        });

        it("returns false if either matcher does not match", function () {
            var fooAndBar = sinonMatch.has("foo").and(sinonMatch.has("bar"));

            assert.isFalse(fooAndBar.test({ foo: "foo" }));
            assert.isFalse(fooAndBar.test({ bar: "bar" }));
        });

        it("can be used with undefined", function () {
            var falsyAndUndefined = sinonMatch.falsy.and(undefined);

            assert.isFalse(falsyAndUndefined.test(false));
            assert(falsyAndUndefined.test(undefined));
        });
    });
});
