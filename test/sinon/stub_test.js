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
      stub.throwsException(error);

      try {
        stub();
        fail("Expected stub to throw");
      } catch (e) {
        assertSame(error, e);
      }
    },

    "test should return stub": function () {
      var stub = sinon.stub.create();

      assertSame(stub, stub.throwsException({}));
    },

    "test should set type of exception to throw": function () {
      var stub = sinon.stub.create();
      var exceptionType = "TypeError";
      stub.throwsException(exceptionType);

      assertException(function () {
        stub();
      }, exceptionType);
    },

    "test should specify exception message": function () {
      var stub = sinon.stub.create();
      var message = "Oh no!";
      stub.throwsException("Error", message);

      try {
        stub();
        fail("Expected stub to throw");
      } catch (e) {
        assertEquals(message, e.message);
      }
    },

    "test should throw generic error": function () {
      var stub = sinon.stub.create();
      stub.throwsException();

      assertException(function () {
        stub();
      }, "Error");
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
      assertFunction(stub.throwsException);
    },

    "test custom stubbed method should not be proper stub": function () {
      var stub = sinon.stub(this.object, "method", function () {});

      assertUndefined(stub.returns);
      assertUndefined(stub.throwsException);
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
      stub.throwsException("TypeError");

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
}());
