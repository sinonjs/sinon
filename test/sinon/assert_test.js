/*jslint onevar: false*/
/*globals testCase
          sinon
          fail
          failException
          assert
          assertString
          assertFunction
          assertObject
          assertFalse
          assertEquals
          assertNoException
          assertException
          assertCalled
          assertCalledOn
          assertCalledWith
          assertCalledWithExactly
          assertThrew
          assertCallCount*/
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

(function (global) {
    testCase("SinonAssertTest", {
        "should be object": function () {
            assertObject(sinon.assert);
        }
    });

    function stubSetUp() {
        this.stub = sinon.stub.create();
        sinon.stub(sinon.assert, "fail").throws();
        sinon.stub(sinon.assert, "pass");
    }

    function stubTearDown() {
        sinon.assert.fail.restore();
        sinon.assert.pass.restore();
    }

    testCase("SinonAssertFailTest", {
        setUp: function () {
            this.exceptionName = sinon.assert.failException;
        },

        tearDown: function () {
            sinon.assert.failException = this.exceptionName;
        },

        "should throw exception": function () {
            var failed = false;
            var exception;

            try {
                sinon.assert.fail("Some message");
                failed = true;
            } catch (e) {
                exception = e;
            }

            assertFalse(failed);
            assertEquals("AssertError", exception.name);
        },

        "should throw configured exception type": function () {
            sinon.assert.failException = "RetardError";

            assertException(function () {
                sinon.assert.fail("Some message");
            }, "RetardError");
        }
    });

    testCase("SinonAssertCalledTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should be function": function () {
            assertFunction(sinon.assert.called);
        },

        "should fail when method does not exist": function () {
            assertException(function () {
                sinon.assert.called();
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method is not stub": function () {
            assertException(function () {
                sinon.assert.called(function () {});
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method was not called": function () {
            var stub = this.stub;

            assertException(function () {
                sinon.assert.called(stub);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when method was called": function () {
            var stub = this.stub;
            stub();

            assertNoException(function () {
                sinon.assert.called(stub);
            });

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var stub = this.stub;
            stub();

            assertNoException(function () {
                sinon.assert.called(stub);
            });

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("called"));
        }
    });

    testCase("SinonAssertNotCalledTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should be function": function () {
            assertFunction(sinon.assert.notCalled);
        },

        "should fail when method does not exist": function () {
            assertException(function () {
                sinon.assert.notCalled();
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method is not stub": function () {
            assertException(function () {
                sinon.assert.notCalled(function () {});
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method was called": function () {
            var stub = this.stub;
            stub();

            assertException(function () {
                sinon.assert.notCalled(stub);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when method was not called": function () {
            var stub = this.stub;

            assertNoException(function () {
                sinon.assert.notCalled(stub);
            });

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var stub = this.stub;
            sinon.assert.notCalled(stub);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("notCalled"));
        }
    });

    testCase("SinonAssertCalledOnceTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should be function": function () {
            assertFunction(sinon.assert.calledOnce);
        },

        "should fail when method does not exist": function () {
            assertException(function () {
                sinon.assert.calledOnce();
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method is not stub": function () {
            assertException(function () {
                sinon.assert.calledOnce(function () {});
            });

            assert(sinon.assert.fail.called);
        },

        "should fail when method was not called": function () {
            var stub = this.stub;

            assertException(function () {
                sinon.assert.calledOnce(stub);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when method was called": function () {
            var stub = this.stub;
            stub();

            assertNoException(function () {
                sinon.assert.calledOnce(stub);
            });

            assertFalse(sinon.assert.fail.called);
        },

        "should fail when method was called more than once": function () {
            var stub = this.stub;
            stub();
            stub();

            assertException(function () {
                sinon.assert.calledOnce(stub);
            });

            assert(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var stub = this.stub;
            stub();
            sinon.assert.calledOnce(stub);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledOnce"));
        }
    });

    testCase("SinonAssertCalledTwiceTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail if called once": function () {
            var stub = this.stub;
            this.stub();

            assertException(function () {
                sinon.assert.calledTwice(stub);
            });
        },

        "should not fail if called twice": function () {
            var stub = this.stub;
            this.stub();
            this.stub();

            assertNoException(function () {
                sinon.assert.calledTwice(stub);
            });
        },

        "should call pass callback": function () {
            var stub = this.stub;
            stub();
            stub();
            sinon.assert.calledTwice(stub);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledTwice"));
        }
    });

    testCase("SinonAssertCalledThriceTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail if called once": function () {
            var stub = this.stub;
            this.stub();

            assertException(function () {
                sinon.assert.calledThrice(stub);
            });
        },

        "should not fail if called thrice": function () {
            var stub = this.stub;
            this.stub();
            this.stub();
            this.stub();

            assertNoException(function () {
                sinon.assert.calledThrice(stub);
            });
        },

        "should call pass callback": function () {
            var stub = this.stub;
            stub();
            stub();
            stub();
            sinon.assert.calledThrice(stub);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledThrice"));
        }
    });

    testCase("SinonAssertCallOrderTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should be function": function () {
            assertFunction(sinon.assert.callOrder);
        },

        "should not fail when calls where done in right order": function () {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            spy1();
            spy2();

            assertNoException(function () {
                sinon.assert.callOrder(spy1, spy2);
            });
        },

        "should fail when calls where done in wrong order": function () {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            spy2();
            spy1();

            assertException(function () {
                sinon.assert.callOrder(spy1, spy2);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when many calls where done in right order": function () {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var spy4 = sinon.spy();
            spy1();
            spy2();
            spy3();
            spy4();

            assertNoException(function () {
                sinon.assert.callOrder(spy1, spy2, spy3, spy4);
            });
        },

        "should fail when one of many calls where done in wrong order": function () {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var spy4 = sinon.spy();
            spy1();
            spy2();
            spy4();
            spy3();

            assertException(function () {
                sinon.assert.callOrder(spy1, spy2, spy3, spy4);
            });

            assert(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var stubs = [sinon.spy(), sinon.spy()];
            stubs[0]();
            stubs[1]();
            sinon.assert.callOrder(stubs[0], stubs[1]);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("callOrder"));
        },

        "should pass for multiple calls to same spy": function () {
            var first = sinon.spy();
            var second = sinon.spy();

            first();
            second();
            first();

            sinon.assert.callOrder(first, second, first);
        }
    });

    testCase("SinonAssertCalledOnTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should be function": function () {
            assertFunction(sinon.assert.calledOn);
        },

        "should fail when method does not exist": function () {
            var object = {};
            sinon.stub(this.stub, "calledOn");

            assertException(function () {
                sinon.assert.calledOn(null, object);
            });

            assertFalse(this.stub.calledOn.calledWith(object));
            assert(sinon.assert.fail.called);
        },

        "should fail when method is not stub": function () {
            var object = {};
            sinon.stub(this.stub, "calledOn");

            assertException(function () {
                sinon.assert.calledOn(function () {}, object);
            });

            assertFalse(this.stub.calledOn.calledWith(object));
            assert(sinon.assert.fail.called);
        },

        "should fail when method fails": function () {
            var object = {};
            sinon.stub(this.stub, "calledOn").returns(false);
            var stub = this.stub;

            assertException(function () {
                sinon.assert.calledOn(stub, object);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            var object = {};
            sinon.stub(this.stub, "calledOn").returns(true);
            var stub = this.stub;

            sinon.assert.calledOn(stub, object);

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var obj = {};
            this.stub.call(obj);
            sinon.assert.calledOn(this.stub, obj);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledOn"));
        }
    });

    testCase("SinonAssertCalledWithTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail when method fails": function () {
            var object = {};
            sinon.stub(this.stub, "calledWith").returns(false);
            var stub = this.stub;

            assertException(function () {
                sinon.assert.calledWith(stub, object, 1);
            });

            assert(this.stub.calledWith.calledWith(object, 1));
            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            var object = {};
            sinon.stub(this.stub, "calledWith").returns(true);
            var stub = this.stub;

            assertNoException(function () {
                sinon.assert.calledWith(stub, object, 1);
            });

            assert(this.stub.calledWith.calledWith(object, 1));
            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            this.stub("yeah");
            sinon.assert.calledWith(this.stub, "yeah");

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledWith"));
        }
    });

    testCase("SinonAssertCalledWithExactlyTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail when method fails": function () {
            var object = {};
            sinon.stub(this.stub, "calledWithExactly").returns(false);
            var stub = this.stub;

            assertException(function () {
                sinon.assert.calledWithExactly(stub, object, 1);
            });

            assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            var object = {};
            sinon.stub(this.stub, "calledWithExactly").returns(true);
            var stub = this.stub;

            assertNoException(function () {
                sinon.assert.calledWithExactly(stub, object, 1);
            });

            assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            this.stub("yeah");
            sinon.assert.calledWithExactly(this.stub, "yeah");

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("calledWithExactly"));
        }
    });

    testCase("SinonAssertNeverCalledWithTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail when method fails": function () {
            var object = {};
            sinon.stub(this.stub, "neverCalledWith").returns(false);
            var stub = this.stub;

            assertException(function () {
                sinon.assert.neverCalledWith(stub, object, 1);
            });

            assert(this.stub.neverCalledWith.calledWith(object, 1));
            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            var object = {};
            sinon.stub(this.stub, "neverCalledWith").returns(true);
            var stub = this.stub;

            assertNoException(function () {
                sinon.assert.neverCalledWith(stub, object, 1);
            });

            assert(this.stub.neverCalledWith.calledWith(object, 1));
            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            this.stub("yeah");
            sinon.assert.neverCalledWith(this.stub, "nah!");

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("neverCalledWith"));
        }
    });

    testCase("SinonAssertThrewTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail when method fails": function () {
            sinon.stub(this.stub, "threw").returns(false);
            var stub = this.stub;

            assertException(function () {
                sinon.assert.threw(stub, 1, 2);
            });

            assert(this.stub.threw.calledWithExactly(1, 2));
            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            sinon.stub(this.stub, "threw").returns(true);
            var stub = this.stub;

            assertNoException(function () {
                sinon.assert.threw(stub, 1, 2);
            });

            assert(this.stub.threw.calledWithExactly(1, 2));
            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            sinon.stub(this.stub, "threw").returns(true);
            this.stub();
            sinon.assert.threw(this.stub);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("threw"));
        }
    });

    testCase("SinonAssertCallCountTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail when method fails": function () {
            this.stub();
            this.stub();
            var stub = this.stub;

            assertException(function () {
                sinon.assert.callCount(stub, 3);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail when method doesn't fail": function () {
            var stub = this.stub;
            this.stub.callCount = 3;

            assertNoException(function () {
                sinon.assert.callCount(stub, 3);
            });

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            this.stub();
            sinon.assert.callCount(this.stub, 1);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("callCount"));
        }
    });

    testCase("AssertAlwaysCalledOnTest", {
        setUp: stubSetUp,
        tearDown: stubTearDown,

        "should fail if method is missing": function () {
            assertException(function () {
                sinon.assert.alwaysCalledOn();
            });
        },

        "should fail if method is not fake": function () {
            assertException(function () {
                sinon.assert.alwaysCalledOn(function () {}, {});
            });
        },

        "should fail if stub returns false": function () {
            var stub = sinon.stub();
            sinon.stub(stub, "alwaysCalledOn").returns(false);

            assertException(function () {
                sinon.assert.alwaysCalledOn(stub, {});
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail if stub returns true": function () {
            var stub = sinon.stub.create();
            sinon.stub(stub, "alwaysCalledOn").returns(true);

            sinon.assert.alwaysCalledOn(stub, {});

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            this.stub();
            sinon.assert.alwaysCalledOn(this.stub, this);

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("alwaysCalledOn"));
        }
    });

    testCase("AssertAlwaysCalledWithTest", {
        setUp: function () {
            sinon.stub(sinon.assert, "fail").throws();
            sinon.stub(sinon.assert, "pass");
        },

        tearDown: function () {
            sinon.assert.fail.restore();
            sinon.assert.pass.restore();
        },

        "should fail if method is missing": function () {
            assertException(function () {
                sinon.assert.alwaysCalledWith();
            });
        },

        "should fail if method is not fake": function () {
            assertException(function () {
                sinon.assert.alwaysCalledWith(function () {});
            });
        },

        "should fail if stub returns false": function () {
            var stub = sinon.stub.create();
            sinon.stub(stub, "alwaysCalledWith").returns(false);

            assertException(function () {
                sinon.assert.alwaysCalledWith(stub, {}, []);
            });

            assert(sinon.assert.fail.called);
        },

        "should not fail if stub returns true": function () {
            var stub = sinon.stub.create();
            sinon.stub(stub, "alwaysCalledWith").returns(true);

            sinon.assert.alwaysCalledWith(stub, {}, []);

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var spy = sinon.spy();
            spy("Hello");
            sinon.assert.alwaysCalledWith(spy, "Hello");

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("alwaysCalledWith"));
        }
    });

    testCase("AssertAlwaysCalledWithExactlyTest", {
        setUp: function () {
            sinon.stub(sinon.assert, "fail");
            sinon.stub(sinon.assert, "pass");
        },

        tearDown: function () {
            sinon.assert.fail.restore();
            sinon.assert.pass.restore();
        },

        "should fail if stub returns false": function () {
            var stub = sinon.stub.create();
            sinon.stub(stub, "alwaysCalledWithExactly").returns(false);

            sinon.assert.alwaysCalledWithExactly(stub, {}, []);

            assert(sinon.assert.fail.called);
        },

        "should not fail if stub returns true": function () {
            var stub = sinon.stub.create();
            sinon.stub(stub, "alwaysCalledWithExactly").returns(true);

            sinon.assert.alwaysCalledWithExactly(stub, {}, []);

            assertFalse(sinon.assert.fail.called);
        },

        "should call pass callback": function () {
            var spy = sinon.spy();
            spy("Hello");
            sinon.assert.alwaysCalledWithExactly(spy, "Hello");

            assert(sinon.assert.pass.calledOnce);
            assert(sinon.assert.pass.calledWith("alwaysCalledWithExactly"));
        }
    });

    testCase("SinonAssertExposeTest", {
        "should expose asserts into object": function () {
            var test = {};
            sinon.assert.expose(test);

            assertFunction(test.fail);
            assertString(test.failException);
            assertFunction(test.assertCalled);
            assertFunction(test.assertCalledOn);
            assertFunction(test.assertCalledWith);
            assertFunction(test.assertCalledWithExactly);
            assertFunction(test.assertThrew);
            assertFunction(test.assertCallCount);
        },

        "should expose asserts into global": function () {
            sinon.assert.expose(global, {
                includeFail: false
            });

            assertEquals("undefined", typeof failException);
            assertFunction(assertCalled);
            assertFunction(assertCalledOn);
            assertFunction(assertCalledWith);
            assertFunction(assertCalledWithExactly);
            assertFunction(assertThrew);
            assertFunction(assertCallCount);
        },

        "should fail exposed asserts without errors": function () {
            sinon.assert.expose(global, {
                includeFail: false
            });

            try {
                assertCalled(sinon.spy());
            } catch (e) {
                assertEquals("expected spy to have been called at least once but was never called", e.message);
            }
        },

        "should expose asserts into object without prefixes": function () {
            var test = {};

            sinon.assert.expose(test, {
                prefix: ""
            });

            assertFunction(test.fail);
            assertString(test.failException);
            assertFunction(test.called);
            assertFunction(test.calledOn);
            assertFunction(test.calledWith);
            assertFunction(test.calledWithExactly);
            assertFunction(test.threw);
            assertFunction(test.callCount);
        },

        "should throw if target is undefined": function () {
            assertException(function () {
                sinon.assert.expose();
            }, "TypeError");
        },

        "should throw if target is null": function () {
            assertException(function () {
                sinon.assert.expose(null);
            }, "TypeError");
        }
    });

    testCase("AssertionMessageTest", {
        setUp: function () {
            this.obj = {
                doSomething: function () {}
            };

            sinon.spy(this.obj, "doSomething");

            this.message = function (method) {
                try {
                    sinon.assert[method].apply(sinon.assert, [].slice.call(arguments, 1));
                } catch (e) {
                    return e.message;
                }
            };
        },

        "assert.called exception message": function () {
            assertEquals("expected doSomething to have been called at " +
                         "least once but was never called",
                         this.message("called", this.obj.doSomething));
        },

        "assert.notCalled exception message one call": function () {
            this.obj.doSomething();

            assertEquals("expected doSomething to not have been called " +
                         "but was called once\n    doSomething()",
                         this.message("notCalled", this.obj.doSomething));
        },

        "assert.notCalled exception message four calls": function () {
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();

            assertEquals("expected doSomething to not have been called " +
                         "but was called 4 times\n    doSomething()\n    " +
                         "doSomething()\n    doSomething()\n    doSomething()",
                         this.message("notCalled", this.obj.doSomething));
        },

        "assert.notCalled exception message with calls with arguments": function () {
            this.obj.doSomething();
            this.obj.doSomething(3);
            this.obj.doSomething(42, 1);
            this.obj.doSomething();

            assertEquals("expected doSomething to not have been called " +
                         "but was called 4 times\n    doSomething()\n    " +
                         "doSomething(3)\n    doSomething(42, 1)\n    doSomething()",
                         this.message("notCalled", this.obj.doSomething));
        },

        "assert.callOrder exception message": function () {
            var obj = { doop: function () {}, foo: function () {} };
            sinon.spy(obj, "doop");
            sinon.spy(obj, "foo");

            obj.doop();
            this.obj.doSomething();
            obj.foo();

            assertEquals("expected doSomething, doop, foo to be called in " +
                         "order but were called as doop, doSomething, foo",
                         this.message("callOrder", this.obj.doSomething, obj.doop, obj.foo));
        },

        "assert.callCount exception message": function () {
            this.obj.doSomething();

            assertEquals("expected doSomething to be called thrice but was called " +
                         "once\n    doSomething()",
                         this.message("callCount", this.obj.doSomething, 3));
        },

        "assert.calledOnce exception message": function () {
            this.obj.doSomething();
            this.obj.doSomething();

            assertEquals("expected doSomething to be called once but was called " +
                         "twice\n    doSomething()\n    doSomething()",
                         this.message("calledOnce", this.obj.doSomething));

            this.obj.doSomething();

            assertEquals("expected doSomething to be called once but was called " +
                         "thrice\n    doSomething()\n    doSomething()\n    doSomething()",
                         this.message("calledOnce", this.obj.doSomething));
        },

        "assert.calledTwice exception message": function () {
            this.obj.doSomething();

            assertEquals("expected doSomething to be called twice but was called " +
                         "once\n    doSomething()",
                         this.message("calledTwice", this.obj.doSomething));
        },

        "assert.calledThrice exception message": function () {
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();
            this.obj.doSomething();

            assertEquals("expected doSomething to be called thrice but was called 4 times\n    doSomething()\n    doSomething()\n    doSomething()\n    doSomething()",
                         this.message("calledThrice", this.obj.doSomething));
        },

        "assert.calledOn exception message": function () {
            this.obj.toString = function () {
                return "[Oh yeah]";
            };

            var obj = { toString: function () { return "[Oh no]"; } };
            var obj2 = { toString: function () { return "[Oh well]"; } };

            this.obj.doSomething.call(obj);
            this.obj.doSomething.call(obj2);

            assertEquals("expected doSomething to be called with [Oh yeah] as this but was called with [Oh no], [Oh well]",
                         this.message("calledOn", this.obj.doSomething, this.obj));
        },

        "assert.alwaysCalledOn exception message": function () {
            this.obj.toString = function () {
                return "[Oh yeah]";
            };

            var obj = { toString: function () { return "[Oh no]"; } };
            var obj2 = { toString: function () { return "[Oh well]"; } };

            this.obj.doSomething.call(obj);
            this.obj.doSomething.call(obj2);
            this.obj.doSomething();

            assertEquals("expected doSomething to always be called with [Oh yeah] as this but was called with [Oh no], [Oh well], [Oh yeah]",
                         this.message("alwaysCalledOn", this.obj.doSomething, this.obj));
        },

        "assert.calledWith exception message": function () {
            this.obj.doSomething(1, 3, "hey");

            assertEquals("expected doSomething to be called with arguments 4, 3, " +
                         "hey\n    doSomething(1, 3, hey)",
                         this.message("calledWith", this.obj.doSomething, 4, 3, "hey"));
        },

        "assert.alwaysCalledWith exception message": function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, "hey");

            assertEquals("expected doSomething to always be called with arguments 1" +
                         ", hey\n    doSomething(1, 3, hey)\n    doSomething(1, hey)",
                         this.message("alwaysCalledWith", this.obj.doSomething, 1, "hey"));
        },

        "assert.calledWithExactly exception message": function () {
            this.obj.doSomething(1, 3, "hey");

            assertEquals("expected doSomething to be called with exact arguments 1" +
                         ", 3\n    doSomething(1, 3, hey)",
                         this.message("calledWithExactly", this.obj.doSomething, 1, 3));
        },

        "assert.alwaysCalledWithExactly exception message": function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assertEquals("expected doSomething to always be called with exact " +
                         "arguments 1, 3\n    doSomething(1, 3, hey)\n    " +
                         "doSomething(1, 3)",
                         this.message("alwaysCalledWithExactly",
                                      this.obj.doSomething, 1, 3));
        },

        "assert.neverCalledWith exception message": function () {
            this.obj.doSomething(1, 2, 3);

            assertEquals("expected doSomething to never be called with " +
                         "arguments 1, 2\n    doSomething(1, 2, 3)",
                         this.message("neverCalledWith",
                                      this.obj.doSomething, 1, 2));
        },

        "assert.threw exception message": function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assertEquals("doSomething did not throw exception\n" +
                         "    doSomething(1, 3, hey)\n    doSomething(1, 3)",
                         this.message("threw", this.obj.doSomething));
        },

        "assert.alwaysThrew exception message": function () {
            this.obj.doSomething(1, 3, "hey");
            this.obj.doSomething(1, 3);

            assertEquals("doSomething did not always throw exception\n" +
                         "    doSomething(1, 3, hey)\n    doSomething(1, 3)",
                         this.message("alwaysThrew", this.obj.doSomething));
        }
    });
}(typeof global == "object" ? global : this));
