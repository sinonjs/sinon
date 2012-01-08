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
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../test_case_shim");
    var sinon = require("../../lib/sinon");
}

(function () {
    testCase("SpyCreateTest", {
        "should be function": function () {
            assertFunction(sinon.spy.create);
        },

        "should not throw if called without function": function () {
            assertNoException(function () {
                sinon.spy.create();
            });
        },

        "should not throw when calling anonymous spy": function () {
            var spy = sinon.spy.create();

            assertNoException(function () {
                spy();
            });

            assert(spy.called);
        },

        "should return spy function": function () {
            var func = function () {};
            var spy = sinon.spy.create(func);

            assertFunction(spy);
            assertNotSame(spy, func);
        },

        "should mirror custom properties on function": function () {
            var func = function () {};
            func.myProp = 42;
            var spy = sinon.spy.create(func);

            assertEquals(func.myProp, spy.myProp);
        },

        "should not define create method": function () {
            var spy = sinon.spy.create();

            assertUndefined(spy.create);
        },

        "should not overwrite original create property": function () {
            var func = function () {};
            var object = func.create = {};
            var spy = sinon.spy.create(func);

            assertSame(object, spy.create);
        },

        "should setup logging arrays": function () {
            var spy = sinon.spy.create();

            assertArray(spy.args);
            assertArray(spy.returnValues);
            assertArray(spy.thisValues);
            assertArray(spy.exceptions);
        }
    });

    testCase("SpyCallTest", {
        "should call underlying function": function () {
            var called = false;

            var spy = sinon.spy.create(function () {
                called = true;
            });

            spy();

            assert(called);
        },

        "should pass arguments to function": function () {
            var actualArgs;

            var func = function () {
                actualArgs = arguments;
            };

            var args = [1, {}, [], ""];
            var spy = sinon.spy.create(func);
            spy(args[0], args[1], args[2], args[3]);

            assertEquals(args, actualArgs);
        },

        "should maintain this binding": function () {
            var actualThis;

            var func = function () {
                actualThis = this;
            };

            var object = {};
            var spy = sinon.spy.create(func);
            spy.call(object);

            assertSame(object, actualThis);
        },

        "should return function's return value": function () {
            var object = {};

            var func = function () {
                return object;
            };

            var spy = sinon.spy.create(func);
            var actualReturn = spy();

            assertSame(object, actualReturn);
        },

        "should throw if function throws": function () {
            var err = new Error();
            var spy = sinon.spy.create(function () {
                throw err;
            });

            try {
                spy();
                fail("Expected spy to throw exception");
            } catch (e) {
                assertSame(err, e);
            }
        }
    });

    testCase("SpyCalledTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false prior to calling the spy": function () {
            assertFalse(this.spy.called);
        },

        "should be true after calling the spy once": function () {
            this.spy();

            assert(this.spy.called);
        },

        "should be true after calling the spy twice": function () {
            this.spy();
            this.spy();

            assert(this.spy.called);
        }
    });

    testCase("SpyCalledOnceTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false prior to calling the spy": function () {
            assertFalse(this.spy.calledOnce);
        },

        "should be true after calling the spy once": function () {
            this.spy();

            assert(this.spy.calledOnce);
        },

        "should be false after calling the spy twice": function () {
            this.spy();
            this.spy();

            assertFalse(this.spy.calledOnce);
        }
    });

    testCase("SpyCalledTwiceTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false prior to calling the spy": function () {
            assertFalse(this.spy.calledTwice);
        },

        "should be false after calling the spy once": function () {
            this.spy();

            assertFalse(this.spy.calledTwice);
        },

        "should be true after calling the spy twice": function () {
            this.spy();
            this.spy();

            assert(this.spy.calledTwice);
        },

        "should be false after calling the spy thrice": function () {
            this.spy();
            this.spy();
            this.spy();

            assertFalse(this.spy.calledTwice);
        }
    });

    testCase("SpyCalledThriceTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false prior to calling the spy": function () {
            assertFalse(this.spy.calledThrice);
        },

        "should be false after calling the spy twice": function () {
            this.spy();
            this.spy();

            assertFalse(this.spy.calledThrice);
        },

        "should be true after calling the spy thrice": function () {
            this.spy();
            this.spy();
            this.spy();

            assert(this.spy.calledThrice);
        },

        "should be false after calling the spy four times": function () {
            this.spy();
            this.spy();
            this.spy();
            this.spy();

            assertFalse(this.spy.calledThrice);
        }
    });

    testCase("SpyCallCountTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should report 0 calls": function () {
            assertEquals(0, this.spy.callCount);
        },

        "should record one call": function () {
            this.spy();

            assertEquals(1, this.spy.callCount);
        },

        "should record two calls": function () {
            this.spy();
            this.spy();

            assertEquals(2, this.spy.callCount);
        },

        "should increase call count for each call": function () {
            this.spy();
            this.spy();
            assertEquals(2, this.spy.callCount);

            this.spy();
            assertEquals(3, this.spy.callCount);
        }
    });

    testCase("SpyCalledOnTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false if spy wasn't called": function () {
            assertFalse(this.spy.calledOn({}));
        },

        "should be true if called with thisValue": function () {
            var object = {};
            this.spy.call(object);

            assert(this.spy.calledOn(object));
        },

        "should be true if called on object at least once": function () {
            var object = {};
            this.spy();
            this.spy.call({});
            this.spy.call(object);
            this.spy.call(window);

            assert(this.spy.calledOn(object));
        },

        "should return false if not called on object": function () {
            var object = {};
            this.spy.call(object);
            this.spy();

            assertFalse(this.spy.calledOn({}));
        }
    });

    testCase("SpyAlwaysCalledOnTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false prior to calling the spy": function () {
            assertFalse(this.spy.alwaysCalledOn({}));
        },

        "should be true if called with thisValue once": function () {
            var object = {};
            this.spy.call(object);

            assert(this.spy.alwaysCalledOn(object));
        },

        "should be true if called with thisValue many times": function () {
            var object = {};
            this.spy.call(object);
            this.spy.call(object);
            this.spy.call(object);
            this.spy.call(object);

            assert(this.spy.alwaysCalledOn(object));
        },

        "should be false if called with another object atleast once": function () {
            var object = {};
            this.spy.call(object);
            this.spy.call(object);
            this.spy.call(object);
            this.spy();
            this.spy.call(object);

            assertFalse(this.spy.alwaysCalledOn(object));
        },

        "should be false if never called with expected object": function () {
            var object = {};
            this.spy();
            this.spy();
            this.spy();

            assertFalse(this.spy.alwaysCalledOn(object));
        }
    });

    testCase("SpyCalledWithNewTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false if spy wasn't called": function () {
            assertFalse(this.spy.calledWithNew());
        },

        "should be true if called with new": function () {
            var result = new this.spy();

            assert(this.spy.calledWithNew());
        },

        "should be true if called with new on custom constructor": function () {
            function MyThing() {}
            MyThing.prototype = {};
            var ns = { MyThing: MyThing };
            sinon.spy(ns, "MyThing");

            var result = new ns.MyThing();
            assert(ns.MyThing.calledWithNew());
        },

        "should be false if called as function": function () {
            this.spy();

            assertFalse(this.spy.calledWithNew());
        },

        "should be true if called with new at least once": function () {
            var object = {};
            this.spy();
            var a = new this.spy();
            this.spy(object);
            this.spy(window);

            assert(this.spy.calledWithNew());
        },

        "should be true newed constructor returns object": function () {
            function MyThing() { return {}; }
            var object = { MyThing: MyThing };
            sinon.spy(object, "MyThing");

            var result = new object.MyThing;

            assert(object.MyThing.calledWithNew());
        }
    });

    testCase("SpyAlwaysCalledWithNewTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should be false if spy wasn't called": function () {
            assertFalse(this.spy.alwaysCalledWithNew());
        },

        "should be true if always called with new": function () {
            var result = new this.spy();
            var result2 = new this.spy();
            var result3 = new this.spy();

            assert(this.spy.alwaysCalledWithNew());
        },

        "should be false if called as function once": function () {
            var result = new this.spy();
            var result2 = new this.spy();
            this.spy();

            assertFalse(this.spy.alwaysCalledWithNew());
        }
    });

    testCase("SpyThisValueTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should contain one object": function () {
            var object = {};
            this.spy.call(object);

            assertEquals([object], this.spy.thisValues);
        },

        "should stack up objects": function () {
            function MyConstructor() {}
            var objects = [{}, [], new MyConstructor(), { id: 243 }];
            this.spy();
            this.spy.call(objects[0]);
            this.spy.call(objects[1]);
            this.spy.call(objects[2]);
            this.spy.call(objects[3]);

            assertEquals([this].concat(objects), this.spy.thisValues);
        }
    });

    testCase("SpyCalledWithTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should return false if spy was not called": function () {
            assertFalse(this.spy.calledWith(1, 2, 3));
        },

        "should return true if spy was called with args": function () {
            this.spy(1, 2, 3);

            assert(this.spy.calledWith(1, 2, 3));
        },

        "should return true if called with args at least once": function () {
            this.spy(1, 3, 3);
            this.spy(1, 2, 3);
            this.spy(3, 2, 3);

            assert(this.spy.calledWith(1, 2, 3));
        },

        "should return false if not called with args": function () {
            this.spy(1, 3, 3);
            this.spy(2);
            this.spy();

            assertFalse(this.spy.calledWith(1, 2, 3));
        },

        "should return true for partial match": function () {
            this.spy(1, 3, 3);
            this.spy(2);
            this.spy();

            assert(this.spy.calledWith(1, 3));
        },

        "should match all arguments individually, not as array": function () {
            this.spy([1, 2, 3]);

            assertFalse(this.spy.calledWith(1, 2, 3));
        }
    });

    testCase("SpyAlwaysCalledWithTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should return false if spy was not called": function () {
            assertFalse(this.spy.alwaysCalledWith(1, 2, 3));
        },

        "should return true if spy was called with args": function () {
            this.spy(1, 2, 3);

            assert(this.spy.alwaysCalledWith(1, 2, 3));
        },

        "should return false if called with args only once": function () {
            this.spy(1, 3, 3);
            this.spy(1, 2, 3);
            this.spy(3, 2, 3);

            assertFalse(this.spy.alwaysCalledWith(1, 2, 3));
        },

        "should return false if not called with args": function () {
            this.spy(1, 3, 3);
            this.spy(2);
            this.spy();

            assertFalse(this.spy.alwaysCalledWith(1, 2, 3));
        },

        "should return true for partial match": function () {
            this.spy(1, 3, 3);

            assert(this.spy.alwaysCalledWith(1, 3));
        },

        "should return true for partial match on many calls": function () {
            this.spy(1, 3, 3);
            this.spy(1, 3);
            this.spy(1, 3, 4, 5);
            this.spy(1, 3, 1);

            assert(this.spy.alwaysCalledWith(1, 3));
        },

        "should match all arguments individually, not as array": function () {
            this.spy([1, 2, 3]);

            assertFalse(this.spy.alwaysCalledWith(1, 2, 3));
        }
    });

    testCase("SpyNeverCalledWithTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should return true if spy was not called": function () {
            assert(this.spy.neverCalledWith(1, 2, 3));
        },

        "should return false if spy was called with args": function () {
            this.spy(1, 2, 3);

            assertFalse(this.spy.neverCalledWith(1, 2, 3));
        },

        "should return false if called with args at least once": function () {
            this.spy(1, 3, 3);
            this.spy(1, 2, 3);
            this.spy(3, 2, 3);

            assertFalse(this.spy.neverCalledWith(1, 2, 3));
        },

        "should return true if not called with args": function () {
            this.spy(1, 3, 3);
            this.spy(2);
            this.spy();

            assert(this.spy.neverCalledWith(1, 2, 3));
        },

        "should return false for partial match": function () {
            this.spy(1, 3, 3);
            this.spy(2);
            this.spy();

            assertFalse(this.spy.neverCalledWith(1, 3));
        },

        "should match all arguments individually, not as array": function () {
            this.spy([1, 2, 3]);

            assert(this.spy.neverCalledWith(1, 2, 3));
        }
    });

    testCase("SpyArgsTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should contain real arrays": function () {
            this.spy();

            assertArray(this.spy.args[0]);
        },

        "should contain empty array when no arguments": function () {
            this.spy();

            assertEquals([[]], this.spy.args);
        },

        "should contain array with first call's arguments": function () {
            this.spy(1, 2, 3);

            assertEquals([[1, 2, 3]], this.spy.args);
        },

        "should stack up arguments in nested array": function () {
            var objects = [{}, [], { id: 324 }];
            this.spy(1, objects[0], 3);
            this.spy(1, 2, objects[1]);
            this.spy(objects[2], 2, 3);

            assertEquals([[1, objects[0], 3],
                          [1, 2, objects[1]],
                          [objects[2], 2, 3]], this.spy.args);
        }
    });

    testCase("CalledWithExactlyTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should return false for partial match": function () {
            this.spy(1, 2, 3);

            assertFalse(this.spy.calledWithExactly(1, 2));
        },

        "should return false for missing arguments": function () {
            this.spy(1, 2, 3);

            assertFalse(this.spy.calledWithExactly(1, 2, 3, 4));
        },

        "should return true for exact match": function () {
            this.spy(1, 2, 3);

            assert(this.spy.calledWithExactly(1, 2, 3));
        },

        "should match by strict comparison": function () {
            this.spy({}, []);

            assertFalse(this.spy.calledWithExactly({}, [], null));
        },

        "should return true for one exact match": function () {
            var object = {};
            var array = [];
            this.spy({}, []);
            this.spy(object, []);
            this.spy(object, array);

            assert(this.spy.calledWithExactly(object, array));
        }
    });

    testCase("AlwaysCalledWithExactlyTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
        },

        "should return false for partial match": function () {
            this.spy(1, 2, 3);

            assertFalse(this.spy.alwaysCalledWithExactly(1, 2));
        },

        "should return false for missing arguments": function () {
            this.spy(1, 2, 3);

            assertFalse(this.spy.alwaysCalledWithExactly(1, 2, 3, 4));
        },

        "should return true for exact match": function () {
            this.spy(1, 2, 3);

            assert(this.spy.alwaysCalledWithExactly(1, 2, 3));
        },

        "should return false for excess arguments": function () {
            this.spy({}, []);

            assertFalse(this.spy.alwaysCalledWithExactly({}, [], null));
        },

        "should return false for one exact match": function () {
            var object = {};
            var array = [];
            this.spy({}, []);
            this.spy(object, []);
            this.spy(object, array);

            assert(this.spy.alwaysCalledWithExactly(object, array));
        },

        "should return true for only exact matches": function () {
            var object = {};
            var array = [];

            this.spy(object, array);
            this.spy(object, array);
            this.spy(object, array);

            assert(this.spy.alwaysCalledWithExactly(object, array));
        },

        "should return false for no exact matches": function () {
            var object = {};
            var array = [];

            this.spy(object, array, null);
            this.spy(object, array, undefined);
            this.spy(object, array, "");

            assertFalse(this.spy.alwaysCalledWithExactly(object, array));
        }
    });

    testCase("SpyThrewTest", {
        setUp: function () {
            this.spy = sinon.spy.create();

            this.spyWithTypeError = sinon.spy.create(function () {
                throw new TypeError();
            });
        },

        "should return exception thrown by function": function () {
            var err = new Error();

            var spy = sinon.spy.create(function () {
                throw err;
            });

            try {
                spy();
            } catch (e) {}

            assert(spy.threw(err));
        },

        "should return false if spy did not throw": function () {
            this.spy();

            assertFalse(this.spy.threw());
        },

        "should return true if spy threw": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assert(this.spyWithTypeError.threw());
        },

        "should return true if string type matches": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assert(this.spyWithTypeError.threw("TypeError"));
        },

        "should return false if string did not match": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assertFalse(this.spyWithTypeError.threw("Error"));
        },

        "should return false if spy did not throw specified error": function () {
            this.spy();

            assertFalse(this.spy.threw("Error"));
        }
    });

    testCase("SpyAlwaysThrewTest", {
        setUp: function () {
            this.spy = sinon.spy.create();

            this.spyWithTypeError = sinon.spy.create(function () {
                throw new TypeError();
            });
        },

        "should return true when spy threw": function () {
            var err = new Error();

            var spy = sinon.spy.create(function () {
                throw err;
            });

            try {
                spy();
            } catch (e) {}

            assert(spy.alwaysThrew(err));
        },

        "should return false if spy did not throw": function () {
            this.spy();

            assertFalse(this.spy.alwaysThrew());
        },

        "should return true if spy threw": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assert(this.spyWithTypeError.alwaysThrew());
        },

        "should return true if string type matches": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assert(this.spyWithTypeError.alwaysThrew("TypeError"));
        },

        "should return false if string did not match": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assertFalse(this.spyWithTypeError.alwaysThrew("Error"));
        },

        "should return false if spy did not throw specified error": function () {
            this.spy();

            assertFalse(this.spy.alwaysThrew("Error"));
        },

        "should return false if some calls did not throw": function () {
            var spy = sinon.stub.create(function () {
                if (spy.callCount === 0) {
                    throw new Error();
                }
            });

            try {
                this.spy();
            } catch (e) {}

            this.spy();

            assertFalse(this.spy.alwaysThrew());
        },

        "should return true if all calls threw": function () {
            try {
                this.spyWithTypeError();
            } catch (e1) {}

            try {
                this.spyWithTypeError();
            } catch (e2) {}

            assert(this.spyWithTypeError.alwaysThrew());
        },

        "should return true if all calls threw same type": function () {
            try {
                this.spyWithTypeError();
            } catch (e1) {}

            try {
                this.spyWithTypeError();
            } catch (e2) {}

            assert(this.spyWithTypeError.alwaysThrew("TypeError"));
        }
    });

    testCase("SpyExceptionsTest", {
        setUp: function () {
            this.spy = sinon.spy.create();
            var error = this.error = {};

            this.spyWithTypeError = sinon.spy.create(function () {
                throw error;
            });
        },

        "should contain exception thrown by function": function () {
            try {
                this.spyWithTypeError();
            } catch (e) {}

            assertEquals([this.error], this.spyWithTypeError.exceptions);
        },

        "should contain undefined entry when function did not throw": function () {
            this.spy();

            assertEquals(1, this.spy.exceptions.length);
            assertUndefined(this.spy.exceptions[0]);
        },

        "should stack up exceptions and undefined": function () {
            var calls = 0;
            var err = this.error;

            var spy = sinon.spy.create(function () {
                calls += 1;

                if (calls % 2 === 0) {
                    throw err;
                }
            });

            spy();

            try {
                spy();
            } catch (e1) {}

            spy();

            try {
                spy();
            } catch (e2) {}

            spy();

            assertEquals(5, spy.exceptions.length);
            assertUndefined(spy.exceptions[0]);
            assertEquals(err, spy.exceptions[1]);
            assertUndefined(spy.exceptions[2]);
            assertEquals(err, spy.exceptions[3]);
            assertUndefined(spy.exceptions[4]);
        }
    });

    testCase("SpyReturnedTest", {
        "should return true when no argument": function () {
            var spy = sinon.spy.create();
            spy();

            assert(spy.returned());
        },

        "should return true for undefined when no explicit return": function () {
            var spy = sinon.spy.create();
            spy();

            assert(spy.returned(undefined));
        },

        "should return true when returned value once": function () {
            var values = [{}, 2, "hey", function () {}];
            var spy = sinon.spy.create(function () {
                return values[spy.callCount];
            });

            spy();
            spy();
            spy();
            spy();

            assert(spy.returned(values[3]));
        },

        "should return false when value is never returned": function () {
            var values = [{}, 2, "hey", function () {}];
            var spy = sinon.spy.create(function () {
                return values[spy.callCount];
            });

            spy();
            spy();
            spy();
            spy();

            assertFalse(spy.returned({ id: 42 }));
        },

        "should return true when value is returned several times": function () {
            var object = { id: 42 };
            var spy = sinon.spy.create(function () {
                return object;
            });

            spy();
            spy();
            spy();

            assert(spy.returned(object));
        },

        "should compare values strictly": function () {
            var object = { id: 42 };
            var spy = sinon.spy.create(function () {
                return object;
            });

            spy();

            assertFalse(spy.returned({ id: 42 }));
        }
    });

    testCase("SpyReturnValuesTest", {
        "should contain undefined when function does not return explicitly": function () {
            var spy = sinon.spy.create();
            spy();

            assertEquals(1, spy.returnValues.length);
            assertUndefined(spy.returnValues[0]);
        },

        "should contain return value": function () {
            var object = { id: 42 };

            var spy = sinon.spy.create(function () {
                return object;
            });

            spy();

            assertEquals([object], spy.returnValues);
        },

        "should contain undefined when function throws": function () {
            var spy = sinon.spy.create(function () {
                throw new Error();
            });

            try {
                spy();
            } catch (e) {
            }

            assertEquals(1, spy.returnValues.length);
            assertUndefined(spy.returnValues[0]);
        },

        "should stack up return values": function () {
            var calls = 0;

            var spy = sinon.spy.create(function () {
                calls += 1;

                if (calls % 2 === 0) {
                    return calls;
                }
            });

            spy();
            spy();
            spy();
            spy();
            spy();

            assertEquals(5, spy.returnValues.length);
            assertUndefined(spy.returnValues[0]);
            assertEquals(2, spy.returnValues[1]);
            assertUndefined(spy.returnValues[2]);
            assertEquals(4, spy.returnValues[3]);
            assertUndefined(spy.returnValues[4]);
        }
    });

    testCase("SpyCalledBeforeTest", {
        setUp: function () {
            this.spy1 = sinon.spy();
            this.spy2 = sinon.spy();
        },

        "should be function": function () {
            assertFunction(this.spy1.calledBefore);
        },

        "should return true if first call to A was before first to B": function () {
            this.spy1();
            this.spy2();

            assert(this.spy1.calledBefore(this.spy2));
        },

        "should compare call order of calls directly": function () {
            this.spy1();
            this.spy2();

            assert(this.spy1.getCall(0).calledBefore(this.spy2.getCall(0)));
        },

        "should return false if not called": function () {
            this.spy2();

            assertFalse(this.spy1.calledBefore(this.spy2));
        },

        "should return true if other not called": function () {
            this.spy1();

            assert(this.spy1.calledBefore(this.spy2));
        },

        "should return false if other called first": function () {
            this.spy2();
            this.spy1();
            this.spy2();

            assert(this.spy1.calledBefore(this.spy2));
        }
    });

    testCase("SpyCalledAfterTest", {
        setUp: function () {
            this.spy1 = sinon.spy();
            this.spy2 = sinon.spy();
        },

        "should be function": function () {
            assertFunction(this.spy1.calledAfter);
        },

        "should return true if first call to A was after first to B": function () {
            this.spy2();
            this.spy1();

            assert(this.spy1.calledAfter(this.spy2));
        },

        "should compare calls directly": function () {
            this.spy2();
            this.spy1();

            assert(this.spy1.getCall(0).calledAfter(this.spy2.getCall(0)));
        },

        "should return false if not called": function () {
            this.spy2();

            assertFalse(this.spy1.calledAfter(this.spy2));
        },

        "should return false if other not called": function () {
            this.spy1();

            assertFalse(this.spy1.calledAfter(this.spy2));
        },

        "should return false if other called last": function () {
            this.spy2();
            this.spy1();
            this.spy2();

            assertFalse(this.spy1.calledAfter(this.spy2));
        }
    });

    testCase("SpyFirstCallTest", {

        "should be undefined by default": function () {
            var spy = sinon.spy();

            assertNull(spy.firstCall);
        },

        "should be equal to getCall(0) result after first call": function () {
            var spy = sinon.spy();

            spy();

            var call0 = spy.getCall(0);
            assertEquals(call0.callId, spy.firstCall.callId);
            assertSame(call0.spy, spy.firstCall.spy);
        }

    });

    testCase("SpySecondCallTest", {

        "should be null by default": function () {
            var spy = sinon.spy();

            assertNull(spy.secondCall);
        },

        "should still be null after first call": function () {
            var spy = sinon.spy();
            spy();

            assertNull(spy.secondCall);
        },

        "should be equal to getCall(1) result after second call": function () {
            var spy = sinon.spy();

            spy();
            spy();

            var call1 = spy.getCall(1);
            assertEquals(call1.callId, spy.secondCall.callId);
            assertSame(call1.spy, spy.secondCall.spy);
        }

    });

    testCase("SpyThirdCallTest", {

        "should be undefined by default": function () {
            var spy = sinon.spy();

            assertNull(spy.thirdCall);
        },

        "should still be undefined after second call": function () {
            var spy = sinon.spy();
            spy();
            spy();

            assertNull(spy.thirdCall);
        },

        "should be equal to getCall(1) result after second call": function () {
            var spy = sinon.spy();

            spy();
            spy();
            spy();

            var call2 = spy.getCall(2);
            assertEquals(call2.callId, spy.thirdCall.callId);
            assertSame(call2.spy, spy.thirdCall.spy);
        }

    });

    testCase("SpyLastCallTest", {

        "should be undefined by default": function () {
            var spy = sinon.spy();

            assertNull(spy.lastCall);
        },

        "should be same as firstCall after first call": function () {
            var spy = sinon.spy();

            spy();

            assertSame(spy.firstCall.callId, spy.lastCall.callId);
            assertSame(spy.firstCall.spy, spy.lastCall.spy);
        },

        "should be same as secondCall after second call": function () {
            var spy = sinon.spy();

            spy();
            spy();

            assertSame(spy.secondCall.callId, spy.lastCall.callId);
            assertSame(spy.secondCall.spy, spy.lastCall.spy);
        },

        "should be same as thirdCall after third call": function () {
            var spy = sinon.spy();

            spy();
            spy();
            spy();

            assertSame(spy.thirdCall.callId, spy.lastCall.callId);
            assertSame(spy.thirdCall.spy, spy.lastCall.spy);
        },

        "should be equal to getCall(3) result after fourth call": function () {
            var spy = sinon.spy();

            spy();
            spy();
            spy();
            spy();

            var call3 = spy.getCall(3);
            assertEquals(call3.callId, spy.lastCall.callId);
            assertSame(call3.spy, spy.lastCall.spy);
        },

        "should be equal to getCall(4) result after fifth call": function () {
            var spy = sinon.spy();

            spy();
            spy();
            spy();
            spy();
            spy();

            var call4 = spy.getCall(4);
            assertEquals(call4.callId, spy.lastCall.callId);
            assertSame(call4.spy, spy.lastCall.spy);
        }

    });

    testCase("SpyCallArgTest", {

        "should be function": function () {
            var spy = sinon.spy();

            assertFunction(spy.callArg);
        },

        "should invoke argument at index for all calls": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            spy(1, 2, callback);
            spy(3, 4, callback);

            spy.callArg(2);

            assert(callback.calledTwice);
            assert(callback.alwaysCalledWith());
        },

        "should throw if argument at index is not a function": function () {
            var spy = sinon.spy();
            spy();

            assertException(function () {
                spy.callArg(1);
            }, "TypeError");
        },

        "should throw if spy was not yet invoked": function () {
            var spy = sinon.spy();

            try {
                spy.callArg(0);
                throw new Error();
            } catch (e) {
                assertEquals("spy cannot call arg since it was not yet invoked.", e.message);
            }
        },

        "should include spy name in error message": function () {
            var api = { someMethod: function () {} };
            var spy = sinon.spy(api, "someMethod");

            try {
                spy.callArg(0);
                throw new Error();
            } catch (e) {
                assertEquals("someMethod cannot call arg since it was not yet invoked.", e.message);
            }
        },

        "should throw if index is not a number": function () {
            var spy = sinon.spy();
            spy();

            assertException(function () {
                spy.callArg("");
            }, "TypeError");
        },

        "should pass additional arguments": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            var array = [];
            var object = {};
            spy(callback);

            spy.callArg(0, "abc", 123, array, object);

            assert(callback.calledWith("abc", 123, array, object));
        }

    });

    testCase("SpyCallArgWithTest", {

        "should be alias for callArg": function () {
            var spy = sinon.spy();

            assertSame(spy.callArg, spy.callArgWith);
        }

    });

    testCase("SpyYieldTest", {

        "should be function": function () {
            var spy = sinon.spy();

            assertFunction(spy.yield);
        },

        "should invoke first function arg for all calls": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            spy(1, 2, callback);
            spy(3, 4, callback);

            spy.yield();

            assert(callback.calledTwice);
            assert(callback.alwaysCalledWith());
        },

        "should throw if spy was not yet invoked": function () {
            var spy = sinon.spy();

            try {
                spy.yield();
                throw new Error();
            } catch (e) {
                assertEquals("spy cannot yield since it was not yet invoked.", e.message);
            }
        },

        "should include spy name in error message": function () {
            var api = { someMethod: function () {} };
            var spy = sinon.spy(api, "someMethod");

            try {
                spy.yield();
                throw new Error();
            } catch (e) {
                assertEquals("someMethod cannot yield since it was not yet invoked.", e.message);
            }
        },

		"should pass additional arguments": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            var array = [];
            var object = {};
            spy(callback);

            spy.yield("abc", 123, array, object);

            assert(callback.calledWith("abc", 123, array, object));
        }

    });

    testCase("SpyInvokeCallbackTest", {

        "should be alias for yield": function () {
            var spy = sinon.spy();

            assertSame(spy.yield, spy.invokeCallback);
        }

    });

    testCase("SpyYieldToTest", {

        "should be function": function () {
            var spy = sinon.spy();

            assertFunction(spy.yieldTo);
        },

        "should invoke first function arg for all calls": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            spy(1, 2, { success: callback });
            spy(3, 4, { success: callback });

            spy.yieldTo("success");

            assert(callback.calledTwice);
            assert(callback.alwaysCalledWith());
        },

        "should throw if spy was not yet invoked": function () {
            var spy = sinon.spy();

            try {
                spy.yieldTo("success");
                throw new Error();
            } catch (e) {
                assertEquals("spy cannot yield to 'success' since it was not yet invoked.", e.message);
            }
        },

        "should include spy name in error message": function () {
            var api = { someMethod: function () {} };
            var spy = sinon.spy(api, "someMethod");

            try {
                spy.yieldTo("success");
                throw new Error();
            } catch (e) {
                assertEquals("someMethod cannot yield to 'success' since it was not yet invoked.", e.message);
            }
        },

		"should pass additional arguments": function () {
            var spy = sinon.spy();
            var callback = sinon.spy();
            var array = [];
            var object = {};
            spy({ test: callback });

            spy.yieldTo("test", "abc", 123, array, object);

            assert(callback.calledWith("abc", 123, array, object));
        }

    });

    function spyCallSetUp() {
        this.thisValue = {};
        this.args = [{}, [], function () {}, 3];
        this.returnValue = function () {};
        this.call = sinon.spy.spyCall.create(function () {}, this.thisValue, this.args, this.returnValue);
    }

    testCase("SpyCallObjectTest", {
        setUp: spyCallSetUp,

        "should get call object": function () {
            var spy = sinon.spy.create();
            spy();
            var firstCall = spy.getCall(0);

            assertFunction(firstCall.calledOn);
            assertFunction(firstCall.calledWith);
            assertFunction(firstCall.returned);
        },

        "should record call id": function () {
            assertNumber(this.call.callId);
        },

        "should record ascending call id's": function () {
            var spy = sinon.spy();
            spy();

            assert(this.call.callId < spy.getCall(0).callId);
        },

        "should expose thisValue property": function () {
            var spy = sinon.spy();
            var obj = {};
            spy.call(obj);

            assertSame(obj, spy.getCall(0).thisValue);
        }
    });

    testCase("SpyCallCalledOnTest", {
        setUp: spyCallSetUp,

        "calledOn should return true": function () {
            assert(this.call.calledOn(this.thisValue));
        },

        "calledOn should return false": function () {
            assertFalse(this.call.calledOn({}));
        }
    });

    testCase("SpyCallCalledWithTest", {
        setUp: spyCallSetUp,

        "should return true if all args match": function () {
            var args = this.args;

            assert(this.call.calledWith(args[0], args[1], args[2]));
        },

        "should return true if first args match": function () {
            var args = this.args;

            assert(this.call.calledWith(args[0], args[1]));
        },

        "should return true if first arg match": function () {
            var args = this.args;

            assert(this.call.calledWith(args[0]));
        },

        "should return true for no args": function () {
            assert(this.call.calledWith());
        },

        "should return false for too many args": function () {
            var args = this.args;

            assertFalse(this.call.calledWith(args[0], args[1], args[2], {}));
        },

        "should return false for wrong arg": function () {
            var args = this.args;

            assertFalse(this.call.calledWith(args[0], args[2]));
        }
    });

    testCase("SpyCallNotCalledWithTest", {
        setUp: spyCallSetUp,

        "should return false if all args match": function () {
            var args = this.args;

            assertFalse(this.call.notCalledWith(args[0], args[1], args[2]));
        },

        "should return false if first args match": function () {
            var args = this.args;

            assertFalse(this.call.notCalledWith(args[0], args[1]));
        },

        "should return false if first arg match": function () {
            var args = this.args;

            assertFalse(this.call.notCalledWith(args[0]));
        },

        "should return false for no args": function () {
            assertFalse(this.call.notCalledWith());
        },

        "should return true for too many args": function () {
            var args = this.args;

            assert(this.call.notCalledWith(args[0], args[1], args[2], {}));
        },

        "should return true for wrong arg": function () {
            var args = this.args;

            assert(this.call.notCalledWith(args[0], args[2]));
        }
    });

    testCase("SpyCallCalledWithExactlyTest", {
        setUp: spyCallSetUp,

        "should return true when all args match": function () {
            var args = this.args;

            assert(this.call.calledWithExactly(args[0], args[1], args[2], args[3]));
        },

        "should return false for too many args": function () {
            var args = this.args;

            assertFalse(this.call.calledWithExactly(args[0], args[1], args[2], {}));
        },

        "should return false for too few args": function () {
            var args = this.args;

            assertFalse(this.call.calledWithExactly(args[0], args[1]));
        },

        "should return false for unmatching args": function () {
            var args = this.args;

            assertFalse(this.call.calledWithExactly(args[0], args[1], args[1]));
        },

        "should return true for no arguments": function () {
            var call = sinon.spy.spyCall.create(function () {}, {}, []);

            assert(call.calledWithExactly());
        },

        "should return false when called with no args but matching one": function () {
            var call = sinon.spy.spyCall.create(function () {}, {}, []);

            assertFalse(call.calledWithExactly({}));
        }
    });

    function spyCallCallSetup() {
        this.args = [];
        this.proxy = sinon.spy();
        this.call = sinon.spy.spyCall.create(this.proxy, {}, this.args);
    }

    testCase("SpyCallCallArgTest", {
        setUp: spyCallCallSetup,

        "should call argument at specified index": function () {
            var callback = sinon.spy();
            this.args.push(1, 2, callback);

            this.call.callArg(2);

            assert(callback.called);
        },

        "should throw if argument at specified index is not callable": function () {
            this.args.push(1);
            var call = this.call;

            assertException(function () {
                call.callArg(0);
            }, "TypeError");
        },

        "should throw if no index is specified": function () {
            var call = this.call;

            assertException(function () {
                call.callArg();
            }, "TypeError");
        },

        "should throw if index is not number": function () {
            var call = this.call;

            assertException(function () {
                call.callArg({});
            }, "TypeError");
        }

    });

    testCase("SpyCallCallArgWithTest", {
        setUp: spyCallCallSetup,

        "should call argument at specified index with provided args": function () {
            var object = {};
            var callback = sinon.spy();
            this.args.push(1, callback);

            this.call.callArgWith(1, object);

            assert(callback.calledWith(object));
        },

        "should call callback without args": function () {
            var callback = sinon.spy();
            this.args.push(1, callback);

            this.call.callArgWith(1);

            assert(callback.calledWith());
        },

        "should call callback wit multiple args": function () {
            var object = {};
            var array = [];
            var callback = sinon.spy();
            this.args.push(1, 2, callback);

            this.call.callArgWith(2, object, array);

            assert(callback.calledWith(object, array));
        },

        "should throw if no index is specified": function () {
            var call = this.call;

            assertException(function () {
                call.callArgWith();
            }, "TypeError");
        },

        "should throw if index is not number": function () {
            var call = this.call;

            assertException(function () {
                call.callArgWith({});
            }, "TypeError");
        }

    });

    testCase("SpyCallYieldTest", {
        setUp: spyCallCallSetup,

        "should invoke only argument as callback": function () {
            var callback = sinon.spy();
            this.args.push(callback);

            this.call.yield();

            assert(callback.calledOnce);
            assertEquals(0, callback.args[0].length);
        },

        "should throw understandable error if no callback is passed": function () {
            var call = this.call;

            try {
                call.yield();
                throw new Error();
            } catch (e) {
                assertEquals("spy cannot yield since no callback was passed.",
                             e.message);
            }
        },

        "should include stub name and actual arguments in error": function () {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;

            try {
                call.yield();
                throw new Error();
            } catch (e) {
                assertEquals("somethingAwesome cannot yield since no callback was passed. " +
                             "Received [23, 42]", e.message);
            }
        },

        "should invoke last argument as callback": function () {
            var spy = sinon.spy();
            this.args.push(24, {}, spy);

            this.call.yield();

            assert(spy.calledOnce);
            assertEquals(0, spy.args[0].length);
        },

        "should invoke first of two callbacks": function () {
            var spy = sinon.spy();
            var spy2 = sinon.spy();
            this.args.push(24, {}, spy, spy2);

            this.call.yield();

            assert(spy.calledOnce);
            assertFalse(spy2.called);
        },

        "should invoke callback with arguments": function () {
            var obj = { id: 42 };
            var spy = sinon.spy();
            this.args.push(spy);

            this.call.yield(obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
        },

        "should throw if callback throws": function () {
            this.args.push(function () {
                throw new Error("d'oh!")
            });
            var call = this.call;

            assertException(function () {
                call.yield();
            });
        }
    });

    testCase("SpyCallYieldToTest", {
        setUp: spyCallCallSetup,

        "should invoke only argument as callback": function () {
            var callback = sinon.spy();
            this.args.push({
                success: callback
            });

            this.call.yieldTo("success");

            assert(callback.calledOnce);
            assertEquals(0, callback.args[0].length);
        },

        "should throw understandable error if no callback is passed": function () {
            var call = this.call;

            try {
                call.yieldTo("success");
                throw new Error();
            } catch (e) {
                assertEquals("spy cannot yield to 'success' since no callback was passed.",
                             e.message);
            }
        },

        "should include stub name and actual arguments in error": function () {
            this.proxy.displayName = "somethingAwesome";
            this.args.push(23, 42);
            var call = this.call;

            try {
                call.yieldTo("success");
                throw new Error();
            } catch (e) {
                assertEquals("somethingAwesome cannot yield to 'success' since no callback was passed. " +
                             "Received [23, 42]", e.message);
            }
        },

        "should invoke property on last argument as callback": function () {
            var spy = sinon.spy();
            this.args.push(24, {}, { success: spy });

            this.call.yieldTo("success");

            assert(spy.calledOnce);
            assertEquals(0, spy.args[0].length);
        },

        "should invoke first of two possible callbacks": function () {
            var spy = sinon.spy();
            var spy2 = sinon.spy();
            this.args.push(24, {}, { error: spy }, { error: spy2 });

            this.call.yieldTo("error");

            assert(spy.calledOnce);
            assertFalse(spy2.called);
        },

        "should invoke callback with arguments": function () {
            var obj = { id: 42 };
            var spy = sinon.spy();
            this.args.push({ success: spy });

            this.call.yieldTo("success", obj, "Crazy");

            assert(spy.calledWith(obj, "Crazy"));
        },

        "should throw if callback throws": function () {
            this.args.push({
                success: function () {
                    throw new Error("d'oh!")
                }
            });
            var call = this.call;

            assertException(function () {
                call.yieldTo("success");
            });
        }
    });

    testCase("SpyCallToStringTest", {
        setUp: function () {
            this.format = sinon.format;
        },

        tearDown: function () {
            sinon.format = this.format;
        },

        "should include spy name": function () {
            var object = { doIt: sinon.spy() };
            object.doIt();

            assertEquals("doIt()", object.doIt.getCall(0).toString());
        },

        "should include single argument": function () {
            var object = { doIt: sinon.spy() };
            object.doIt(42);

            assertEquals("doIt(42)", object.doIt.getCall(0).toString());
        },

        "should include all arguments": function () {
            var object = { doIt: sinon.spy() };
            object.doIt(42, "Hey");

            assertEquals("doIt(42, Hey)", object.doIt.getCall(0).toString());
        },

        "should include explicit return value": function () {
            var object = { doIt: sinon.stub().returns(42) };
            object.doIt(42, "Hey");

            assertEquals("doIt(42, Hey) => 42", object.doIt.getCall(0).toString());
        },

        "should include empty string return value": function () {
            var object = { doIt: sinon.stub().returns("") };
            object.doIt(42, "Hey");

            assertEquals("doIt(42, Hey) => ", object.doIt.getCall(0).toString());
        },

        "should include exception": function () {
            var object = { doIt: sinon.stub().throws("TypeError") };

            try {
                object.doIt();
            } catch (e) {}

            assertEquals("doIt() !TypeError", object.doIt.getCall(0).toString());
        },

        "should include exception message if any": function () {
            var object = { doIt: sinon.stub().throws("TypeError", "Oh noes!") };

            try {
                object.doIt();
            } catch (e) {}

            assertEquals("doIt() !TypeError(Oh noes!)",
                         object.doIt.getCall(0).toString());
        },

        "should format arguments with sinon.format": function () {
            sinon.format = sinon.stub().returns("Forty-two");
            var object = { doIt: sinon.spy() };

            object.doIt(42);

            assertEquals("doIt(Forty-two)", object.doIt.getCall(0).toString());
            assert(sinon.format.calledWith(42));
        },

        "should format return value with sinon.format": function () {
            sinon.format = sinon.stub().returns("Forty-two");
            var object = { doIt: sinon.stub().returns(42) };

            object.doIt();

            assertEquals("doIt() => Forty-two", object.doIt.getCall(0).toString());
            assert(sinon.format.calledWith(42));
        }
    });

    testCase("SpyConstructorTest", {
        setUp: function () {
            this.CustomConstructor = function () {};
            this.customPrototype = this.CustomConstructor.prototype;
            this.StubConstructor = sinon.spy(this, "CustomConstructor");
        },

        "should create original object": function () {
            var myInstance = new this.CustomConstructor();

            assert(this.customPrototype.isPrototypeOf(myInstance));
        },

        "should not interfere with instanceof": function () {
            var myInstance = new this.CustomConstructor();

            assert(myInstance instanceof this.CustomConstructor);
        },

        "should record usage": function () {
            var myInstance = new this.CustomConstructor();

            assert(this.CustomConstructor.called);
        }
    });

    testCase("SpyFunctionTest", {
        "should throw if spying on non-existent property": function () {
            var myObj = {};

            assertException(function () {
                sinon.spy(myObj, "ouch");
            });

            assertUndefined(myObj.ouch);
        },

        "should have toString method": function () {
            var obj = { meth: function () {} };
            sinon.spy(obj, "meth");

            assertEquals("meth", obj.meth.toString());
        },

        "toString should say 'spy' when unable to infer name": function () {
            var spy = sinon.spy();

            assertEquals("spy", spy.toString());
        },

        "toString should report name of spied function": function () {
            function myTestFunc() {}
            var spy = sinon.spy(myTestFunc);

            assertEquals("myTestFunc", spy.toString());
        },

        "toString should prefer displayName property if available": function () {
            function myTestFunc() {}
            myTestFunc.displayName = "My custom method";
            var spy = sinon.spy(myTestFunc);

            assertEquals("My custom method", spy.toString());
        },

        "toString should prefer property name if possible": function () {
            var obj = {};
            obj.meth = sinon.spy();
            obj.meth();

            assertEquals("meth", obj.meth.toString());
        }
    });

    testCase("SpyResetTest", {
        "should reset spy state": function () {
            var spy = sinon.spy();
            spy();

            spy.reset();

            assert(!spy.called);
            assert(!spy.calledOnce);
            assertEquals(0, spy.args.length);
            assertEquals(0, spy.returnValues.length);
            assertEquals(0, spy.exceptions.length);
            assertEquals(0, spy.thisValues.length);
            assertNull(spy.firstCall);
            assertNull(spy.secondCall);
            assertNull(spy.thirdCall);
            assertNull(spy.lastCall);
        },

        "should reset call order state": function () {
            var spies = [sinon.spy(), sinon.spy()];
            spies[0]();
            spies[1]();

            spies[0].reset();

            assert(!spies[0].calledBefore(spies[1]));
        }
    });

    testCase("WithArgsTest", {
        "should define withArgs method": function () {
            var spy = sinon.spy();

            assertFunction(spy.withArgs);
        },

        "should record single call": function () {
            var spy = sinon.spy().withArgs(1);
            spy(1);

            assertEquals(1, spy.callCount);
        },

        "should record non-matching call on original spy": function () {
            var spy = sinon.spy();
            var argSpy = spy.withArgs(1);
            spy(1);
            spy(2);

            assertEquals(2, spy.callCount);
            assertEquals(1, argSpy.callCount);
        },

        "should record non-matching call with several arguments separately": function () {
            var spy = sinon.spy();
            var argSpy = spy.withArgs(1, "str", {});
            spy(1);
            spy(1, "str", {});

            assertEquals(2, spy.callCount);
            assertEquals(1, argSpy.callCount);
        },

        "should record for partial argument match": function () {
            var spy = sinon.spy();
            var argSpy = spy.withArgs(1, "str", {});
            spy(1);
            spy(1, "str", {});
            spy(1, "str", {}, []);

            assertEquals(3, spy.callCount);
            assertEquals(2, argSpy.callCount);
        },

        "should record filtered spy when original throws": function () {
            var spy = sinon.spy(function () {
                throw new Error("Oops");
            });

            var argSpy = spy.withArgs({}, []);

            assertException(function () {
                spy(1);
            });

            assertException(function () {
                spy({}, []);
            });

            assertEquals(2, spy.callCount);
            assertEquals(1, argSpy.callCount);
        },

        "should return existing override for arguments": function () {
            var spy = sinon.spy();
            var argSpy = spy.withArgs({}, []);
            var another = spy.withArgs({}, []);
            spy();
            spy({}, []);
            spy({}, [], 2);

            assertSame(argSpy, another);
            assertNotSame(spy, another);
            assertEquals(3, spy.callCount);
            assertEquals(2, spy.withArgs({}, []).callCount);
        },

        "should chain withArgs calls on original spy": function () {
            var spy = sinon.spy();
            var numArgSpy = spy.withArgs({}, []).withArgs(3);
            spy();
            spy({}, []);
            spy(3);

            assertEquals(3, spy.callCount);
            assertEquals(1, numArgSpy.callCount);
            assertEquals(1, spy.withArgs({}, []).callCount);
        },

        "should initialize filtered spy with callCount": function () {
            var spy = sinon.spy();
            spy("a");
            spy("b");
            spy("b");
            spy("c");
            spy("c");
            spy("c");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");
            var argSpy3 = spy.withArgs("c");

            assertEquals(1, argSpy1.callCount);
            assertEquals(2, argSpy2.callCount);
            assertEquals(3, argSpy3.callCount);
            assert(argSpy1.called);
            assert(argSpy2.called);
            assert(argSpy3.called);
            assert(argSpy1.calledOnce);
            assert(argSpy2.calledTwice);
            assert(argSpy3.calledThrice);
        },

        "should initialize filtered spy with first, second, third and last call": function () {
            var spy = sinon.spy();
            spy("a", 1);
            spy("b", 2);
            spy("b", 3);
            spy("b", 4);

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.firstCall.calledWithExactly("a", 1));
            assert(argSpy1.lastCall.calledWithExactly("a", 1));
            assert(argSpy2.firstCall.calledWithExactly("b", 2));
            assert(argSpy2.secondCall.calledWithExactly("b", 3));
            assert(argSpy2.thirdCall.calledWithExactly("b", 4));
            assert(argSpy2.lastCall.calledWithExactly("b", 4));
        },

        "should initialize filtered spy with arguments": function () {
            var spy = sinon.spy();
            spy("a");
            spy("b");
            spy("b", "c", "d");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).calledWithExactly("a"));
            assert(argSpy2.getCall(0).calledWithExactly("b"));
            assert(argSpy2.getCall(1).calledWithExactly("b", "c", "d"));
        },

        "should initialize filtered spy with thisValues": function () {
            var spy = sinon.spy();
            var thisValue1 = {};
            var thisValue2 = {};
            var thisValue3 = {};
            spy.call(thisValue1, "a");
            spy.call(thisValue2, "b");
            spy.call(thisValue3, "b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).calledOn(thisValue1));
            assert(argSpy2.getCall(0).calledOn(thisValue2));
            assert(argSpy2.getCall(1).calledOn(thisValue3));
        },

        "should initialize filtered spy with return values": function () {
            var spy = sinon.spy(function (value) { return value; });
            spy("a");
            spy("b");
            spy("b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).returned("a"));
            assert(argSpy2.getCall(0).returned("b"));
            assert(argSpy2.getCall(1).returned("b"));
        },

        "should initialize filtered spy with call order": function () {
            var spy = sinon.spy();
            spy("a");
            spy("b");
            spy("b");

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy2.getCall(0).calledAfter(argSpy1.getCall(0)));
            assert(argSpy2.getCall(1).calledAfter(argSpy1.getCall(0)));
        },

        "should initialize filtered spy with exceptions": function () {
            var spy = sinon.spy(function (x, y) {
                var error = new Error();
                error.name = y;
                throw error;
            });
            try {
                spy("a", "1");
            } catch (ignored) {}
            try {
                spy("b", "2");
            } catch (ignored) {}
            try {
                spy("b", "3");
            } catch (ignored) {}

            var argSpy1 = spy.withArgs("a");
            var argSpy2 = spy.withArgs("b");

            assert(argSpy1.getCall(0).threw("1"));
            assert(argSpy2.getCall(0).threw("2"));
            assert(argSpy2.getCall(1).threw("3"));
        }

    });
}());
