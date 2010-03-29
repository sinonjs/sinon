TestCase("SpyTest", {
  "test should be function": function () {
    assertFunction(sinon.spy);
  },

  "test should throw if called without function": function () {
    assertException(function () {
      sinon.spy();
    }, "TypeError");
  },

  "test should return spy function": function () {
    var func = function () {};
    var spy = sinon.spy(func);

    assertFunction(spy);
    assertNotSame(spy, func);
  },

  "test should mirror custom properties on function": function () {
    var func = function () {};
    func.myProp = 42;
    var spy = sinon.spy(func);

    assertEquals(func.myProp, spy.myProp);
  }
});

TestCase("SpyCallTest", {
  "test should call underlying function": function () {
    var called = false;
    var func = function () { called = true; };
    var spy = sinon.spy(func);
    spy();

    assert(called);
  },

  "test should pass arguments to function": function () {
    var actualArgs;
    var func = function () { actualArgs = arguments; };
    var args = [1, {}, [], ""];
    var spy = sinon.spy(func);
    spy(args[0], args[1], args[2], args[3]);

    assertEquals(args, actualArgs);
  },

  "test should maintain this binding": function () {
    var actualThis;
    var func = function () { actualThis = this; };
    var object = {};
    var spy = sinon.spy(func);
    spy.call(object);

    assertSame(object, actualThis);
  },

  "test should return function's return value": function () {
    var object = {};
    var func = function () { return object; };
    var spy = sinon.spy(func);
    var actualReturn = spy();

    assertSame(object, actualReturn);
  },

  "test should throw if function throws": function () {
    var err = new Error();
    var spy = sinon.spy(function () { throw err; });

    try {
      spy();
      fail("Expected spy to throw exception");
    } catch (e) {
      assertSame(err, e);
    }
  }
});

TestCase("SpyCalledTest", {
  "test should return boolean": function () {
    var spy = sinon.spy(function () {});

    assertBoolean(spy.called());
  },

  "test should be false prior to calling the spy": function () {
    var spy = sinon.spy(function () {});

    assertFalse(spy.called());
  },

  "test should be true after calling the spy once": function () {
    var spy = sinon.spy(function () {});
    spy();

    assert(spy.called());
  },

  "test should be true after calling the spy twice": function () {
    var spy = sinon.spy(function () {});
    spy();
    spy();

    assert(spy.called());
  }
});

TestCase("SpyCallCountTest", {
  "test should record number of calls": function () {
    var spy = sinon.spy(function () {});
    spy();
    spy();
    spy();

    assertEquals(3, spy.callCount());
  }
});

TestCase("SpyCalledOnTest", {
  "test should be false if spy wasn't called": function () {
    var spy = sinon.spy(function () {});

    assertFalse(spy.calledOn({}));
  },

  "test should be true if called with thisObj": function () {
    var spy = sinon.spy(function () {});
    var object = {};
    spy.call(object);

    assert(spy.calledOn(object));
  },

  "test should be true if called on object at least once": function () {
    var spy = sinon.spy(function () {});
    var object = {};
    spy();
    spy.call({});
    spy.call(object);
    spy.call(window);

    assert(spy.calledOn(object));
  },

  "test should return false if not called on object": function () {
    var spy = sinon.spy(function () {});
    var object = {};
    spy.call(object);
    spy();

    assertFalse(spy.calledOn({}));
  }
});

TestCase("SpyCalledWithTest", {
  "test should return false if spy was not called": function () {
    var spy = sinon.spy(function () {});

    assertFalse(spy.calledWith(1, 2, 3));
  },

  "test should return true if spy was called with args": function () {
    var spy = sinon.spy(function () {});
    spy(1, 2, 3);

    assert(spy.calledWith(1, 2, 3));
  },

  "test should return true if called with args at least once": function () {
    var spy = sinon.spy(function () {});
    spy(1, 3, 3);
    spy(1, 2, 3);
    spy(3, 2, 3);

    assert(spy.calledWith(1, 2, 3));
  },

  "test should return false if not called with args": function () {
    var spy = sinon.spy(function () {});
    spy(1, 3, 3);
    spy(2);
    spy();

    assertFalse(spy.calledWith(1, 2, 3));
  },

  "test should return true for partial match": function () {
    var spy = sinon.spy(function () {});
    spy(1, 3, 3);
    spy(2);
    spy();

    assert(spy.calledWith(1, 3));
  },

  "test should match all arguments individually, not as array": function () {
    var spy = sinon.spy(function () {});
    spy([1, 2, 3]);

    assertFalse(spy.calledWith(1, 2, 3));
  },

  "test should match arguments strictly": function () {
    var spy = sinon.spy(function () {});
    spy({}, []);

    assertFalse(spy.calledWith({}, []));
  }
});

TestCase("CalledWithExactlyTest", {
  "test should return false for partial match": function () {
    var spy = sinon.spy(function () {});
    spy(1, 2, 3);

    assertFalse(spy.calledWithExactly(1, 2));
  },

  "test should return false for missing arguments": function () {
    var spy = sinon.spy(function () {});
    spy(1, 2, 3);

    assertFalse(spy.calledWithExactly(1, 2, 3, 4));
  },

  "test should return true for exact match": function () {
    var spy = sinon.spy(function () {});
    spy(1, 2, 3);

    assert(spy.calledWithExactly(1, 2, 3));
  },

  "test should match by strict comparison": function () {
    var spy = sinon.spy(function () {});
    spy({}, []);

    assertFalse(spy.calledWithExactly({}, []));
  },

  "test should return true for one exact match": function () {
    var spy = sinon.spy(function () {});
    var object = {};
    var array = [];
    spy({}, []);
    spy(object, []);
    spy(object, array);

    assert(spy.calledWithExactly(object, array));
  }
});

TestCase("SpyThrewTest", {
  "test should return exception thrown by function": function () {
    var err = new Error();
    var func = function () { throw err; };
    var spy = sinon.spy(func);
    try { spy(); } catch (e) {}

    assert(spy.threw(err));
  },

  "test should return false if spy did not throw": function () {
    var func = function () {};
    var spy = sinon.spy(func);
    spy();

    assertFalse(spy.threw());
  },

  "test should return true if spy threw": function () {
    var func = function () { throw new Error(); };
    var spy = sinon.spy(func);
    try { spy(); } catch (e) {}

    assert(spy.threw());
  },

  "test should return true if string type matches": function () {
    var func = function () { throw new TypeError(); };
    var spy = sinon.spy(func);
    try { spy(); } catch (e) {}

    assert(spy.threw("TypeError"));
  },

  "test should return false if string did not match": function () {
    var func = function () { throw new TypeError(); };
    var spy = sinon.spy(func);
    try { spy(); } catch (e) {}

    assertFalse(spy.threw("Error"));
  },

  "test should return false if spy did not throw": function () {
    var spy = sinon.spy(function () {});
    spy();

    assertFalse(spy.threw("Error"));
  }
});

TestCase("SpyCallObjectTest", {
  "test should get call object": function () {
    var spy = sinon.spy(function () {});
    spy();
    var firstCall = spy.getCall(0);

    assertFunction(firstCall.calledOn);
    assertFunction(firstCall.calledWith);
    assertFunction(firstCall.returned);
  }
});
