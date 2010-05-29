/*jslint indent: 2, onevar: false*/
/*globals testCase,
          sinon,
          fail,
          failException,
          assert,
          assertString,
          assertFunction,
          assertObject,
          assertFalse,
          assertEquals,
          assertNoException,
          assertException,
          assertCalled,
          assertCalledOn,
          assertCalledWith,
          assertCalledWithExactly,
          assertThrew,
          assertCallCount*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function (global) {
  testCase("SinonAssertTest", {
    "should be object": function () {
      assertObject(sinon.assert);
    }
  });

  function stubSetUp() {
    this.stub = sinon.stub.create();
    sinon.stub(sinon.assert, "fail").throws();
  }

  function stubTearDown() {
    sinon.assert.fail.restore();
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
    }
  });

  testCase("SinonAssertCallCountTest", {
    setUp: stubSetUp,
    tearDown: stubTearDown,

    "should fail when method fails": function () {
      sinon.stub(this.stub, "callCount").returns(2);
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
    }
  });

  testCase("AssertAlwaysCalledOnTest", {
    setUp: function () {
      sinon.stub(sinon.assert, "fail");
    },

    tearDown: function () {
      sinon.assert.fail.restore();
    },

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
      var stub = sinon.stub.create();
      sinon.stub(stub, "alwaysCalledOn").returns(false);

      sinon.assert.alwaysCalledOn(stub, {});

      assert(sinon.assert.fail.called);
    },

    "should not fail if stub returns true": function () {
      var stub = sinon.stub.create();
      sinon.stub(stub, "alwaysCalledOn").returns(true);

      sinon.assert.alwaysCalledOn(stub, {});

      assertFalse(sinon.assert.fail.called);
    }
  });

  testCase("AssertAlwaysCalledWithTest", {
    setUp: function () {
      sinon.stub(sinon.assert, "fail");
    },

    tearDown: function () {
      sinon.assert.fail.restore();
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

      sinon.assert.alwaysCalledWith(stub, {}, []);

      assert(sinon.assert.fail.called);
    },

    "should not fail if stub returns true": function () {
      var stub = sinon.stub.create();
      sinon.stub(stub, "alwaysCalledWith").returns(true);

      sinon.assert.alwaysCalledWith(stub, {}, []);

      assertFalse(sinon.assert.fail.called);
    }
  });

  testCase("AssertAlwaysCalledWithExactlyTest", {
    setUp: function () {
      sinon.stub(sinon.assert, "fail");
    },

    tearDown: function () {
      sinon.assert.fail.restore();
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
      var test = {};
      sinon.assert.expose(global, true, false);

      assertEquals("undefined", typeof failException);
      assertFunction(assertCalled);
      assertFunction(assertCalledOn);
      assertFunction(assertCalledWith);
      assertFunction(assertCalledWithExactly);
      assertFunction(assertThrew);
      assertFunction(assertCallCount);
    },

    "should expose asserts into object without prefixes": function () {
      var test = {};
      sinon.assert.expose(test, false);

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
}(this));
