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

  testCase("SinonTestTest", {
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
}());
