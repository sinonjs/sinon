/*jslint indent: 2, onevar: false, eqeqeq: false*/
/*globals testCase,
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
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function () {
  testCase("SinonTest", {
    "sinon should be object": function () {
      assertObject(sinon);
    }
  });

  testCase("SinonWrapMethodTest", {
    setUp: function () {
      this.method = function () {};
      this.object = { method: this.method };
    },

    "should be function": function () {
      assertFunction(sinon.wrapMethod);
    },

    "should throw if first argument is not object": function () {
      assertException(function () {
        sinon.wrapMethod();
      }, "TypeError");
    },

    "should throw if object defines property but is not function": function () {
      this.object.prop = 42;
      var object = this.object;

      assertException(function () {
        sinon.wrapMethod(object, "prop", function () {});
      }, "TypeError");
    },

    "should not throw if object does not define property": function () {
      var object = this.object;

      assertNoException(function () {
        sinon.wrapMethod(object, "prop", function () {});
      });
    },

    "should throw if third argument is missing": function () {
      var object = this.object;

      assertException(function () {
        sinon.wrapMethod(object, "method");
      }, "TypeError");
    },

    "should throw if third argument is not function": function () {
      var object = this.object;

      assertException(function () {
        sinon.wrapMethod(object, "method", {});
      }, "TypeError");
    },

    "should replace object method": function () {
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

    "should define restore method": function () {
      sinon.wrapMethod(this.object, "method", function () {});

      assertFunction(this.object.method.restore);
    },

    "should return wrapper": function () {
      var wrapper = sinon.wrapMethod(this.object, "method", function () {});

      assertSame(wrapper, this.object.method);
    },

    "restore should bring back original method": function () {
      sinon.wrapMethod(this.object, "method", function () {});
      this.object.method.restore();

      assertSame(this.method, this.object.method);
    }
  });

  testCase("SinonDeepEqualTest", {
    "should pass primitives": function () {
      assert(sinon.deepEqual(1, 1));
    },

    "should pass same object": function () {
      var object = {};

      assert(sinon.deepEqual(object, object));
    },

    "should pass same function": function () {
      var func = function () {};

      assert(sinon.deepEqual(func, func));
    },

    "should pass same array": function () {
      var arr = [];

      assert(sinon.deepEqual(arr, arr));
    },

    "should pass equal arrays": function () {
      var arr1 = [1, 2, 3, "hey", "there"];
      var arr2 = [1, 2, 3, "hey", "there"];

      assert(sinon.deepEqual(arr1, arr2));
    },

    "should pass equal objects": function () {
      var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
      var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

      assert(sinon.deepEqual(obj1, obj2));
    },

    "should pass deep objects": function () {
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
    "should be method": function () {
      assertFunction(sinon.keys);
    },

    "should return enumerable keys": function () {
      var obj = { a: 0, b: "", c: null, d: function () {}, e: {}, f: false };

      assertEquals(["a", "b", "c", "d", "e", "f"], sinon.keys(obj));
    },

    "should return sorted keys": function () {
      var obj = { d: function () {}, e: {}, f: false, a: 0, b: "", c: null };

      assertEquals(["a", "b", "c", "d", "e", "f"], sinon.keys(obj));
    }
  });

  testCase("ExtendTest", {
    "should copy all properties": function () {
      var object1 = {
        prop1: null,
        prop2: false
      };

      var object2 = {
        prop3: "hey",
        prop4: 4
      };

      var result = sinon.extend({}, object1, object2);

      var expected = {
        prop1: null,
        prop2: false,
        prop3: "hey",
        prop4: 4
      };

      assertEquals(expected, result);
    }
  });
}());
