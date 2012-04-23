/*jslint onevar: false, eqeqeq: false*/
/*globals testCase
          window
          sinon
          fail
          assert
          assertUndefined
          assertFalse
          assertArray
          assertFunction
          assertNumber
          assertNoException
          assertSame
          assertNotSame
          assertException
          assertEquals*/
/**
* @author Maximilian Antoni (mail@maxantoni.de)
* @license BSD
*
* Copyright (c) 2012 Maximilian Antoni
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../test_case_shim");
    var sinon = require("../../lib/sinon");
}

(function () {
    testCase("MatchTest", {
        "should be function": function () {
            assertFunction(sinon.match);
        },

        "should return matcher": function () {
            var match = sinon.match(function () {}, "");

            assert(sinon.match.isMatcher(match));
        },

        "should expose test function": function () {
            var test = function () {};

            var match = sinon.match(test, "");

            assertSame(test, match.test);
        },

        "should return true if properties are equal": function () {
            var match = sinon.match({ str: "sinon", nr: 1 });

            assert(match.test({ str: "sinon", nr: 1, other: "ignored" }));
        },

        "should return true if properties are deep equal": function () {
            var match = sinon.match({ deep: { str: "sinon" } });

            assert(match.test({ deep: { str: "sinon", ignored: "value" } }));
        },

        "should return false if a property is not equal": function () {
            var match = sinon.match({ str: "sinon", nr: 1 });

            assertFalse(match.test({ str: "sinon", nr: 2 }));
        },

        "should return false if a property is missing": function () {
            var match = sinon.match({ str: "sinon", nr: 1 });

            assertFalse(match.test({ nr: 1 }));
        },

        "should return true if test matches": function () {
            var match = sinon.match({ prop: sinon.match.typeOf("boolean") });

            assert(match.test({ prop: true }));
        },

        "should return false if test does not match": function () {
            var match = sinon.match({ prop: sinon.match.typeOf("boolean") });

            assertFalse(match.test({ prop: "no" }));
        },

        "should return true if deep test matches": function () {
            var match = sinon.match({ deep: { prop: sinon.match.typeOf("boolean") } });

            assert(match.test({ deep: { prop: true } }));
        },

        "should return false if deep test does not match": function () {
            var match = sinon.match({ deep: { prop: sinon.match.typeOf("boolean") } });

            assertFalse(match.test({ deep: { prop: "no" } }));
        },

        "should return false if tested value is null or undefined": function () {
            var match = sinon.match({});

            assertFalse(match.test(null));
            assertFalse(match.test(undefined));
        },

        "should return true if error message matches": function () {
            var match = sinon.match({ message: "evil error" });

            assert(match.test(new Error("evil error")));
        },

        "should return true if string property matches": function () {
            var match = sinon.match({ length: 5 });

            assert(match.test("sinon"));
        },

        "should return true if number property matches": function () {
            var match = sinon.match({ toFixed: sinon.match.func });

            assert(match.test(0));
        },

        "should return true for string match": function () {
            var match = sinon.match("sinon");

            assert(match.test("sinon"));
        },

        "should return true for substring match": function () {
            var match = sinon.match("no");

            assert(match.test("sinon"));
        },

        "should return false for string mismatch": function () {
            var match = sinon.match("Sinon.JS");

            assertFalse(match.test(null));
            assertFalse(match.test({}));
            assertFalse(match.test("sinon"));
            assertFalse(match.test("sinon.js"));
        },

        "should return true for regexp match": function () {
            var match = sinon.match(/^[sino]+$/);

            assert(match.test("sinon"));
        },

        "should return false for regexp string mismatch": function () {
            var match = sinon.match(/^[sin]+$/);

            assertFalse(match.test("sinon"));
        },

        "should return false for regexp type mismatch": function () {
            var match = sinon.match(/.*/);

            assertFalse(match.test());
            assertFalse(match.test(null));
            assertFalse(match.test(123));
            assertFalse(match.test({}));
        }
    });

    testCase("MatchToStringTest", {
        "should return message": function () {
            var message = "hello sinon.match";

            var match = sinon.match(function () {}, message);

            assertSame(message, match.toString());
        }
    });

    testCase("MatchAnyTest", {
        "should be matcher": function () {
            assert(sinon.match.isMatcher(sinon.match.any));
        },

        "should return true when tested": function () {
            assert(sinon.match.any.test());
        }
    });

    testCase("MatchDefinedTest", {
        "should be matcher": function () {
            assert(sinon.match.isMatcher(sinon.match.defined));
        },

        "should return false if test is called with null": function () {
            assertFalse(sinon.match.defined.test(null));
        },

        "should return false if test is called with undefined": function () {
            assertFalse(sinon.match.defined.test(undefined));
        },

        "should return true if test is called with any value": function () {
            assert(sinon.match.defined.test(false));
            assert(sinon.match.defined.test(true));
            assert(sinon.match.defined.test(0));
            assert(sinon.match.defined.test(1));
            assert(sinon.match.defined.test(""));
        },

        "should return true if test is called with any object": function () {
            assert(sinon.match.defined.test({}));
            assert(sinon.match.defined.test(function () {}));
        },
    });

    testCase("MatchSameTest", {
        "should return matcher": function () {
            var same = sinon.match.same();

            assert(sinon.match.isMatcher(same));
        },

        "should return true if test is called with same argument": function () {
            var object = {};
            var same = sinon.match.same(object);

            assert(same.test(object));
        },

        "should return false if test is not called with same argument": function () {
            var same = sinon.match.same({});

            assertFalse(same.test({}));
        }
    });

    testCase("MatchTypeOfTest", {
        "should throw if given argument is not a string": function () {
            assertException(function () {
                sinon.match.typeOf();
            }, "TypeError");
            assertException(function () {
                sinon.match.typeOf(123);
            }, "TypeError");
        },

        "should return matcher": function () {
            var typeOf = sinon.match.typeOf("string");

            assert(sinon.match.isMatcher(typeOf));
        },

        "should return true if test is called with string": function () {
            var typeOf = sinon.match.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        },

        "should return false if test is not called with string": function () {
            var typeOf = sinon.match.typeOf("string");

            assertFalse(typeOf.test(123));
        },

        "should return true if test is called with regexp": function () {
            var typeOf = sinon.match.typeOf("regexp");

            assert(typeOf.test(/.+/));
        },

        "should return false if test is not called with regexp": function () {
            var typeOf = sinon.match.typeOf("regexp");

            assertFalse(typeOf.test(true));
        }
    });

    testCase("MatchInstanceOfTest", {
        "should throw if given argument is not a function": function () {
            assertException(function () {
                sinon.match.instanceOf();
            }, "TypeError");
            assertException(function () {
                sinon.match.instanceOf("foo");
            }, "TypeError");
        },

        "should return matcher": function () {
            var instanceOf = sinon.match.instanceOf(function () {});

            assert(sinon.match.isMatcher(instanceOf));
        },

        "should return true if test is called with instance of argument": function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assert(instanceOf.test([]));
        },

        "should return false if test is not called with instance of argument": function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assertFalse(instanceOf.test({}));
        }
    });

    function propertyMatcherTests(matcher) {
        return {
            "should return matcher": function () {
                var has = matcher("foo");

                assert(sinon.match.isMatcher(has));
            },

            "should throw if first argument is not string": function () {
                assertException(function () {
                    matcher();
                }, "TypeError");
                assertException(function () {
                    matcher(123);
                }, "TypeError");
            },

            "should return false if value is undefined or null": function () {
                var has = matcher("foo");

                assertFalse(has.test(undefined));
                assertFalse(has.test(null));
            },

            "should return true if object has property": function () {
                var has = matcher("foo");

                assert(has.test({ foo: null }));
            },

            "should return false if object value is not equal to given value": function () {
                var has = matcher("foo", 1);

                assertFalse(has.test({ foo: null }));
            },

            "should return true if object value is equal to given value": function () {
                var has = matcher("message", "sinon rocks");

                assert(has.test({ message: "sinon rocks" }));
                assert(has.test(new Error("sinon rocks")));
            },

            "should return true if string property matches": function () {
                var has = matcher("length", 5);

                assert(has.test("sinon"));
            },

            "should allow to expect undefined": function () {
                var has = matcher("foo", undefined);

                assertFalse(has.test({ foo: 1 }));
            },

            "should compare value deeply": function () {
                var has = matcher("foo", { bar: "doo", test: 42 });

                assert(has.test({ foo: { bar: "doo", test: 42 } }));
            },

            "should compare with matcher": function () {
                var has = matcher("callback", sinon.match.typeOf("function"));

                assert(has.test({ callback: function () {} }));
            }
        };
    }

    testCase("MatchHasTest", propertyMatcherTests(sinon.match.has));

    testCase("MatchHasOwnTest", propertyMatcherTests(sinon.match.hasOwn));

    testCase("MatchHasSpecialTest", {
        "should return true if object has inherited property": function () {
            var has = sinon.match.has("toString");

            assert(has.test({}));
        },

        "should only include property in message": function () {
            var has = sinon.match.has("test");

            assertEquals("has(\"test\")", has.toString());
        },

        "should include property and value in message": function () {
            var has = sinon.match.has("test", undefined);

            assertEquals("has(\"test\", undefined)", has.toString());
        },

        "should return true if string function matches": function () {
            var has = sinon.match.has("toUpperCase", sinon.match.func);

            assert(has.test("sinon"));
        },

        "should return true if number function matches": function () {
            var has = sinon.match.has("toFixed", sinon.match.func);

            assert(has.test(0));
        }
    });

    testCase("MatchHasOwnSpecialTest", {
        "should return false if object has inherited property": function () {
          var hasOwn = sinon.match.hasOwn("toString");

          assertFalse(hasOwn.test({}));
        },

        "should only include property in message": function () {
            var hasOwn = sinon.match.hasOwn("test");

            assertEquals("hasOwn(\"test\")", hasOwn.toString());
        },

        "should include property and value in message": function () {
            var hasOwn = sinon.match.hasOwn("test", undefined);

            assertEquals("hasOwn(\"test\", undefined)", hasOwn.toString());
        }
    });

    testCase("MatchBoolTest", {
        "should be typeOf boolean matcher": function () {
            var bool = sinon.match.bool;

            assert(sinon.match.isMatcher(bool));
            assertEquals("typeOf(\"boolean\")", bool.toString());
        }
    });

    testCase("MatchNumberTest", {
        "should be typeOf number matcher": function () {
            var number = sinon.match.number;

            assert(sinon.match.isMatcher(number));
            assertEquals("typeOf(\"number\")", number.toString());
        }
    });

    testCase("MatchStringTest", {
        "should be typeOf string matcher": function () {
            var string = sinon.match.string;

            assert(sinon.match.isMatcher(string));
            assertEquals("typeOf(\"string\")", string.toString());
        }
    });

    testCase("MatchObjectTest", {
        "should be typeOf object matcher": function () {
            var object = sinon.match.object;

            assert(sinon.match.isMatcher(object));
            assertEquals("typeOf(\"object\")", object.toString());
        }
    });

    testCase("MatchFuncTest", {
        "should be typeOf function matcher": function () {
            var func = sinon.match.func;

            assert(sinon.match.isMatcher(func));
            assertEquals("typeOf(\"function\")", func.toString());
        }
    });

    testCase("MatchArrayTest", {
        "should be typeOf array matcher": function () {
            var array = sinon.match.array;

            assert(sinon.match.isMatcher(array));
            assertEquals("typeOf(\"array\")", array.toString());
        }
    });

    testCase("MatchRegexpTest", {
        "should be typeOf regexp matcher": function () {
            var regexp = sinon.match.regexp;

            assert(sinon.match.isMatcher(regexp));
            assertEquals("typeOf(\"regexp\")", regexp.toString());
        }
    });

    testCase("MatchDateTest", {
        "should be typeOf regexp matcher": function () {
            var date = sinon.match.date;

            assert(sinon.match.isMatcher(date));
            assertEquals("typeOf(\"date\")", date.toString());
        }
    });

    testCase("MatchOrTest", {
        "should be matcher": function () {
            var numberOrString = sinon.match.number.or(sinon.match.string);

            assert(sinon.match.isMatcher(numberOrString));
            assertEquals("typeOf(\"number\").or(typeOf(\"string\"))",
                numberOrString.toString());
        },

        "should require matcher argument": function () {
            assertException(function () {
                sinon.match.instanceOf(Error).or();
            }, "TypeError");
            assertException(function () {
                sinon.match.same({}).or({});
            }, "TypeError");
        },

        "should return true if either matcher matches": function () {
            var numberOrString = sinon.match.number.or(sinon.match.string);

            assert(numberOrString.test(123));
            assert(numberOrString.test("abc"));
        },

        "should return false if neither matcher matches": function () {
            var numberOrString = sinon.match.number.or(sinon.match.string);

            assertFalse(numberOrString.test(/.+/));
            assertFalse(numberOrString.test(new Date()));
            assertFalse(numberOrString.test({}));
        }
    });

    testCase("MatchAndTest", {
        "should be matcher": function () {
            var fooAndBar = sinon.match.has("foo").and(sinon.match.has("bar"));

            assert(sinon.match.isMatcher(fooAndBar));
            assertEquals("has(\"foo\").and(has(\"bar\"))", fooAndBar.toString());
        },

        "should require matcher argument": function () {
            assertException(function () {
                sinon.match.instanceOf(Error).and();
            }, "TypeError");
            assertException(function () {
                sinon.match.same({}).and({});
            }, "TypeError");
        },

        "should return true if both matchers match": function () {
            var fooAndBar = sinon.match.has("foo").and(sinon.match.has("bar"));

            assert(fooAndBar.test({ foo: "foo", bar: "bar" }));
        },

        "should return false if either matcher does not match": function () {
            var fooAndBar = sinon.match.has("foo").and(sinon.match.has("bar"));

            assertFalse(fooAndBar.test({ foo: "foo" }));
            assertFalse(fooAndBar.test({ bar: "bar" }));
        }
    });
}());
