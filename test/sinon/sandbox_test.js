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

  var globalSetTimeout = setTimeout;

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

      assertSame(globalSetTimeout, setTimeout);
    }
  });
}());
