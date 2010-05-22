/*jslint indent: 2, onevar: false*/
/*globals TestCase,
          sinon,
          fail,
          assert,
          assertUndefined,
          assertBoolean,
          assertFalse,
          assertFunction,
          assertSame,
          assertNotSame,
          assertEquals,
          assertException*/
(function () {
  var testCase = TestCase; // Avoid JsLint warning

  testCase("StubCreateTest", {
    "test should return function": function () {
      assertFunction(sinon.stub.create());
    },

    "test should be spy": function () {
      var stub = sinon.stub.create();

      assertBoolean(stub.called);
      assertFunction(stub.calledWith);
      assertFunction(stub.calledWith);
      assertFunction(stub.calledOn);
    }
  });

  testCase("StubReturnsTest", {
    "test should have returns method": function () {
      var stub = sinon.stub.create();

      assertFunction(stub.returns);
    },

    "test should return specified value": function () {
      var stub = sinon.stub.create();
      var object = {};
      stub.returns(object);

      assertSame(object, stub());
    },

    "test returns should return stub": function () {
      var stub = sinon.stub.create();

      assertSame(stub, stub.returns(""));
    },

    "test should return undefined": function () {
      var stub = sinon.stub.create();

      assertUndefined(stub());
    }
  });

  testCase("StubThrowsTest", {
    "test should throw specified exception": function () {
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

    "test should return stub": function () {
      var stub = sinon.stub.create();

      assertSame(stub, stub.throws({}));
    },

    "test should set type of exception to throw": function () {
      var stub = sinon.stub.create();
      var exceptionType = "TypeError";
      stub.throws(exceptionType);

      assertException(function () {
        stub();
      }, exceptionType);
    },

    "test should specify exception message": function () {
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

    "test should throw generic error": function () {
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

    "test should call argument at specified index": function () {
      this.stub.callsArg(2);
      var callback = sinon.stub.create();

      this.stub(1, 2, callback);

      assert(callback.called);
    },

    "test should throw if argument at specified index is not callable": function () {
      this.stub.callsArg(0);
      var callback = sinon.stub.create();

      assertException(function () {
        this.stub(1);
      }, "TypeError");
    },

    "test should throw if no index is specified": function () {
      var stub = this.stub;

      assertException(function () {
        stub.callsArg();
      }, "TypeError");
    },

    "test should throw if index is not number": function () {
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

    "test should call argument at specified index with provided args": function () {
      var object = {};
      this.stub.callsArgWith(1, object);
      var callback = sinon.stub.create();

      this.stub(1, callback);

      assert(callback.calledWith(object));
    },

    "test should call callback without args": function () {
      this.stub.callsArgWith(1);
      var callback = sinon.stub.create();

      this.stub(1, callback);

      assert(callback.calledWith());
    },

    "test should call callback wit multiple args": function () {
      var object = {};
      var array = [];
      this.stub.callsArgWith(1, object, array);
      var callback = sinon.stub.create();

      this.stub(1, callback);

      assert(callback.calledWith(object, array));
    },

    "test should throw if no index is specified": function () {
      var stub = this.stub;

      assertException(function () {
        stub.callsArgWith();
      }, "TypeError");
    },

    "test should throw if index is not number": function () {
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

    "test should be function": function () {
      assertFunction(sinon.stub);
    },

    "test should return function from wrapMethod": function () {
      var wrapper = function () {};
      sinon.wrapMethod = function () {
        return wrapper;
      };

      var result = sinon.stub(this.object, "method");

      assertSame(wrapper, result);
    },

    "test should pass object and method to wrapMethod": function () {
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

    "test should use provided function as stub": function () {
      var called = false;
      var stub = sinon.stub(this.object, "method", function () {
        called = true;
      });

      stub();

      assert(called);
    },

    "test should wrap provided function": function () {
      var customStub = function () {};
      var stub = sinon.stub(this.object, "method", customStub);

      assertNotSame(customStub, stub);
      assertFunction(stub.restore);
    },

    "test should throw if third argument is provided but not function": function () {
      var object = this.object;

      assertException(function () {
        sinon.stub(object, "method", {});
      }, "TypeError");
    },

    "test stubbed method should be proper stub": function () {
      var stub = sinon.stub(this.object, "method");

      assertFunction(stub.returns);
      assertFunction(stub.throws);
    },

    "test custom stubbed method should not be proper stub": function () {
      var stub = sinon.stub(this.object, "method", function () {});

      assertUndefined(stub.returns);
      assertUndefined(stub.throws);
    },

    "test stub should be spy": function () {
      var stub = sinon.stub(this.object, "method");
      this.object.method();

      assert(stub.called);
      assert(stub.calledOn(this.object));
    },

    "test custom stubbed method should be spy": function () {
      var stub = sinon.stub(this.object, "method", function () {});
      this.object.method();

      assert(stub.called);
      assert(stub.calledOn(this.object));
    },

    "test stub should affect spy": function () {
      var stub = sinon.stub(this.object, "method");
      var someObj = {};
      stub.throws("TypeError");

      try {
        this.object.method();
      } catch (e) {}

      assert(stub.threw("TypeError"));
    },

    "test should return standalone stub without arguments": function () {
      var stub = sinon.stub();

      assertFunction(stub);
      assertFalse(stub.called);
    }
  });

  testCase("StubEverythingTest", {
    "test should stub all methods of object without property": function () {
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

    "test should return object": function () {
      var object = {};

      assertSame(object, sinon.stub(object));
    },

    "test should not stub inherited methods": function () {
      var getName = function () {};
      var person = { getName: getName };
      var dude = sinon.create(person);

      sinon.stub(dude);

      assertUndefined(dude.toString.restore);
      assertUndefined(dude.valueOf.restore);
      assertSame(getName, dude.getName);
    }
  });
}());
