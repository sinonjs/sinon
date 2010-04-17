TestCase("SinonTest", {
  "test sinon should be object": function () {
    assertObject(sinon);
  }
});

TestCase("SinonWrapMethodTest", {
  setUp: function () {
    this.method = function () {};
    this.object = { method: this.method };
  },

  "test should be function": function () {
    assertFunction(sinon.wrapMethod);
  },

  "test should throw if first argument is not object": function () {
    assertException(function () {
      sinon.wrapMethod();
    }, "TypeError");
  },

  "test should throw if object defines property but is not function": function () {
    this.object.prop = 42;
    var object = this.object;

    assertException(function () {
      sinon.wrapMethod(object, "prop", function () {});
    }, "TypeError");
  },

  "test should not throw if object does not define property": function () {
    var object = this.object;

    assertNoException(function () {
      sinon.wrapMethod(object, "prop", function () {});
    });
  },

  "test should throw if third argument is missing": function () {
    var object = this.object;

    assertException(function () {
      sinon.wrapMethod(object, "method");
    }, "TypeError");
  },

  "test should throw if third argument is not function": function () {
    var object = this.object;

    assertException(function () {
      sinon.wrapMethod(object, "method", {});
    }, "TypeError");
  },

  "test should replace object method": function () {
    sinon.wrapMethod(this.object, "method", function () {});

    assertNotSame(this.method, this.object.method);
    assertFunction(this.object.method);
  }
});

TestCase("WrappedMethodTest", {
  setUp: function () {
    this.method = function () {};
    this.object = { method: this.method };
  },

  "test should define restore method": function () {
    sinon.wrapMethod(this.object, "method", function () {});

    assertFunction(this.object.method.restore);
  },

  "test should return wrapper": function () {
    var wrapper = sinon.wrapMethod(this.object, "method", function () {});

    assertSame(wrapper, this.object.method);
  },

  "test restore should bring back original method": function () {
    sinon.wrapMethod(this.object, "method", function () {});
    this.object.method.restore();

    assertSame(this.method, this.object.method);
  }
});

TestCase("SinonDeepEqualTest", {
  "test should pass primitives": function () {
    assert(sinon.deepEqual(1, 1));
  },

  "test should pass same object": function () {
    var object = {};

    assert(sinon.deepEqual(object, object));
  },

  "test should pass same function": function () {
    var func = function () {};

    assert(sinon.deepEqual(func, func));
  },

  "test should pass same array": function () {
    var arr = [];

    assert(sinon.deepEqual(arr, arr));
  },

  "test should pass equal arrays": function () {
    var arr1 = [1, 2, 3, "hey", "there"];
    var arr2 = [1, 2, 3, "hey", "there"];

    assert(sinon.deepEqual(arr1, arr2));
  },

  "test should pass equal objects": function () {
    var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
    var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

    assert(sinon.deepEqual(obj1, obj2));
  },

  "test should pass deep objects": function () {
    var func = function () {};

    var obj1 = {
      a: 1, b: 2, c: 3, d: "hey", e: "there",
      f: func, g: {
        a1: [1, 2, "3", {
          prop: [func, "b"]
        }]
      }
    };

    var obj2 = {
      a: 1, b: 2, c: 3, d: "hey", e: "there",
      f: func, g: {
        a1: [1, 2, "3", {
          prop: [func, "b"]
        }]
      }
    };

    assert(sinon.deepEqual(obj1, obj2));
  }
});

TestCase("SinonFunctionTest", {
  "test should pass stub function to callback": function () {
    sinon.test(function (stub) {
      assertFunction(stub);
    })();
  },

  "test should proxy return value": function () {
    var object = {};

    var result = sinon.test(function (stub) {
      return object;
    })();

    assertSame(object, result);
  },

  "test should stub inside sandbox": function () {
    var method = function () {};
    var object = { method: method };

    sinon.test(function (stub) {
      stub(object, "method").returns(object);

      assertSame(object, object.method());
    })();
  },

  "test should restore stubs": function () {
    var method = function () {};
    var object = { method: method };

    sinon.test(function (stub) {
      stub(object, "method");
    })();

    assertSame(method, object.method);
  },

  "test should throw when method throws": function () {
    var method = function () {};
    var object = { method: method };

    assertException(function () {
      sinon.test(function (stub) {
        stub(object, "method");
        throw new Error();
      })();
    }, "Error");
  },

  "test should restore stub when method throws": function () {
    var method = function () {};
    var object = { method: method };

    try {
      sinon.test(function (stub) {
        stub(object, "method");
        throw new Error();
      })();
    } catch (e) {}

    assertSame(method, object.method);
  },

  "test should mock inside sandbox": function () {
    var method = function () {};
    var object = { method: method };

    sinon.test(function (stub, mock) {
      mock(object).expects("method").returns(object);

      assertSame(object, object.method());
    })();
  },

  "test should verify mocks": function () {
    var method = function () {};
    var object = { method: method };

    assertException(function () {
      sinon.test(function (stub, mock) {
        mock(object).expects("method");
      })();
    }, "ExpectationError");

    assertSame(method, object.method);
  },

  "test should restore mocks": function () {
    var method = function () {};
    var object = { method: method };

    try {
      sinon.test(function (stub, mock) {
        mock(object).expects("method");
      })();
    } catch (e) {}

    assertSame(method, object.method);
  },

  "test should restore mock when method throws": function () {
    var method = function () {};
    var object = { method: method };

    try {
      sinon.test(function (stub, mock) {
        mock(object).expects("method").never();
        object.method();
      })();
    } catch (e) {}

    assertSame(method, object.method);
  },

  "test should append helpers after normal arguments": function () {
    var object = { method: function () {} };

    sinon.test(function (obj, stub, mock) {
      mock(object).expects("method").once();
      object.method();

      assertSame(object, obj);
    })(object);
  },

  "test should append maintain this object": function () {
    var testCase = {
      someTest: sinon.test(function (obj, stub, mock) {
        return this;
      })
    };

    assertSame(testCase, testCase.someTest());
  }
});
