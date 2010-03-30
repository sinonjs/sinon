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
