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

      this.getRootAsync = new sinon.FakeXMLHttpRequest();
      this.getRootAsync.open("GET", "/", true);
      this.getRootAsync.send();
      sinon.spy(this.getRootAsync, "respond");

      this.postRootAsync = new sinon.FakeXMLHttpRequest();
      this.postRootAsync.open("POST", "/", true);
      this.postRootAsync.send();
      sinon.spy(this.postRootAsync, "respond");

      this.getRootSync = new sinon.FakeXMLHttpRequest();
      this.getRootSync.open("GET", "/", false);

      this.getPathAsync = new sinon.FakeXMLHttpRequest();
      this.getPathAsync.open("GET", "/path", true);
      this.getPathAsync.send();
      sinon.spy(this.getPathAsync, "respond");

      this.postPathAsync = new sinon.FakeXMLHttpRequest();
      this.postPathAsync.open("POST", "/path", true);
      this.postPathAsync.send();
      sinon.spy(this.postPathAsync, "respond");
    },

    tearDown: function () {
      this.server.restore();
    },

    "should respond to queued async requests": function () {
      this.server.respondWith("Oh yeah! Duffman!");

      this.server.respond();

      assert(this.getRootAsync.respond.called);
      assertEquals([200, {}, "Oh yeah! Duffman!"], this.getRootAsync.respond.args[0]);
    },

    "should respond to all queued async requests": function () {
      this.server.respondWith("Oh yeah! Duffman!");

      this.server.respond();

      assert(this.getRootAsync.respond.called);
      assert(this.getPathAsync.respond.called);
    },

    "should respond with status, headers, and body": function () {
      var headers = { "Content-Type": "X-test" };
      this.server.respondWith([201, headers, "Oh yeah!"]);

      this.server.respond();

      assertEquals([201, headers, "Oh yeah!"], this.getRootAsync.respond.args[0]);
    },

    "should handle responding with empty queue": function () {
        delete this.server.queue;
        var server = this.server;

        assertNoException(function () {
            server.respond();
        });
    },

    "should respond to sync request with canned answers": function () {
      this.server.respondWith([210, { "X-Ops": "Yeah" }, "Body, man"]);

      this.getRootSync.send();

      assertEquals(210, this.getRootSync.status);
      assertEquals({ "x-ops": "Yeah" }, this.getRootSync.getAllResponseHeaders());
      assertEquals("Body, man", this.getRootSync.responseText);
    },

    "should respond to sync request with 404 if no response is set": function () {
      this.getRootSync.send();

      assertEquals(404, this.getRootSync.status);
      assertEquals({}, this.getRootSync.getAllResponseHeaders());
      assertEquals("", this.getRootSync.responseText);
    },

    "should respond to async request with 404 if no response is set": function () {
      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
    },

    "should respond to specific URL": function () {
      this.server.respondWith("/path", "Duffman likes Duff beer");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
      assertEquals([200, {}, "Duffman likes Duff beer"], this.getPathAsync.respond.args[0]);
    },

    "should respond to URL matched by regexp": function () {
      this.server.respondWith(/^\/p.*/, "Regexp");

      this.server.respond();

      assertEquals([200, {}, "Regexp"], this.getPathAsync.respond.args[0]);
    },

    "should not respond to URL not matched by regexp": function () {
      this.server.respondWith(/^\/p.*/, "No regexp match");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
    },

    "should respond to all URLs matched by regexp": function () {
      this.server.respondWith(/^\/.*/, "Match all URLs");

      this.server.respond();

      assertEquals([200, {}, "Match all URLs"], this.getRootAsync.respond.args[0]);
      assertEquals([200, {}, "Match all URLs"], this.getPathAsync.respond.args[0]);
    },

    "should respond to all requests when match URL is falsy": function () {
      this.server.respondWith("", "Falsy URL");

      this.server.respond();

      assertEquals([200, {}, "Falsy URL"], this.getRootAsync.respond.args[0]);
      assertEquals([200, {}, "Falsy URL"], this.getPathAsync.respond.args[0]);
    },

    "should respond to all GET requests": function () {
      this.server.respondWith("GET", "", "All GETs");

      this.server.respond();

      assertEquals([200, {}, "All GETs"], this.getRootAsync.respond.args[0]);
      assertEquals([200, {}, "All GETs"], this.getPathAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postPathAsync.respond.args[0]);
    },

    "should respond to all PUT requests": function () {
      this.server.respondWith("PUT", "", "All PUTs");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.getPathAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postPathAsync.respond.args[0]);
    },

    "should respond to all POST requests": function () {
      this.server.respondWith("POST", "", "All POSTs");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.getPathAsync.respond.args[0]);
      assertEquals([200, {}, "All POSTs"], this.postRootAsync.respond.args[0]);
      assertEquals([200, {}, "All POSTs"], this.postPathAsync.respond.args[0]);
    },

    "should respond to all POST requests to /path": function () {
      this.server.respondWith("POST", "/path", "All POSTs");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.getPathAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postRootAsync.respond.args[0]);
      assertEquals([200, {}, "All POSTs"], this.postPathAsync.respond.args[0]);
    },

    "should respond to all POST requests matching regexp": function () {
      this.server.respondWith("POST", /^\/path(\?.*)?/, "All POSTs");

      this.server.respond();

      assertEquals([404, {}, ""], this.getRootAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.getPathAsync.respond.args[0]);
      assertEquals([404, {}, ""], this.postRootAsync.respond.args[0]);
      assertEquals([200, {}, "All POSTs"], this.postPathAsync.respond.args[0]);
    },

    "should not respond to aborted requests": function () {
      this.server.respondWith("/", "That's my homepage!");
      this.getRootAsync.aborted = true;

      this.server.respond();

      assertFalse(this.getRootAsync.respond.called);
    }
  });
}());
