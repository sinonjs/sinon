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

        "should require function argument": function () {
            assertException(function () {
                sinon.match();
            }, "TypeError");
        },

        "should expose test function": function () {
            var test = function () {};

            var match = sinon.match(test, "");

            assertSame(test, match.test);
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

    testCase("MatchLikeTest", {
        "should return matcher": function () {
            var like = sinon.match.like({});

            assert(sinon.match.isMatcher(like));
        },

        "should throw if argument is not an object": function () {
            assertException(function () {
                sinon.match.like(null);
            }, "TypeError");
            assertException(function () {
                sinon.match.like(undefined);
            }, "TypeError");
            assertException(function () {
                sinon.match.like([]);
            }, "TypeError");
        },

        "should return true if properties are equal": function () {
            var like = sinon.match.like({ str: "sinon", nr: 1 });

            assert(like.test({ str: "sinon", nr: 1, other: "ignored" }));
        },

        "should return true if properties are deep equal": function () {
            var like = sinon.match.like({ deep: { str: "sinon" } });

            assert(like.test({ deep: { str: "sinon", ignored: "value" } }));
        },

        "should return false if a property is not equal": function () {
            var like = sinon.match.like({ str: "sinon", nr: 1 });

            assertFalse(like.test({ str: "sinon", nr: 2 }));
        },

        "should return false if a property is missing": function () {
            var like = sinon.match.like({ str: "sinon", nr: 1 });

            assertFalse(like.test({ nr: 1 }));
        },

        "should return true if test matches": function () {
            var like = sinon.match.like({ prop: sinon.match.typeOf("boolean") });

            assert(like.test({ prop: true }));
        },

        "should return false if test does not match": function () {
            var like = sinon.match.like({ prop: sinon.match.typeOf("boolean") });

            assertFalse(like.test({ prop: "no" }));
        },

        "should return true if deep test matches": function () {
            var like = sinon.match.like({ deep: { prop: sinon.match.typeOf("boolean") } });

            assert(like.test({ deep: { prop: true } }));
        },

        "should return false if deep test does not match": function () {
            var like = sinon.match.like({ deep: { prop: sinon.match.typeOf("boolean") } });

            assertFalse(like.test({ deep: { prop: "no" } }));
        },

        "should return false if tested value is null or undefined": function () {
            var like = sinon.match.like({});

            assertFalse(like.test(null));
            assertFalse(like.test(undefined));
        },

        "should return true if error message matches": function () {
            var like = sinon.match.like({ message: "evil error" });

            assert(like.test(new Error("evil error")));
        },

        "should return true if string property matches": function () {
            var like = sinon.match.like({ length: 5 });

            assert(like.test("sinon"));
        },

        "should return true if number property matches": function () {
            var like = sinon.match.like({ toFixed: sinon.match.func });

            assert(like.test(0));
        },

        "should return true for string match": function () {
            var like = sinon.match.like("sinon");

            assert(like.test("sinon"));
        },

        "should return true for substring match": function () {
            var like = sinon.match.like("no");

            assert(like.test("sinon"));
        },

        "should return false for string mismatch": function () {
            var like = sinon.match.like("Sinon.JS");

            assertFalse(like.test(null));
            assertFalse(like.test({}));
            assertFalse(like.test("sinon"));
            assertFalse(like.test("sinon.js"));
        },

        "should return true for regexp match": function () {
            var like = sinon.match.like(/^[sino]+$/);

            assert(like.test("sinon"));
        },

        "should return false for regexp string mismatch": function () {
            var like = sinon.match.like(/^[sin]+$/);

            assertFalse(like.test("sinon"));
        },

        "should return false for regexp type mismatch": function () {
            var like = sinon.match.like(/.*/);

            assertFalse(like.test());
            assertFalse(like.test(null));
            assertFalse(like.test(123));
            assertFalse(like.test({}));
        },

        "should return true for boolean true(ish) match": function () {
            var like = sinon.match.like(true);

            assert(like.test(true));
            assert(like.test(1));
            assert(like.test("indeed"));
        },

        "should return true for boolean false(ish) match": function () {
            var like = sinon.match.like(false);

            assert(like.test(false));
            assert(like.test(0));
            assert(like.test(""));
        },

        "should return false for boolean true(ish) mismatch": function () {
            var like = sinon.match.like(true);

            assertFalse(like.test(false));
            assertFalse(like.test(0));
            assertFalse(like.test(""));
        },

        "should return false for boolean false(ish) mismatch": function () {
            var like = sinon.match.like(false);

            assertFalse(like.test(true));
            assertFalse(like.test(1));
            assertFalse(like.test("nope"));
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
