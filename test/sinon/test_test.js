/*jslint indent: 2, onevar: false, eqeqeq: false, browser: true*/
/*globals testCase,
          sinon,
          fail,
          assert,
          assertNotNull,
          assertUndefined,
          assertArray,
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
  testCase("SinonTestTest", {
    tearDown: function () {
      sinon.config = {};
    },

    "should proxy return value": function () {
      var object = {};

      var result = sinon.test(function () {
        return object;
      })();

      assertSame(object, result);
    },

    "should stub inside sandbox": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function () {
        this.stub(object, "method").returns(object);

        assertSame(object, object.method());
      })();
    },

    "should restore stubs": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function () {
        this.stub(object, "method");
      })();

      assertSame(method, object.method);
    },

    "should throw when method throws": function () {
      var method = function () {};
      var object = { method: method };

      assertException(function () {
        sinon.test(function () {
          this.stub(object, "method");
          throw new Error();
        })();
      }, "Error");
    },

    "should restore stub when method throws": function () {
      var method = function () {};
      var object = { method: method };

      try {
        sinon.test(function () {
          this.stub(object, "method");
          throw new Error();
        })();
      } catch (e) {}

      assertSame(method, object.method);
    },

    "should mock inside sandbox": function () {
      var method = function () {};
      var object = { method: method };

      sinon.test(function () {
        this.mock(object).expects("method").returns(object);

        assertSame(object, object.method());
      })();
    },

    "should verify mocks": function () {
      var method = function () {};
      var object = { method: method };

      assertException(function () {
        sinon.test(function () {
          this.mock(object).expects("method");
        })();
      }, "ExpectationError");

      assertSame(method, object.method);
    },

    "should restore mocks": function () {
      var method = function () {};
      var object = { method: method };

      try {
        sinon.test(function () {
          this.mock(object).expects("method");
        })();
      } catch (e) {}

      assertSame(method, object.method);
    },

    "should restore mock when method throws": function () {
      var method = function () {};
      var object = { method: method };

      try {
        sinon.test(function () {
          this.mock(object).expects("method").never();
          object.method();
        })();
      } catch (e) {}

      assertSame(method, object.method);
    },

    "should append helpers after normal arguments": function () {
      var object = { method: function () {} };

      sinon.config = {
        injectIntoThis: false,
        properties: ["stub", "mock"]
      };

      sinon.test(function (obj, stub, mock) {
        mock(object).expects("method").once();
        object.method();

        assertSame(object, obj);
      })(object);
    },

    "should maintain the this value": function () {
      var testCase = {
        someTest: sinon.test(function (obj, stub, mock) {
          return this;
        })
      };

      assertSame(testCase, testCase.someTest());
    }
  });

  function assertSpy(obj) {
    assertNotNull(obj);
    assertFunction(obj.calledWith);
    assertUndefined(obj.returns);
  }

  function assertStub(obj) {
    assertNotNull(obj);
    assertFunction(obj.calledWith);
    assertFunction(obj.returns);
  }

  function assertMock(obj) {
    assertObject(obj);
    assertFunction(obj.verify);
    assertFunction(obj.expects);
  }

  function assertFakeServer(server) {
    assertObject(server);
    assertArray(server.requests);
    assertFunction(server.respondWith);
  }

  function assertClock(clock) {
    assertObject(clock);
    assertFunction(clock.tick);
    assertFunction(clock.setTimeout);
  }

  function boundTestCase() {
    var properties = {
      fn: function () {
        properties.self = this;
        properties.args = arguments;
        properties.spy = this.spy;
        properties.stub = this.stub;
        properties.mock = this.mock;
        properties.clock = this.clock;
        properties.server = this.server;
        properties.requests = this.requests;
      }
    };

    return properties;
  }

  testCase("ConfigurableTestWithSandboxTest", {
    tearDown: function () {
      sinon.config = {};
    },

    "should yield stub, mock as arguments": function () {
      var stubbed, mocked;
      var obj = { meth: function () {} };

      sinon.config = {
        injectIntoThis: false,
        properties: ["stub", "mock"]
      };

      sinon.test(function (stub, mock) {
        stubbed = stub(obj, "meth");
        mocked = mock(obj);

        assertEquals(2, arguments.length);
      })();

      assertStub(stubbed);
      assertMock(mocked);
    },

    "should yield spy, stub, mock as arguments": function () {
      var spied, stubbed, mocked;
      var obj = { meth: function () {} };

      sinon.config = {
        injectIntoThis: false,
        properties: ["spy", "stub", "mock"]
      };

      sinon.test(function (spy, stub, mock) {
        spied = spy(obj, "meth");
        stubbed = stub(obj, "meth");
        mocked = mock(obj);

        assertEquals(3, arguments.length);
      })();

      assertSpy(spied);
      assertStub(stubbed);
      assertMock(mocked);
    },

    "should not yield server when not faking xhr": function () {
      var stubbed, mocked;
      var obj = { meth: function () {} };

      sinon.config = {
        injectIntoThis: false,
        properties: ["server", "stub", "mock"]
      };

      sinon.test(function (stub, mock) {
        stubbed = stub(obj, "meth");
        mocked = mock(obj);

        assertEquals(2, arguments.length);
      })();

      assertStub(stubbed);
      assertMock(mocked);
    },

    "should yield server when faking xhr": function () {
      var stubbed, mocked, server;
      var obj = { meth: function () {} };

      sinon.config = {
        injectIntoThis: false,
        properties: ["server", "stub", "mock"],
        useFakeServer: true
      };

      sinon.test(function (serv, stub, mock) {
        server = serv;
        stubbed = stub(obj, "meth");
        mocked = mock(obj);

        assertEquals(3, arguments.length);
      })();

      assertFakeServer(server);
      assertStub(stubbed);
      assertMock(mocked);
    },

    "should yield clock when faking timers": function () {
      var server, clock;

      sinon.config = {
        injectIntoThis: false,
        properties: ["server", "clock"],
        useFakeTimers: true,
        useFakeServer: true
      };

      sinon.test(function (s, c) {
        server = s;
        clock = c;

        assertEquals(2, arguments.length);
      })();

      assertFakeServer(server);
      assertClock(clock);
    },

    "should inject properties into test case": function () {
      var testCase = boundTestCase();

      sinon.config = {
        properties: ["server", "clock"],
        useFakeTimers: true,
        useFakeServer: true
      };

      sinon.test(testCase.fn).call(testCase);

      assertSame(testCase, testCase.self);
      assertEquals(0, testCase.args.length);
      assertFakeServer(testCase.server);
      assertClock(testCase.clock);
      assertUndefined(testCase.spy);
      assertUndefined(testCase.stub);
      assertUndefined(testCase.mock);
      assertUndefined(testCase.requests);
    },

    "should inject properties into object": function () {
      var testCase = boundTestCase();
      var obj = {};

      sinon.config = {
        injectIntoThis: false,
        injectInto: obj,
        properties: ["server", "clock", "spy", "stub", "mock", "requests"],
        useFakeTimers: true,
        useFakeServer: true
      };

      sinon.test(testCase.fn).call(testCase);

      assertEquals(0, testCase.args.length);
      assertUndefined(testCase.server);
      assertUndefined(testCase.clock);
      assertUndefined(testCase.spy);
      assertUndefined(testCase.stub);
      assertUndefined(testCase.mock);
      assertUndefined(testCase.requests);
      assertFakeServer(obj.server);
      assertClock(obj.clock);
      assertFunction(obj.spy);
      assertFunction(obj.stub);
      assertFunction(obj.mock);
      assertArray(obj.requests);
    },

    "should inject functions into test case by default": function () {
      var testCase = boundTestCase();
      var obj = {};

      sinon.test(testCase.fn).call(testCase);

      assertEquals(0, testCase.args.length);
      assertFunction(testCase.spy);
      assertFunction(testCase.stub);
      assertFunction(testCase.mock);
      assertUndefined(testCase.requests);
      assertUndefined(testCase.server);
      assertUndefined(testCase.clock);
    },

    "should inject server and clock when only enabling them": function () {
      var testCase = boundTestCase();
      var obj = {};

      sinon.config = {
        useFakeTimers: true,
        useFakeServer: true
      };

      sinon.test(testCase.fn).call(testCase);

      assertEquals(0, testCase.args.length);
      assertFunction(testCase.spy);
      assertFunction(testCase.stub);
      assertFunction(testCase.mock);
      assertFakeServer(testCase.server);
      assertArray(testCase.requests);
      assertClock(testCase.clock);
    },

    "should use sinon.test to fake time": function () {
      sinon.config = {
        useFakeTimers: true
      };

      var called;

      var testCase = {
        test: sinon.test(function () {
          var spy = this.spy();
          setTimeout(spy, 19);
          this.clock.tick(19);

          called = spy.called;
        })
      };

      testCase.test();

      assert(called);
    }
  });
}());
