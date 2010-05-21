/*jslint indent: 2, onevar: false, eqeqeq: false*/
/*globals TestCase,
          sinon,
          fail,
          assert,
          assertEquals,
          assertSame,
          assertNotSame,
          assertFunction,
          assertObject,
          assertException,
          assertNoException*/
(function () {
  var testCase = TestCase; // Avoid JsLint warning

  testCase("SinonTest", {
    "test sinon should be object": function () {
      assertObject(sinon);
    }
  });

  testCase("SinonWrapMethodTest", {
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

  testCase("WrappedMethodTest", {
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

  testCase("SinonDeepEqualTest", {
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
        a: 1,
        b: 2,
        c: 3,
        d: "hey",
        e: "there",
        f: func,
        g: {
          a1: [1, 2, "3", {
            prop: [func, "b"]
          }]
        }
      };

      var obj2 = {
        a: 1,
        b: 2,
        c: 3,
        d: "hey",
        e: "there",
        f: func,
        g: {
          a1: [1, 2, "3", {
            prop: [func, "b"]
          }]
        }
      };

      assert(sinon.deepEqual(obj1, obj2));
    }
  });

  testCase("SinonKeysTest", {
    "test should be method": function () {
      assertFunction(sinon.keys);
    },

    "test should return enumerable keys": function () {
      var obj = { a: 0, b: "", c: null, d: function () {}, e: {}, f: false };

      assertEquals(["a", "b", "c", "d", "e", "f"], sinon.keys(obj));
    },

    "test should return sorted keys": function () {
      var obj = { d: function () {}, e: {}, f: false, a: 0, b: "", c: null };

      assertEquals(["a", "b", "c", "d", "e", "f"], sinon.keys(obj));
    }
  });
}());
