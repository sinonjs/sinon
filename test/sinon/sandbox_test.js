/*jslint indent: 2, onevar: false*/
/*global testCase
         XMLHttpRequest
         ActiveXObject
         window
         setTimeout
         sinon
         assert
         assertFalse
         assertEquals
         assertObject
         assertSame
         assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function () {
  testCase("SandboxTest", {
    "should be object": function () {
      assertObject(sinon.sandbox);
    },

    "should inherit collection": function () {
      assert(sinon.collection.isPrototypeOf(sinon.sandbox));
    }
  });

  testCase("SandboxUseFakeTimersTest", {
    setUp: function () {
      this.sandbox = sinon.create(sinon.sandbox);
    },

    tearDown: function () {
      this.sandbox.clock.restore();
    },

    "should return clock object": function () {
      var clock = this.sandbox.useFakeTimers();

      assertObject(clock);
      assertFunction(clock.tick);
    },

    "should expose clock property": function () {
      this.sandbox.useFakeTimers();

      assertObject(this.sandbox.clock);
      assertFunction(this.sandbox.clock.tick);
    },

    "should use restorable clock": function () {
      this.sandbox.useFakeTimers();

      assertFunction(this.sandbox.clock.restore);
    },

    "should pass arguments to sinon.useFakeTimers": sinon.test(function () {
      this.stub(sinon, "useFakeTimers").returns({ restore: function () {} });
      this.sandbox.useFakeTimers("Date", "setTimeout");
      this.sandbox.useFakeTimers("setTimeout", "clearTimeout", "setInterval");

      assert(sinon.useFakeTimers.calledWith("Date", "setTimeout"));
      assert(sinon.useFakeTimers.calledWith("setTimeout", "clearTimeout", "setInterval"));
    }),

    "should add clock to fake collection": function () {
      this.sandbox.useFakeTimers();
      this.sandbox.restore();

      assertSame(sinon.timers.setTimeout, setTimeout);
    }
  });

  var global = this;
  var globalXHR = this.XMLHttpRequest;
  var globalAXO = this.ActiveXObject;

  testCase("SandboxUseFakeXMLHttpRequestTest", {
    setUp: function () {
      this.sandbox = sinon.create(sinon.sandbox);
    },

    tearDown: function () {
      this.sandbox.restore();
    },

    "should call sinon.useFakeXMLHttpRequest": sinon.test(function () {
      this.stub(sinon, "useFakeXMLHttpRequest").returns({ restore: function () {} });
      this.sandbox.useFakeXMLHttpRequest();

      assert(sinon.useFakeXMLHttpRequest.called);
    }),

    "should add fake xhr to fake collection": function () {
      this.sandbox.useFakeXMLHttpRequest();
      this.sandbox.restore();

      assertSame(globalXHR, global.XMLHttpRequest);
      assertSame(globalAXO, global.ActiveXObject);
    }
  });

  testCase("SandboxUseServer", {
    setUp: function () {
      this.sandbox = sinon.create(sinon.sandbox);
    },

    tearDown: function () {
      this.sandbox.restore();
    },

    "should return server": function () {
      var server = this.sandbox.useFakeServer();

      assertObject(server);
      assertFunction(server.restore);
    },

    "should expose server property": function () {
      var server = this.sandbox.useFakeServer();

      assertSame(server, this.sandbox.server);
    },

    "should create server": function () {
      var server = this.sandbox.useFakeServer();

      assert(sinon.fakeServer.isPrototypeOf(server));
    },

    "should create server with cock": function () {
      this.sandbox.serverPrototype = sinon.fakeServerWithClock;
      var server = this.sandbox.useFakeServer();

      assert(sinon.fakeServerWithClock.isPrototypeOf(server));
    },

    "should add server to fake collection": function () {
      this.sandbox.useFakeServer();
      this.sandbox.restore();

      assertSame(globalXHR, global.XMLHttpRequest);
      assertSame(globalAXO, global.ActiveXObject);
    }
  });

  testCase("SandboxInjectTest", {
    setUp: function () {
      this.obj = {};
      this.sandbox = sinon.create(sinon.sandbox);
    },

    tearDown: function () {
      this.sandbox.restore();
    },

    "should inject spy, stub, mock": function () {
      this.sandbox.inject(this.obj);

      assertFunction(this.obj.spy);
      assertFunction(this.obj.stub);
      assertFunction(this.obj.mock);
    },

    "should not define clock, server and requests objects": function () {
      this.sandbox.inject(this.obj);

      assertFalse("clock" in this.obj);
      assertFalse("server" in this.obj);
      assertFalse("requests" in this.obj);
    },

    "should define clock when using fake time": function () {
      this.sandbox.useFakeTimers();
      this.sandbox.inject(this.obj);

      assertFunction(this.obj.spy);
      assertFunction(this.obj.stub);
      assertFunction(this.obj.mock);
      assertObject(this.obj.clock);
      assertFalse("server" in this.obj);
      assertFalse("requests" in this.obj);
    },

    "should define server and requests when using fake time": function () {
      this.sandbox.useFakeServer();
      this.sandbox.inject(this.obj);

      assertFunction(this.obj.spy);
      assertFunction(this.obj.stub);
      assertFunction(this.obj.mock);
      assertFalse("clock" in this.obj);
      assertObject(this.obj.server);
      assertEquals([], this.obj.requests);
    },

    "should define all possible fakes": function () {
      this.sandbox.useFakeServer();
      this.sandbox.useFakeTimers();
      this.sandbox.inject(this.obj);

      var spy = sinon.spy();
      setTimeout(spy, 10);

      this.sandbox.clock.tick(10);
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

      assertFunction(this.obj.spy);
      assertFunction(this.obj.stub);
      assertFunction(this.obj.mock);
      assert(spy.called);
      assertObject(this.obj.server);
      assertEquals([xhr], this.obj.requests);
    },

    "should return object": function () {
      var injected = this.sandbox.inject({});

      assertObject(injected);
      assertFunction(injected.spy);
    }
  });
}());
