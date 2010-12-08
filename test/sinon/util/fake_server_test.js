/*jslint onevar: false, browser: false, regexp: false, browser: true*/
/*globals testCase
          sinon
          window
          assert
          assertSame
          assertEquals
          assertTrue
          assertFalse
          assertNull
          assertException
          assertNoException
          assertUndefined
          assertObject
          assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
testCase("ServerCreateTest", {
    tearDown: function () {
        this.server.restore();
    },

    "should return server object": function () {
        this.server = sinon.fakeServer.create();

        assertObject(this.server);
        assert(sinon.fakeServer.isPrototypeOf(this.server));
    },

    "should provide restore method": function () {
        this.server = sinon.fakeServer.create();

        assertFunction(this.server.restore);
    },

    "should fake XMLHttpRequest": sinon.test(function () {
        this.stub(sinon, "useFakeXMLHttpRequest").returns({
            restore: this.stub()
        });

        this.server = sinon.fakeServer.create();

        assert(sinon.useFakeXMLHttpRequest.called);
    }),

    "should mirror FakeXMLHttpRequest restore method": sinon.test(function () {
        this.server = sinon.fakeServer.create();
        var restore = this.stub(sinon.FakeXMLHttpRequest, "restore");
        this.server.restore();

        assert(restore.called);
    })
});

testCase("ServerRequestsTest", {
    setUp: function () {
        this.server = sinon.fakeServer.create();
    },

    tearDown: function () {
        this.server.restore();
    },

    "should collect objects created with fake XHR": function () {
        var xhrs = [new sinon.FakeXMLHttpRequest(), new sinon.FakeXMLHttpRequest()];

        assertEquals(xhrs, this.server.requests);
    },

    "should collect xhr objects through addRequest": function () {
        this.server.addRequest = sinon.spy();
        var xhr = new sinon.FakeXMLHttpRequest();

        assert(this.server.addRequest.calledWith(xhr));
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
        this.server = sinon.fakeServer.create();
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
        this.server = sinon.fakeServer.create();

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

    "should respond to all 'get' requests (case-insensitivity)": function () {
        this.server.respondWith("get", "", "All GETs");

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
    },

    "should reset requests": function () {
        this.server.respondWith("/", "That's my homepage!");

        this.server.respond();

        assertEquals([], this.server.queue);
    },

    "should notify all requests when some throw": function () {
        this.getRootAsync.respond = function () {
            throw new Error("Oops!");
        };

        this.server.respondWith("");
        this.server.respond();

        assertEquals([200, {}, ""], this.getPathAsync.respond.args[0]);
        assertEquals([200, {}, ""], this.postRootAsync.respond.args[0]);
        assertEquals([200, {}, ""], this.postPathAsync.respond.args[0]);
    },

    "should recognize request with hostname": function () {
        this.server.respondWith("/", [200, {}, "Yep"]);
        var xhr = new sinon.FakeXMLHttpRequest();
        var loc = window.location;
        xhr.open("GET", loc.protocol + "//" + loc.host + "/", true);
        xhr.send();
        sinon.spy(xhr, "respond");

        this.server.respond();

        assertEquals([200, {}, "Yep"], xhr.respond.args[0]);
    }
});

testCase("ServerRespondFakeHTTPVerbTest", {
    setUp: function () {
        this.server = sinon.fakeServer.create();

        this.request = new sinon.FakeXMLHttpRequest();
        this.request.open("post", "/path", true);
        this.request.send("_method=delete");
        sinon.spy(this.request, "respond");
    },

    tearDown: function () {
        this.server.restore();
    },

    "should not respond to DELETE request with _method parameter": function () {
        this.server.respondWith("DELETE", "", "");

        this.server.respond();

        assertEquals([404, {}, ""], this.request.respond.args[0]);
    },

    "should respond to 'fake' DELETE request": function () {
        this.server.fakeHTTPMethods = true;
        this.server.respondWith("DELETE", "", "OK");

        this.server.respond();

        assertEquals([200, {}, "OK"], this.request.respond.args[0]);
    },

    "should not respond to POST when faking DELETE": function () {
        this.server.fakeHTTPMethods = true;
        this.server.respondWith("POST", "", "OK");

        this.server.respond();

        assertEquals([404, {}, ""], this.request.respond.args[0]);
    },

    "should not fake method when not POSTing": function () {
        this.server.fakeHTTPMethods = true;
        this.server.respondWith("DELETE", "", "OK");

        var request = new sinon.FakeXMLHttpRequest();
        request.open("GET", "/");
        request.send();
        request.respond = sinon.spy();
        this.server.respond();

        assertEquals([404, {}, ""], request.respond.args[0]);
    },

    "should customize HTTP method extraction": function () {
        this.server.getHTTPMethod = function (request) {
            return "PUT";
        };

        this.server.respondWith("PUT", "", "OK");

        this.server.respond();

        assertEquals([200, {}, "OK"], this.request.respond.args[0]);
    }
});
