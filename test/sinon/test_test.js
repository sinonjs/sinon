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
(function () {
  testCase("SinonTestTest", {
    "should pass stub function to callback": function () {
      sinon.test(function (stub) {
        assertFunction(stub);
      })();
    },

    "should proxy return value": function () {
      var object = {};

      var result = sinon.test(function (stub) {
        return object;
      })();

      assertSame(object, result);
    },

    "should stub inside sandbox": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function (stub) {
        stub(object, "method").returns(object);

        assertSame(object, object.method());
      })();
    },

    "should restore stubs": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function (stub) {
        stub(object, "method");
      })();

      assertSame(method, object.method);
    },

    "should throw when method throws": function () {
      var method = function () {};
      var object = { method: method };

      assertException(function () {
        sinon.test(function (stub) {
          stub(object, "method");
          throw new Error();
        })();
      }, "Error");
    },

    "should restore stub when method throws": function () {
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

    "should mock inside sandbox": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function (stub, mock) {
        mock(object).expects("method").returns(object);

        assertSame(object, object.method());
      })();
    },

    "should verify mocks": function () {
      var method = function () {};
      var object = { method: method };

      assertException(function () {
        sinon.test(function (stub, mock) {
          mock(object).expects("method");
        })();
      }, "ExpectationError");

      assertSame(method, object.method);
    },

    "should restore mocks": function () {
      var method = function () {};
      var object = { method: method };

      try {
        sinon.test(function (stub, mock) {
          mock(object).expects("method");
        })();
      } catch (e) {}

      assertSame(method, object.method);
    },

    "should restore mock when method throws": function () {
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

    "should append helpers after normal arguments": function () {
      var object = { method: function () {} };

      sinon.test(function (obj, stub, mock) {
        mock(object).expects("method").once();
        object.method();

        assertSame(object, obj);
      })(object);
    },

    "should append maintain this object": function () {
      var testCase = {
        someTest: sinon.test(function (obj, stub, mock) {
          return this;
        })
      };

      assertSame(testCase, testCase.someTest());
    }
  });
}());
