TestCase("StubFunctionTest", {
  "test should return function": function () {
    assertFunction(sinon.stub.create());
  },

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
  },

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

  "test throws should return stub": function () {
    var stub = sinon.stub.create();

    assertSame(stub, stub.throws({}));
  },

  "test throws should set type of exception to throw": function () {
    var stub = sinon.stub.create();
    var exceptionType = "TypeError";
    stub.throws(exceptionType);

    assertException(function () {
      stub();
    }, exceptionType);
  },

  "test throws should specify exception message": function () {
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

  "test stub should be spy": function () {
    var stub = sinon.stub.create();

    assertFunction(stub.called);
    assertFunction(stub.calledWith);
    assertFunction(stub.calledWith);
    assertFunction(stub.calledOn);
  }
});

TestCase("StubObjectMethodTest", {
  setUp: function () {
    this.method = function () {};
    this.object = { method: this.method };
  },

  "test should be function": function () {
    assertFunction(sinon.stub);
  },

  "test should throw if first argument is not object": function () {
    assertException(function () {
      sinon.stub();
    }, "TypeError");
  },

  "test should throw if object defines property but is not function": function () {
    this.object.prop = 42;
    var object = this.object;

    assertException(function () {
      sinon.stub(object, "prop");
    }, "TypeError");
  },

  "test should not throw if object does not define property": function () {
    var object = this.object;

    assertNoException(function () {
      sinon.stub(object, "prop");
    });
  },

  "test should replace object method": function () {
    sinon.stub(this.object, "method");

    assertNotSame(this.method, this.object.method);
    assertFunction(this.object.method);
  },

  "test should define restore method": function () {
    sinon.stub(this.object, "method");

    assertFunction(this.object.method.restore);
  },

  "test should return stub": function () {
    var stub = sinon.stub(this.object, "method");

    assertSame(stub, this.object.method);
  },

  "test should use provided function as stub": function () {
    var called = false;
    var customStub = function () { called = true; };
    var stub = sinon.stub(this.object, "method", customStub);

    assertFunction(stub.restore);
    stub();
    assert(called);
  },

  "test should throw if third argument is provided but not function": function () {
    var object = this.object;

    assertException(function () {
      sinon.stub(object, "method", {});
    }, "TypeError");
  },

  "test restore should bring back original method": function () {
    sinon.stub(this.object, "method");
    this.object.method.restore();

    assertSame(this.method, this.object.method);
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

  "test custom stubbed method should be spy": function () {
    var stub = sinon.stub(this.object, "method", function () {});

    assertFunction(stub.called);
    assertFunction(stub.calledWith);
    assertFunction(stub.calledWithExactly);
    assertFunction(stub.calledOn);
  }
});
