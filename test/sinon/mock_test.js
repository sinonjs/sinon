TestCase("MockCreateTest", {
  "test should be function": function () {
    assertFunction(sinon.mock.create);
  },

  "test should return object": function () {
    var mock = sinon.mock.create({});

    assertObject(mock);
  },

  "test should return function with expects method": function () {
    var mock = sinon.mock.create({});

    assertFunction(mock.expects);
  },

  "test should throw without object": function () {
    assertException(function () {
      sinon.mock.create();
    }, "TypeError");
  }
});

TestCase("MockExpectsTest", {
  setUp: function () {
    this.mock = sinon.mock.create({});
  },

  "test should throw without method": function () {
    var mock = this.mock;

    assertException(function () {
      mock.expects();
    }, "TypeError");
  },

  "test should return expectation": function () {
    var result = this.mock.expects("someMethod");

    assertFunction(result);
    assertEquals("someMethod", result.method);
  }
})

TestCase("ExpectationTest", {
  setUp: function () {
    this.method = "myMeth";
    this.expectation = sinon.expectation.create(this.methodName);
  },

  "test call": function () {
    this.expectation();

    assertFunction(this.expectation.invoke);
    assert(this.expectation.called);
  },

  "test should be invokable": function () {
    var expectation = this.expectation;

    assertNoException(function () {
      expectation();
    });
  }
});

function expectationSetUp () {
  this.method = "myMeth";
  this.expectation = sinon.expectation.create(this.method);
}

function mockSetUp () {
  this.method = function () {};
  this.object = { method: this.method };
  this.mock = sinon.mock.create(this.object);
}

TestCase("ExpectationReturnsTest", {
  setUp: expectationSetUp,

  "test should return configured return value": function () {
    var object = {};
    this.expectation.returns(object);

    assertSame(object, this.expectation());
  }
});

TestCase("ExpectationCallTest", {
  setUp: expectationSetUp,

  "test should be called with correct this value": function () {
    var object = { method: this.expectation };
    object.method();

    assert(this.expectation.calledOn(object));
  }
});

TestCase("ExpectationCallCountTest", {
  setUp: expectationSetUp,

  "test should only be invokable once by default": function () {
    var expectation = this.expectation;
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test throw readable error": function () {
    var expectation = this.expectation;
    expectation();

    try {
      expectation();
      fail("Expected to throw");
    } catch(e) {
      assertEquals("myMeth already called once", e.message);
    }
  }
});

TestCase("ExpectationCallCountNeverTest", {
  setUp: expectationSetUp,

  "test should not be callable": function () {
    var expectation = this.expectation;
    expectation.never();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.never());
  }
});

TestCase("ExpectationCallCountOnceTest", {
  setUp: expectationSetUp,

  "test should allow one call": function () {
    var expectation = this.expectation;
    expectation.once();
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.once());
  }
});

TestCase("ExpectationCallCountTwiceTest", {
  setUp: expectationSetUp,

  "test should allow two calls": function () {
    var expectation = this.expectation;
    expectation.twice();
    expectation();
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.twice());
  }
});

TestCase("ExpectationCallCountThriceTest", {
  setUp: expectationSetUp,

  "test should allow three calls": function () {
    var expectation = this.expectation;
    expectation.thrice();
    expectation();
    expectation();
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.thrice());
  }
});

TestCase("ExpectationCallCountExactlyTest", {
  setUp: expectationSetUp,

  "test should allow specified number of calls": function () {
    var expectation = this.expectation;
    expectation.exactly(2);
    expectation();
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.exactly(2));
  },

  "test should throw without argument": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.exactly();
    }, "TypeError");
  },

  "test should throw without number": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.exactly("12");
    }, "TypeError");
  }
});

TestCase("MockExpectationAtLeastTest", {
  setUp: expectationSetUp,

  "test should throw without argument": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.atLeast();
    }, "TypeError");
  },

  "test should throw without number": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.atLeast({});
    }, "TypeError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.atLeast(2));
  },

  "test should allow any number of calls": function () {
    var expectation = this.expectation;
    expectation.atLeast(2);
    expectation();
    expectation();

    assertNoException(function () {
      expectation();
      expectation();
    });
  },

  "test should not be met with too few calls": function () {
    this.expectation.atLeast(2);
    this.expectation();

    assertFalse(this.expectation.met());
  },

  "test should be met with exact calls": function () {
    this.expectation.atLeast(2);
    this.expectation();
    this.expectation();

    assert(this.expectation.met());
  },

  "test should be met with excessive calls": function () {
    this.expectation.atLeast(2);
    this.expectation();
    this.expectation();
    this.expectation();

    assert(this.expectation.met());
  }
});

TestCase("MockExpectationAtMostTest", {
  setUp: expectationSetUp,

  "test should throw without argument": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.atMost();
    }, "TypeError");
  },

  "test should throw without number": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.atMost({});
    }, "TypeError");
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.atMost(2));
  },

  "test should allow fewer calls": function () {
    var expectation = this.expectation;
    expectation.atMost(2);

    assertNoException(function () {
      expectation();
    });
  },

  "test should be met with fewer calls": function () {
    this.expectation.atMost(2);
    this.expectation();

    assert(this.expectation.met());
  },

  "test should be met with exact calls": function () {
    this.expectation.atMost(2);
    this.expectation();
    this.expectation();

    assert(this.expectation.met());
  },

  "test should not be met with excessive calls": function () {
    var expectation = this.expectation;
    this.expectation.atMost(2);
    this.expectation();
    this.expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");

    assertFalse(this.expectation.met());
  }
});

TestCase("MockExpectationAtMostAndAtLeastTest", {
  setUp: function () {
    expectationSetUp.call(this);
    this.expectation.atLeast(2);
    this.expectation.atMost(3);
  },

  "test should not be met with too few calls": function () {
    this.expectation();

    assertFalse(this.expectation.met());
  },

  "test should be met with minimum calls": function () {
    this.expectation();
    this.expectation();

    assert(this.expectation.met());
  },

  "test should be met with maximum calls": function () {
    this.expectation();
    this.expectation();
    this.expectation();

    assert(this.expectation.met());
  },

  "test should throw with excessive calls": function () {
    var expectation = this.expectation;
    expectation();
    expectation();
    expectation();

    assertException(function () {
      expectation();
    }, "ExpectationError");
  }
});

TestCase("MockExpectationMetTest", {
  setUp: expectationSetUp,

  "test should not be met when not called enough times": function () {
    assertFalse(this.expectation.met());
  },

  "test should be met when called enough times": function () {
    this.expectation();

    assert(this.expectation.met());
  },

  "test should not be met when called too many times": function () {
    this.expectation();

    try {
      this.expectation();
    } catch (e) {};

    assertFalse(this.expectation.met());
  }
});

TestCase("MockExpectationWithArgsTest", {
  setUp: expectationSetUp,

  "test should be method": function () {
    assertFunction(this.expectation.withArgs);
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.withArgs(1));
  },

  "test should accept call with expected args": function () {
    this.expectation.withArgs(1, 2, 3);
    this.expectation(1, 2, 3);

    assert(this.expectation.met());
  },

  "test should throw when called without args": function () {
    var expectation = this.expectation;
    expectation.withArgs(1, 2, 3);

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should throw when called with too few args": function () {
    var expectation = this.expectation;
    expectation.withArgs(1, 2, 3);

    assertException(function () {
      expectation(1, 2);
    }, "ExpectationError");
  },

  "test should throw when called with wrong args": function () {
    var expectation = this.expectation;
    expectation.withArgs(1, 2, 3);

    assertException(function () {
      expectation(2, 2, 3);
    }, "ExpectationError");
  },

  "test should allow excessive args": function () {
    var expectation = this.expectation;
    expectation.withArgs(1, 2, 3);

    assertNoException(function () {
      expectation(1, 2, 3, 4);
    });
  }
});

TestCase("MockExpectationWithExactArgsTest", {
  setUp: expectationSetUp,

  "test should be method": function () {
    assertFunction(this.expectation.withExactArgs);
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.withExactArgs(1));
  },

  "test should accept call with expected args": function () {
    this.expectation.withExactArgs(1, 2, 3);
    this.expectation(1, 2, 3);

    assert(this.expectation.met());
  },

  "test should throw when called without args": function () {
    var expectation = this.expectation;
    expectation.withExactArgs(1, 2, 3);

    assertException(function () {
      expectation();
    }, "ExpectationError");
  },

  "test should throw when called with too few args": function () {
    var expectation = this.expectation;
    expectation.withExactArgs(1, 2, 3);

    assertException(function () {
      expectation(1, 2);
    }, "ExpectationError");
  },

  "test should throw when called with wrong args": function () {
    var expectation = this.expectation;
    expectation.withExactArgs(1, 2, 3);

    assertException(function () {
      expectation(2, 2, 3);
    }, "ExpectationError");
  },

  "test should not allow excessive args": function () {
    var expectation = this.expectation;
    expectation.withExactArgs(1, 2, 3);

    assertException(function () {
      expectation(1, 2, 3, 4);
    }, "ExpectationError");
  }
});

TestCase("MockExpectationOnTest", {
  setUp: expectationSetUp,

  "test should be method": function () {
    assertFunction(this.expectation.on);
  },

  "test should return expectation for chaining": function () {
    assertSame(this.expectation, this.expectation.on({}));
  },

  "test should allow calls on object": function () {
    this.expectation.on(this);
    this.expectation();

    assert(this.expectation.met());
  },

  "test should throw if called on wrong object": function () {
    var expectation = this.expectation;
    expectation.on({});

    assertException(function () {
      expectation();
    }, "ExpectationError");
  }
});

TestCase("MockExpectationVerifyTest", {
  setUp: expectationSetUp,

  "test should throw if not called enough times": function () {
    var expectation = this.expectation;

    assertException(function () {
      expectation.verify();
    }, "ExpectationError");
  },

  "test should throw readable error": function () {
    var expectation = this.expectation;

    try {
      expectation.verify();
      fail("Expected to throw");
    } catch(e) {
      assertEquals("myMeth expected to be called once, but was called 0 times", e.message);
    }
  }
});

TestCase("MockVerifyTest", {
  setUp: mockSetUp,

  "test should restore mocks": function () {
    this.object.method();
    this.object.method.call(this.thisObj);
    this.mock.verify();

    assertSame(this.method, this.object.method);
  },

  "test should restore if not met": function () {
    var mock = this.mock;
    mock.expects("method");

    assertException(function () {
      mock.verify();
    }, "ExpectationError");

    assertSame(this.method, this.object.method);
  }
});

TestCase("MockObjectTest", {
  setUp: mockSetUp,

  "test should mock object method": function () {
    this.mock.expects("method");

    assertFunction(this.object.method);
    assertNotSame(this.method, this.object.method);
  },

  "test should revert mocked method": function () {
    this.mock.expects("method");
    this.object.method.restore();

    assertSame(this.method, this.object.method);
  },

  "test should revert expectation": function () {
    var method = this.mock.expects("method");
    this.object.method.restore();

    assertSame(this.method, this.object.method);
  },

  "test should revert mock": function () {
    var method = this.mock.expects("method");
    this.mock.restore();

    assertSame(this.method, this.object.method);
  },

  "test should verify mock": function () {
    var method = this.mock.expects("method");
    this.object.method();
    var mock = this.mock;

    assertNoException(function () {
      assert(mock.verify());
    });
  },

  "test should verify mock with unmet expectations": function () {
    var method = this.mock.expects("method");
    var mock = this.mock;

    assertException(function () {
      assert(mock.verify());
    }, "ExpectationError");
  }
})

TestCase("MockMethodMultipleTimesTest", {
  setUp: function () {
    this.thisObj = {};
    this.method = function () {};
    this.object = { method: this.method };
    this.mock = sinon.mock.create(this.object);
    this.mock1 = this.mock.expects("method");
    this.mock2 = this.mock.expects("method").on(this.thisObj);
  },

  "test should queue expectations": function () {
    var object = this.object;

    assertNoException(function () {
      object.method();
    });
  },

  "test should start on next expectation when first is met": function () {
    var object = this.object;
    object.method();

    assertException(function () {
      object.method();
    }, "ExpectationError");
  },

  "test should fail on last expectation": function () {
    var object = this.object;
    object.method();
    object.method.call(this.thisObj);

    assertException(function () {
      object.method();
    }, "ExpectationError");
  }
});

TestCase("MockFunctionTest", {
  "test should return mock method": function () {
    var mock = sinon.mock();

    assertFunction(mock);
    assertFunction(mock.atLeast);
    assertFunction(mock.verify);
  },

  "test should return mock object": function () {
    var mock = sinon.mock({});

    assertObject(mock);
    assertFunction(mock.expects);
    assertFunction(mock.verify);
  },

  "test should return mock object": function () {
    var mock = sinon.mock({});

    assertObject(mock);
    assertFunction(mock.expects);
    assertFunction(mock.verify);
  }
});
