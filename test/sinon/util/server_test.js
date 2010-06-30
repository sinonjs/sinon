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
    setUp: function () {
      this.server = sinon.server.create();
    },

    tearDown: function () {
      this.server.restore();
    },

    "should collect objects created with fake XHR": function () {
      var xhrs = [new sinon.FakeXMLHttpRequest(), new sinon.FakeXMLHttpRequest()];

      assertEquals(xhrs, this.server.requests);
    },

    "should observe onSend on requests": function () {
      var xhrs = [new sinon.FakeXMLHttpRequest(), new sinon.FakeXMLHttpRequest()];

      assertFunction(xhrs[0].onSend);
      assertFunction(xhrs[1].onSend);
    },

    "onSend should call handleRequest with request object": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/");
      sinon.spy(this.server, "handleRequest");

      xhr.send();

      assert(this.server.handleRequest.called);
      assert(this.server.handleRequest.calledWith(xhr));
    }
  });

  testCase("ServerHandleRequestTest", {
    setUp: function () {
      this.server = sinon.server.create();
    },

    tearDown: function () {
      this.server.restore();
    },

    "should respond to synchronous requests": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", false);
      sinon.spy(xhr, "respond");

      xhr.send();

      assert(xhr.respond.called);
    },

    "should not respond to async requests": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", true);
      sinon.spy(xhr, "respond");

      xhr.send();

      assertFalse(xhr.respond.called);
    }
  });

  testCase("ServerRespondWithTest", {
    setUp: function () {
      this.server = sinon.server.create();
    },

    tearDown: function () {
      this.server.restore();
    },

    "should respond to queued async requests": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", true);
      xhr.send();
      sinon.spy(xhr, "respond");

      this.server.respondWith("Oh yeah! Duffman!");
      this.server.processQueue();

      assert(xhr.respond.called);
      assertEquals(200, xhr.respond.args[0][0]);
      assertEquals({}, xhr.respond.args[0][1]);
      assertEquals("Oh yeah! Duffman!", xhr.respond.args[0][2]);
    },

    "should respond to all queued async requests": function () {
      var xhrs = [new sinon.FakeXMLHttpRequest(), new sinon.FakeXMLHttpRequest()];
      xhrs[0].open("GET", "/", true);
      xhrs[0].send();
      xhrs[1].open("GET", "/somewhere/else", true);
      xhrs[1].send();
      sinon.spy(xhrs[0], "respond");
      sinon.spy(xhrs[1], "respond");

      this.server.respondWith("Oh yeah! Duffman!");
      this.server.processQueue();

      assert(xhrs[0].respond.called);
      assert(xhrs[1].respond.called);
    },

    "should respond with status, headers, and body": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", true);
      xhr.send();
      sinon.spy(xhr, "respond");

      this.server.respondWith([201, { "Content-Type": "X-test" }, "Oh yeah!"]);
      this.server.processQueue();

      assertEquals(201, xhr.respond.args[0][0]);
      assertEquals({ "Content-Type": "X-test" }, xhr.respond.args[0][1]);
      assertEquals("Oh yeah!", xhr.respond.args[0][2]);
    },

    "should respond to sync request with canned answers": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", false);

      this.server.respondWith([210, { "X-Ops": "Yeah" }, "Body, man"]);
      xhr.send();

      assertEquals(210, xhr.status);
      assertEquals({ "X-Ops": "Yeah" }, xhr.getAllResponseHeaders());
      assertEquals("Body, man", xhr.responseText);
    },

    "should respond to sync request with 404 if no response is set": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", false);

      xhr.send();

      assertEquals(404, xhr.status);
      assertEquals({}, xhr.getAllResponseHeaders());
      assertEquals("", xhr.responseText);
    },

    "should respond to async request with 404 if no response is set": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", true);
      xhr.send();
      sinon.spy(xhr, "respond");

      this.server.processQueue();

      assertEquals([404, {}, ""], xhr.respond.args[0]);
    },

    "should respond to specific URL": function () {
      var xhr = new sinon.FakeXMLHttpRequest();
      xhr.open("GET", "/", true);
      xhr.send();
      sinon.spy(xhr, "respond");

      var xhr2 = new sinon.FakeXMLHttpRequest();
      xhr2.open("GET", "/some/url", true);
      xhr2.send();
      sinon.spy(xhr2, "respond");

      this.server.respondWith("/some/url", "Duffman likes Duff beer");
      this.server.processQueue();

      assertEquals([404, {}, ""], xhr.respond.args[0]);
      assertEquals([200, {}, "Duffman likes Duff beer"], xhr2.respond.args[0]);
    }
  });
}());
