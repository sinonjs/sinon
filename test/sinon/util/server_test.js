/*jslint indent: 2, onevar: false*/
/*globals testCase,
          sinon,
          assert,
          assertSame,
          assertEquals,
          assertTrue,
          assertFalse,
          assertNull,
          assertException,
          assertUndefined,
          assertObject,
          assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010 Christian Johansen
 */
(function () {
  testCase("ServerCreateTest", {
    tearDown: function () {
      this.server.restore();
    },

    "should return server object": function () {
      this.server = sinon.server.create();

      assertObject(this.server);
      assert(sinon.server.isPrototypeOf(this.server));
    },

    "should provide restore method": function () {
      this.server = sinon.server.create();

      assertFunction(this.server.restore);
    },

    "should fake XMLHttpRequest": sinon.test(function (stub) {
      stub(sinon, "useFakeXMLHttpRequest").returns({ restore: stub() });

      this.server = sinon.server.create();

      assert(sinon.useFakeXMLHttpRequest.called);
    }),

    "should mirror FakeXMLHttpRequest restore method": function () {
      this.server = sinon.server.create();

      assertSame(sinon.FakeXMLHttpRequest.restore, this.server.restore);
    }
  });

  testCase("ServerRequestsTest", {
    tearDown: function () {
      this.server.restore();
    },

    "should collect objects created with fake XHR": function () {
      this.server = sinon.server.create();

      var xhrs = [new sinon.FakeXMLHttpRequest(), new sinon.FakeXMLHttpRequest()];

      assertEquals(xhrs, this.server.requests);
    }
  });
}());
