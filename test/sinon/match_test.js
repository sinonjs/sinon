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

    testCase("MatchReTest", {
        "should throw if given argument is not a regular expression": function () {
            assertException(function () {
                sinon.match.re();
            }, "TypeError");
            assertException(function () {
                sinon.match.re("foo");
            }, "TypeError");
        },

        "should return matcher": function () {
            var re = sinon.match.re(/.+/);

            assert(sinon.match.isMatcher(re));
        },

        "should return true if test is called with instance of argument": function () {
            var re = sinon.match.re(/[a-c]/);

            assert(re.test("b"));
        },

        "should return false if test is not called with instance of argument": function () {
            var re = sinon.match.re(/[a-c]/);

            assertFalse(re.test("d"));
        },

        "should return false if argument is not string": function () {
            var re = sinon.match.re(/.*/);

            assertFalse(re.test());
            assertFalse(re.test(null));
            assertFalse(re.test(123));
            assertFalse(re.test({}));
        }
    });

    testCase("MatchLikeTest", {
        "should return matcher": function () {
            var like = sinon.match.like({});

            assert(sinon.match.isMatcher(like));
        },

        "should throw if argument is not object": function () {
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

        "should return false if tested value is not object": function () {
          var like = sinon.match.like({});

          assertFalse(like.test(null));
          assertFalse(like.test(undefined));
          assertFalse(like.test("no"));
          assertFalse(like.test([]));
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

            "should return false if value is not object": function () {
                var has = matcher("foo");

                assertFalse(has.test());
                assertFalse(has.test(null));
                assertFalse(has.test(123));
                assertFalse(has.test("test"));
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
                var has = matcher("foo", 1);

                assert(has.test({ foo: 1 }));
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
}());
