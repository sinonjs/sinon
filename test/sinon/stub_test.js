/*jslint onevar: false*/
/*globals testCase
          sinon
          fail
          assert
          assertUndefined
          assertBoolean
          assertFalse
          assertFunction
          assertSame
          assertNotSame
          assertEquals
          assertException*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

(function () {
    testCase("StubCreateTest", {
        "should return function": function () {
            assertFunction(sinon.stub.create());
        },

        "should be spy": function () {
            var stub = sinon.stub.create();

            assertBoolean(stub.called);
            assertFunction(stub.calledWith);
            assertFunction(stub.calledWith);
            assertFunction(stub.calledOn);
        }
    });

    testCase("StubReturnsTest", {
        "should have returns method": function () {
            var stub = sinon.stub.create();

            assertFunction(stub.returns);
        },

        "should return specified value": function () {
            var stub = sinon.stub.create();
            var object = {};
            stub.returns(object);

            assertSame(object, stub());
        },

        "returns should return stub": function () {
            var stub = sinon.stub.create();

            assertSame(stub, stub.returns(""));
        },

        "should return undefined": function () {
            var stub = sinon.stub.create();

            assertUndefined(stub());
        }
    });

    testCase("StubThrowsTest", {
        "should throw specified exception": function () {
            var stub = sinon.stub.create();
            var error = new Error();
            stub.throws(error);

            try {
                stub();
                fail("Expected stub to throw");
            } catch (e) {
                assertSame(error, e);
            }
        },

        "should return stub": function () {
            var stub = sinon.stub.create();

            assertSame(stub, stub.throws({}));
        },

        "should set type of exception to throw": function () {
            var stub = sinon.stub.create();
            var exceptionType = "TypeError";
            stub.throws(exceptionType);

            assertException(function () {
                stub();
            }, exceptionType);
        },

        "should specify exception message": function () {
            var stub = sinon.stub.create();
            var message = "Oh no!";
            stub.throws("Error", message);

            try {
                stub();
                fail("Expected stub to throw");
            } catch (e) {
                assertEquals(message, e.message);
            }
        },

        "should not specify exception message if not provided": function () {
            var stub = sinon.stub.create();
            stub.throws("Error");

            try {
                stub();
                fail("Expected stub to throw");
            } catch (e) {
                assertEquals("", e.message);
            }
        },

        "should throw generic error": function () {
            var stub = sinon.stub.create();
            stub.throws();

            assertException(function () {
                stub();
            }, "Error");
        }
    });

    testCase("StubCallsArgTest", {
        setUp: function () {
            this.stub = sinon.stub.create();
        },

        "should call argument at specified index": function () {
            this.stub.callsArg(2);
            var callback = sinon.stub.create();

            this.stub(1, 2, callback);

            assert(callback.called);
        },

        "should return stub": function () {
            var stub = this.stub.callsArg(2);

            assertFunction(stub);
        },

        "should throw if argument at specified index is not callable": function () {
            this.stub.callsArg(0);

            assertException(function () {
                this.stub(1);
            }, "TypeError");
        },

        "should throw if no index is specified": function () {
            var stub = this.stub;

            assertException(function () {
                stub.callsArg();
            }, "TypeError");
        },

        "should throw if index is not number": function () {
            var stub = this.stub;

            assertException(function () {
                stub.callsArg({});
            }, "TypeError");
        }
    });

    testCase("StubCallsArgWithTest", {
        setUp: function () {
            this.stub = sinon.stub.create();
        },

        "should call argument at specified index with provided args": function () {
            var object = {};
            this.stub.callsArgWith(1, object);
            var callback = sinon.stub.create();

            this.stub(1, callback);

            assert(callback.calledWith(object));
        },

        "should return function": function () {
            var stub = this.stub.callsArgWith(2, 3);

            assertFunction(stub);
        },

        "should call callback without args": function () {
            this.stub.callsArgWith(1);
            var callback = sinon.stub.create();

            this.stub(1, callback);

            assert(callback.calledWith());
        },

        "should call callback wit multiple args": function () {
            var object = {};
            var array = [];
            this.stub.callsArgWith(1, object, array);
            var callback = sinon.stub.create();

            this.stub(1, callback);

            assert(callback.calledWith(object, array));
        },

        "should throw if no index is specified": function () {
            var stub = this.stub;

            assertException(function () {
                stub.callsArgWith();
            }, "TypeError");
        },

        "should throw if index is not number": function () {
            var stub = this.stub;

            assertException(function () {
                stub.callsArgWith({});
            }, "TypeError");
        }
    });

    testCase("StubObjectMethodTest", {
        setUp: function () {
            this.method = function () {};
            this.object = { method: this.method };
            this.wrapMethod = sinon.wrapMethod;
        },

        tearDown: function () {
            sinon.wrapMethod = this.wrapMethod;
        },

        "should be function": function () {
            assertFunction(sinon.stub);
        },

        "should return function from wrapMethod": function () {
            var wrapper = function () {};
            sinon.wrapMethod = function () {
                return wrapper;
            };

            var result = sinon.stub(this.object, "method");

            assertSame(wrapper, result);
        },

        "should pass object and method to wrapMethod": function () {
            var wrapper = function () {};
            var args;

            sinon.wrapMethod = function () {
                args = arguments;
                return wrapper;
            };

            var result = sinon.stub(this.object, "method");

            assertSame(this.object, args[0]);
            assertSame("method", args[1]);
        },

        "should use provided function as stub": function () {
            var called = false;
            var stub = sinon.stub(this.object, "method", function () {
                called = true;
            });

            stub();

            assert(called);
        },

        "should wrap provided function": function () {
            var customStub = function () {};
            var stub = sinon.stub(this.object, "method", customStub);

            assertNotSame(customStub, stub);
            assertFunction(stub.restore);
        },

        "should throw if third argument is provided but not function": function () {
            var object = this.object;

            assertException(function () {
                sinon.stub(object, "method", {});
            }, "TypeError");
        },

        "stubbed method should be proper stub": function () {
            var stub = sinon.stub(this.object, "method");

            assertFunction(stub.returns);
            assertFunction(stub.throws);
        },

        "custom stubbed method should not be proper stub": function () {
            var stub = sinon.stub(this.object, "method", function () {});

            assertUndefined(stub.returns);
            assertUndefined(stub.throws);
        },

        "stub should be spy": function () {
            var stub = sinon.stub(this.object, "method");
            this.object.method();

            assert(stub.called);
            assert(stub.calledOn(this.object));
        },

        "custom stubbed method should be spy": function () {
            var stub = sinon.stub(this.object, "method", function () {});
            this.object.method();

            assert(stub.called);
            assert(stub.calledOn(this.object));
        },

        "stub should affect spy": function () {
            var stub = sinon.stub(this.object, "method");
            var someObj = {};
            stub.throws("TypeError");

            try {
                this.object.method();
            } catch (e) {}

            assert(stub.threw("TypeError"));
        },

        "should return standalone stub without arguments": function () {
            var stub = sinon.stub();

            assertFunction(stub);
            assertFalse(stub.called);
        },

        "should throw if property is not a function": function () {
            var obj = { someProp: 42 };

            assertException(function () {
                sinon.stub(obj, "someProp");
            });

            assertEquals(42, obj.someProp);
        },

        "should not stub function object": function () {
            assertException(function () {
                sinon.stub(function () {});
            });
        }
    });

    testCase("StubEverythingTest", {
        "should stub all methods of object without property": function () {
            var obj = {
                func1: function () {},
                func2: function () {},
                func3: function () {}
            };

            var stub = sinon.stub(obj);

            assertFunction(obj.func1.restore);
            assertFunction(obj.func2.restore);
            assertFunction(obj.func3.restore);
        },

        "should return object": function () {
            var object = {};

            assertSame(object, sinon.stub(object));
        },

        "should not stub inherited methods": function () {
            var getName = function () {};
            var person = { getName: getName };
            var dude = sinon.create(person);

            sinon.stub(dude);

            assertUndefined(dude.toString.restore);
            assertUndefined(dude.valueOf.restore);
            assertSame(getName, dude.getName);
        }
    });

    testCase("StubFunctionTest", {
        "should throw if stubbing non-existent property": function () {
            var myObj = {};

            assertException(function () {
                sinon.stub(myObj, "ouch");
            });

            assertUndefined(myObj.ouch);
        },

        "should have toString method": function () {
            var obj = { meth: function () {} };
            sinon.stub(obj, "meth");

            assertEquals("meth", obj.meth.toString());
        },

        "toString should say 'stub' when unable to infer name": function () {
            var stub = sinon.stub();

            assertEquals("stub", stub.toString());
        },

        "toString should prefer property name if possible": function () {
            var obj = {};
            obj.meth = sinon.stub();
            obj.meth();

            assertEquals("meth", obj.meth.toString());
        }
    });

    testCase("StubYieldsTest", {
        "should invoke only argument as callback": function () {
            var stub = sinon.stub().yields();
            var spy = sinon.spy();
            stub(spy);

            assert(spy.calledOnce);
            assertEquals(0, spy.args[0].length);
        },

        "should throw understandable error if no callback is passed": function () {
            var stub = sinon.stub().yields();
            var spy = sinon.spy();

            try {
                stub();
                throw new Error();
            } catch (e) {
                assertEquals("stub expected to yield, but no callback was passed.",
                             e.message);
            }
        },

        "should include stub name and actual arguments in error": function () {
            var myObj = { somethingAwesome: function () {} };
            var stub = sinon.stub(myObj, "somethingAwesome").yields();
            var spy = sinon.spy();

            try {
                stub(23, 42);
                throw new Error();
            } catch (e) {
                assertEquals("somethingAwesome expected to yield, but no callback " +
                             "was passed. Received [23, 42]", e.message);
            }
        },

        "should invoke last argument as callback": function () {
            var stub = sinon.stub().yields();
            var spy = sinon.spy();
            stub(24, {}, spy);

            assert(spy.calledOnce);
            assertEquals(0, spy.args[0].length);
        },

        "should invoke first of two callbacks": function () {
            var stub = sinon.stub().yields();
            var spy = sinon.spy();
            var spy2 = sinon.spy();
            stub(24, {}, spy, spy2);

            assert(spy.calledOnce);
            assert(!spy2.called);
        },

        "should invoke callback with arguments": function () {
            var obj = { id: 42 };
            var stub = sinon.stub().yields(obj, "Crazy");
            var spy = sinon.spy();
            stub(spy);

            assert(spy.calledWith(obj, "Crazy"));
        },

        "should throw if callback throws": function () {
            var obj = { id: 42 };
            var stub = sinon.stub().yields(obj, "Crazy");
            var callback = sinon.stub().throws();

            assertException(function () {
                stub(spy);
            });
        }
    });

    // yieldsTo burde kunne kalles flere ganger?
    testCase("StubYieldsToTest", {
        "should yield to property of object argument": function () {
            var stub = sinon.stub().yieldsTo("success");
            var callback = sinon.spy();

            stub({ success: callback });

            assert(callback.calledOnce);
            assertEquals(0, callback.args[0].length);
        },

        "should throw understandable error if no object with callback is passed": function () {
            var stub = sinon.stub().yieldsTo("success");

            try {
                stub();
                throw new Error();
            } catch (e) {
                assertEquals("stub expected to yield to 'success', but no object "+
                             "with such a property was passed.",
                             e.message);
            }
        },

        "should include stub name and actual arguments in error": function () {
            var myObj = { somethingAwesome: function () {} };
            var stub = sinon.stub(myObj, "somethingAwesome").yieldsTo("success");

            try {
                stub(23, 42);
                throw new Error();
            } catch (e) {
                assertEquals("somethingAwesome expected to yield to 'success', but " +
                             "no object with such a property was passed. " +
                             "Received [23, 42]", e.message);
            }
        },

        "should invoke property on last argument as callback": function () {
            var stub = sinon.stub().yieldsTo("success");
            var callback = sinon.spy();
            stub(24, {}, { success: callback });

            assert(callback.calledOnce);
            assertEquals(0, callback.args[0].length);
        },

        "should invoke first of two possible callbacks": function () {
            var stub = sinon.stub().yieldsTo("error");
            var callback = sinon.spy();
            var callback2 = sinon.spy();
            stub(24, {}, { error: callback }, { error: callback2 });

            assert(callback.calledOnce);
            assert(!callback2.called);
        },

        "should invoke callback with arguments": function () {
            var obj = { id: 42 };
            var stub = sinon.stub().yieldsTo("success", obj, "Crazy");
            var callback = sinon.spy();
            stub({ success: callback });

            assert(callback.calledWith(obj, "Crazy"));
        },

        "should throw if callback throws": function () {
            var obj = { id: 42 };
            var stub = sinon.stub().yieldsTo("error", obj, "Crazy");
            var callback = sinon.stub().throws();

            assertException(function () {
                stub({ error: callback });
            });
        }
    });

    testCase("StubWithArgsTest", {
        "should define withArgs method": function () {
            var stub = sinon.stub();

            assertFunction(stub.withArgs);
        },

        "should create filtered stub": function () {
            var stub = sinon.stub();
            var other = stub.withArgs(23);

            assertNotSame(stub, other);
            assertFunction(stub.returns);
            assertFunction(other.returns);
        },

        "should filter return values based on arguments": function () {
            var stub = sinon.stub().returns(23);
            stub.withArgs(42).returns(99);

            assertEquals(23, stub());
            assertEquals(99, stub(42));
        },

        "should filter exceptions based on arguments": function () {
            var stub = sinon.stub().returns(23);
            stub.withArgs(42).throws();

            assertNoException(function () {
                stub();
            });

            assertException(function () {
                stub(42);
            });
        }
    });
}());
