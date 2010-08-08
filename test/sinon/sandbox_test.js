/*jslint indent: 2*/
/*global testCase
         setTimeout
         sinon
         assert
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

    "should pass arguments to sinon.useFakeTimers": sinon.test(function (stub) {
      stub(sinon, "useFakeTimers").returns({ restore: function () {} });
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

    "should return fake xhr object": function () {
      var xhr = this.sandbox.useFakeXMLHttpRequest();

      assertFunction(xhr);
      assertFunction(xhr.restore);
    },

    "should expose fakeXMLHttpRequest property": function () {
      var xhr = this.sandbox.useFakeXMLHttpRequest();

      assertSame(xhr, this.sandbox.fakeXMLHttpRequest);
    },

    "should call sinon.useFakeXMLHttpRequest": sinon.test(function (stub) {
      stub(sinon, "useFakeXMLHttpRequest").returns({ restore: function () {} });
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
      var server = this.sandbox.useServer();

      assertObject(server);
      assertFunction(server.restore);
    },

    "should expose server property": function () {
      var server = this.sandbox.useServer();

      assertSame(server, this.sandbox.server);
    },

    "should create server": function () {
      var server = this.sandbox.useServer();

      assert(sinon.server.isPrototypeOf(server));
    },

    "should create server with cock": function () {
      this.sandbox.serverPrototype = sinon.serverWithClock;
      var server = this.sandbox.useServer();

      assert(sinon.serverWithClock.isPrototypeOf(server));
    },

    "should add server to fake collection": function () {
      this.sandbox.useServer();
      this.sandbox.restore();

      assertSame(globalXHR, global.XMLHttpRequest);
      assertSame(globalAXO, global.ActiveXObject);
    }
  });
}());
