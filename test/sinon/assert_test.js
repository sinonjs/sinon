TestCase("SinonAssertTest", {
  "test should be object": function () {
    assertObject(sinon.assert);
  }
});

function stubSetUp() {
  this.stub = sinon.stub.create();
  sinon.stub(sinon.assert, "fail").throwsException();
}

function stubTearDown () {
  sinon.assert.fail.restore();
}

TestCase("SinonAssertFailTest", {
  setUp: function () {
    this.exceptionName = sinon.assert.failException;
  },

  tearDown: function () {
    sinon.assert.failException = this.exceptionName;
  },

  "test should throw exception": function () {
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

  "test should throw configured exception type": function () {
    sinon.assert.failException = "RetardError";

    assertException(function () {
      sinon.assert.fail("Some message");
    }, "RetardError");
  }
});

TestCase("SinonAssertCalledTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should be function": function () {
    assertFunction(sinon.assert.called);
  },

  "test should fail when method does not exist": function () {
    assertException(function () {
      sinon.assert.called();
    });

    assert(sinon.assert.fail.called());
  },

  "test should fail when method is not stub": function () {
    assertException(function () {
      sinon.assert.called(function () {});
    });

    assert(sinon.assert.fail.called());
  },

  "test should fail when method was not called": function () {
    var stub = this.stub;

    assertException(function () {
      sinon.assert.called(stub);
    });

    assert(sinon.assert.fail.called());
  },

  "test should not fail when method was called": function () {
    var stub = this.stub;
    stub();

    assertNoException(function () {
      sinon.assert.called(stub);
    });

    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertCalledOnTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should be function": function () {
    assertFunction(sinon.assert.calledOn);
  },

  "test should fail when method does not exist": function () {
    var object = {};
    sinon.stub(this.stub, "calledOn");

    assertException(function () {
      sinon.assert.calledOn(object, null);
    });

    assertFalse(this.stub.calledOn.calledWith(object));
    assert(sinon.assert.fail.called());
  },

  "test should fail when method is not stub": function () {
    var object = {};
    sinon.stub(this.stub, "calledOn");

    assertException(function () {
      sinon.assert.calledOn(object, function () {});
    });

    assertFalse(this.stub.calledOn.calledWith(object));
    assert(sinon.assert.fail.called());
  },

  "test should fail when method fails": function () {
    var object = {};
    sinon.stub(this.stub, "calledOn").returns(false);
    var stub = this.stub;
    
    assertException(function () {
      sinon.assert.calledOn(object, stub);
    });

    assert(sinon.assert.fail.called());
  },

  "test should not fail when method doesn't fail": function () {
    var object = {};
    sinon.stub(this.stub, "calledOn").returns(true);
    var stub = this.stub;
    
    assertNoException(function () {
      sinon.assert.calledOn(object, stub);
    });

    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertCalledWithTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should fail when method fails": function () {
    var object = {};
    sinon.stub(this.stub, "calledWith").returns(false);
    var stub = this.stub;
    
    assertException(function () {
      sinon.assert.calledWith(stub, object, 1);
    });

    assert(this.stub.calledWith.calledWith(object, 1));
    assert(sinon.assert.fail.called());
  },

  "test should not fail when method doesn't fail": function () {
    var object = {};
    sinon.stub(this.stub, "calledWith").returns(true);
    var stub = this.stub;
    
    assertNoException(function () {
       sinon.assert.calledWith(stub, object, 1);
    });

    assert(this.stub.calledWith.calledWith(object, 1));
    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertCalledWithExactlyTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should fail when method fails": function () {
    var object = {};
    sinon.stub(this.stub, "calledWithExactly").returns(false);
    var stub = this.stub;
    
    assertException(function () {
      sinon.assert.calledWithExactly(stub, object, 1);
    });

    assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
    assert(sinon.assert.fail.called());
  },

  "test should not fail when method doesn't fail": function () {
    var object = {};
    sinon.stub(this.stub, "calledWithExactly").returns(true);
    var stub = this.stub;
    
    assertNoException(function () {
       sinon.assert.calledWithExactly(stub, object, 1);
    });

    assert(this.stub.calledWithExactly.calledWithExactly(object, 1));
    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertThrewTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should fail when method fails": function () {
    sinon.stub(this.stub, "threw").returns(false);
    var stub = this.stub;
    
    assertException(function () {
      sinon.assert.threw(stub, 1, 2);
    });

    assert(this.stub.threw.calledWithExactly(1, 2));
    assert(sinon.assert.fail.called());
  },

  "test should not fail when method doesn't fail": function () {
    sinon.stub(this.stub, "threw").returns(true);
    var stub = this.stub;
    
    assertNoException(function () {
      sinon.assert.threw(stub, 1, 2);
    });

    assert(this.stub.threw.calledWithExactly(1, 2));
    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertCallCountTest", {
  setUp: stubSetUp,
  tearDown: stubTearDown,

  "test should fail when method fails": function () {
    sinon.stub(this.stub, "callCount").returns(2);
    var stub = this.stub;
    
    assertException(function () {
      sinon.assert.callCount(3, stub);
    });

    assert(this.stub.callCount.called());
    assert(sinon.assert.fail.called());
  },

  "test should not fail when method doesn't fail": function () {
    sinon.stub(this.stub, "callCount").returns(3);
    var stub = this.stub;
    
    assertNoException(function () {
      sinon.assert.callCount(3, stub);
    });

    assert(this.stub.callCount.called());
    assertFalse(sinon.assert.fail.called());
  }
});

TestCase("SinonAssertExposeTest", {
  "test should expose asserts into object": function () {
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

  "test should expose asserts into global": function () {
    var test = {};
    sinon.assert.expose((function () { return this; }()), true, false);

    assertEquals("undefined", typeof failException);
    assertFunction(assertCalled);
    assertFunction(assertCalledOn);
    assertFunction(assertCalledWith);
    assertFunction(assertCalledWithExactly);
    assertFunction(assertThrew);
    assertFunction(assertCallCount);
  },

  "test should expose asserts into object without prefixes": function () {
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

  "test should throw if target is undefined": function () {
    assertException(function () {
      sinon.assert.expose();
    }, "TypeError");
  },

  "test should throw if target is null": function () {
    assertException(function () {
      sinon.assert.expose(null);
    }, "TypeError");
  }
});
