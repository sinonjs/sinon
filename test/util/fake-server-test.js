"use strict";

var referee = require("referee");
var sinon = require("../../lib/sinon");
var sinonFakeServer = require("../../lib/sinon/util/fake_server");
var sinonStub = require("../../lib/sinon/stub");
var sinonSpy = require("../../lib/sinon/spy");
var sinonSandbox = require("../../lib/sinon/sandbox");
var fakeTimers = require("../../lib/sinon/util/fake_timers");
var fakeXhr = require("../../lib/sinon/util/fake_xml_http_request").xhr;
var FakeXMLHttpRequest = require("../../lib/sinon/util/fake_xml_http_request").FakeXMLHttpRequest;
var FakeXDomainRequest = require("../../lib/sinon/util/fake_xdomain_request").FakeXDomainRequest;

var assert = referee.assert;
var refute = referee.refute;

// we need better ways to test both paths
// but at least running tests in different environments will do that
var FakeXHR = fakeXhr.supportsCORS ? FakeXMLHttpRequest : FakeXDomainRequest;

if (typeof window !== "undefined") {
    describe("sinonFakeServer", function () {

        afterEach(function () {
            if (this.server) {
                this.server.restore();
            }
        });

        it("provides restore method", function () {
            this.server = sinonFakeServer.create();

            assert.isFunction(this.server.restore);
        });

        describe(".create", function () {
            it("allows the 'autoRespond' setting", function () {
                var server = sinonFakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'autoRespond' setting"
                );
            });
            it("allows the 'autoRespondAfter' setting", function () {
                var server = sinonFakeServer.create({
                    autoRespondAfter: 500
                });
                assert.equals(
                    server.autoRespondAfter,
                    500,
                    "fakeServer.create should accept 'autoRespondAfter' setting"
                );
            });
            it("allows the 'respondImmediately' setting", function () {
                var server = sinonFakeServer.create({
                    respondImmediately: true
                });
                assert(
                    server.respondImmediately,
                    "fakeServer.create should accept 'respondImmediately' setting"
                );
            });
            it("allows the 'fakeHTTPMethods' setting", function () {
                var server = sinonFakeServer.create({
                    fakeHTTPMethods: true
                });
                assert(
                    server.fakeHTTPMethods,
                    "fakeServer.create should accept 'fakeHTTPMethods' setting"
                );
            });
            it("does not assign a non-whitelisted setting", function () {
                var server = sinonFakeServer.create({
                    foo: true
                });
                refute(
                    server.foo,
                    "fakeServer.create should not accept 'foo' settings"
                );
            });
        });

        it("fakes XMLHttpRequest", function () {
            var sandbox = sinonSandbox.create();
            sandbox.stub(sinon, "useFakeXMLHttpRequest").returns({
                restore: sinonStub()
            });

            this.server = sinonFakeServer.create();

            assert(sinon.useFakeXMLHttpRequest.called);
            sandbox.restore();
        });

        it("mirrors FakeXMLHttpRequest restore method", function () {
            var sandbox = sinonSandbox.create();
            this.server = sinonFakeServer.create();
            var restore = sandbox.stub(FakeXMLHttpRequest, "restore");
            this.server.restore();

            assert(restore.called);
            sandbox.restore();
        });

        describe(".requests", function () {
            beforeEach(function () {
                this.server = sinonFakeServer.create();
            });

            afterEach(function () {
                this.server.restore();
            });

            it("collects objects created with fake XHR", function () {
                var xhrs = [new FakeXHR(), new FakeXHR()];

                assert.equals(this.server.requests, xhrs);
            });

            it("collects xhr objects through addRequest", function () {
                this.server.addRequest = sinonSpy();
                var xhr = new FakeXHR();

                assert(this.server.addRequest.calledWith(xhr));
            });

            it("observes onSend on requests", function () {
                var xhrs = [new FakeXHR(), new FakeXHR()];

                assert.isFunction(xhrs[0].onSend);
                assert.isFunction(xhrs[1].onSend);
            });

            it("onSend should call handleRequest with request object", function () {
                var xhr = new FakeXHR();
                xhr.open("GET", "/");
                sinonSpy(this.server, "handleRequest");

                xhr.send();

                assert(this.server.handleRequest.called);
                assert(this.server.handleRequest.calledWith(xhr));
            });
        });

        describe(".handleRequest", function () {
            beforeEach(function () {
                this.server = sinonFakeServer.create();
            });

            afterEach(function () {
                this.server.restore();
            });

            it("responds to synchronous requests", function () {
                var xhr = new FakeXHR();
                xhr.open("GET", "/", false);
                sinonSpy(xhr, "respond");

                xhr.send();

                assert(xhr.respond.called);
            });

            it("does not respond to async requests", function () {
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/", true);
                sinonSpy(xhr, "respond");

                xhr.send();

                assert.isFalse(xhr.respond.called);
            });
        });

        describe(".respondWith", function () {
            beforeEach(function () {
                this.sandbox = sinonSandbox.create();

                this.server = sinonFakeServer.create({
                    setTimeout: this.sandbox.spy(),
                    useImmediateExceptions: false
                });

                this.getRootAsync = new FakeXMLHttpRequest();
                this.getRootAsync.open("GET", "/", true);
                this.getRootAsync.send();
                sinonSpy(this.getRootAsync, "respond");

                this.postRootAsync = new FakeXMLHttpRequest();
                this.postRootAsync.open("POST", "/", true);
                this.postRootAsync.send();
                sinonSpy(this.postRootAsync, "respond");

                this.getRootSync = new FakeXMLHttpRequest();
                this.getRootSync.open("GET", "/", false);

                this.getPathAsync = new FakeXMLHttpRequest();
                this.getPathAsync.open("GET", "/path", true);
                this.getPathAsync.send();
                sinonSpy(this.getPathAsync, "respond");

                this.postPathAsync = new FakeXMLHttpRequest();
                this.postPathAsync.open("POST", "/path", true);
                this.postPathAsync.send();
                sinonSpy(this.postPathAsync, "respond");
            });

            afterEach(function () {
                this.server.restore();
                this.sandbox.restore();
            });

            it("responds to queued async requests", function () {
                this.server.respondWith("Oh yeah! Duffman!");

                this.server.respond();

                assert(this.getRootAsync.respond.called);
                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "Oh yeah! Duffman!"]);
            });

            it("responds to all queued async requests", function () {
                this.server.respondWith("Oh yeah! Duffman!");

                this.server.respond();

                assert(this.getRootAsync.respond.called);
                assert(this.getPathAsync.respond.called);
            });

            it("does not respond to requests queued after respond() (eg from callbacks)", function () {
                var xhr;
                this.getRootAsync.addEventListener("load", function () {
                    xhr = new FakeXMLHttpRequest();
                    xhr.open("GET", "/", true);
                    xhr.send();
                    sinonSpy(xhr, "respond");
                });

                this.server.respondWith("Oh yeah! Duffman!");

                this.server.respond();

                assert(this.getRootAsync.respond.called);
                assert(this.getPathAsync.respond.called);
                assert(!xhr.respond.called);

                this.server.respond();

                assert(xhr.respond.called);
            });

            it("responds with status, headers, and body", function () {
                var headers = { "Content-Type": "X-test" };
                this.server.respondWith([201, headers, "Oh yeah!"]);

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [201, headers, "Oh yeah!"]);
            });

            it("handles responding with empty queue", function () {
                delete this.server.queue;
                var server = this.server;

                refute.exception(function () {
                    server.respond();
                });
            });

            it("responds to sync request with canned answers", function () {
                this.server.respondWith([210, { "X-Ops": "Yeah" }, "Body, man"]);

                this.getRootSync.send();

                assert.equals(this.getRootSync.status, 210);
                assert.equals(this.getRootSync.getAllResponseHeaders(), "X-Ops: Yeah\r\n");
                assert.equals(this.getRootSync.responseText, "Body, man");
            });

            it("responds to sync request with 404 if no response is set", function () {
                this.getRootSync.send();

                assert.equals(this.getRootSync.status, 404);
                assert.equals(this.getRootSync.getAllResponseHeaders(), "");
                assert.equals(this.getRootSync.responseText, "");
            });

            it("responds to async request with 404 if no response is set", function () {
                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
            });

            it("responds to specific URL", function () {
                this.server.respondWith("/path", "Duffman likes Duff beer");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "Duffman likes Duff beer"]);
            });

            it("responds to URL matched by regexp", function () {
                this.server.respondWith(/^\/p.*/, "Regexp");

                this.server.respond();

                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "Regexp"]);
            });

            it("does not respond to URL not matched by regexp", function () {
                this.server.respondWith(/^\/p.*/, "No regexp match");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
            });

            it("responds to all URLs matched by regexp", function () {
                this.server.respondWith(/^\/.*/, "Match all URLs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "Match all URLs"]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "Match all URLs"]);
            });

            it("responds to all requests when match URL is falsy", function () {
                this.server.respondWith("", "Falsy URL");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "Falsy URL"]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "Falsy URL"]);
            });

            it("responds to all GET requests", function () {
                this.server.respondWith("GET", "", "All GETs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "All GETs"]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "All GETs"]);
                assert.equals(this.postRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [404, {}, ""]);
            });

            it("responds to all 'get' requests (case-insensitivity)", function () {
                this.server.respondWith("get", "", "All GETs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "All GETs"]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "All GETs"]);
                assert.equals(this.postRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [404, {}, ""]);
            });

            it("responds to all PUT requests", function () {
                this.server.respondWith("PUT", "", "All PUTs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.getPathAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [404, {}, ""]);
            });

            it("responds to all POST requests", function () {
                this.server.respondWith("POST", "", "All POSTs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.getPathAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postRootAsync.respond.args[0], [200, {}, "All POSTs"]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, "All POSTs"]);
            });

            it("responds to all POST requests to /path", function () {
                this.server.respondWith("POST", "/path", "All POSTs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.getPathAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, "All POSTs"]);
            });

            it("responds to all POST requests matching regexp", function () {
                this.server.respondWith("POST", /^\/path(\?.*)?/, "All POSTs");

                this.server.respond();

                assert.equals(this.getRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.getPathAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postRootAsync.respond.args[0], [404, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, "All POSTs"]);
            });

            it("does not respond to aborted requests", function () {
                this.server.respondWith("/", "That's my homepage!");
                this.getRootAsync.aborted = true;

                this.server.respond();

                assert.isFalse(this.getRootAsync.respond.called);
            });

            it("resets requests", function () {
                this.server.respondWith("/", "That's my homepage!");

                this.server.respond();

                assert.equals(this.server.queue, []);
            });

            it("notifies all requests when some throw", function () {
                this.getRootAsync.respond = function () {
                    throw new Error("Oops!");
                };

                this.server.respondWith("");
                this.server.respond();

                assert.equals(this.getPathAsync.respond.args[0], [200, {}, ""]);
                assert.equals(this.postRootAsync.respond.args[0], [200, {}, ""]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, ""]);
            });

            it("recognizes request with hostname", function () {
                this.server.respondWith("/", [200, {}, "Yep"]);
                var xhr = new FakeXMLHttpRequest();
                var loc = window.location;
                xhr.open("GET", loc.protocol + "//" + loc.host + "/", true);
                xhr.send();
                sinonSpy(xhr, "respond");

                this.server.respond();

                assert.equals(xhr.respond.args[0], [200, {}, "Yep"]);
            });

            it("throws understandable error if response is not a string", function () {
                var error;

                try {
                    this.server.respondWith("/", {});
                } catch (e) {
                    error = e;
                }

                assert.isObject(error);
                assert.equals(error.message, "Fake server response body should be string, but was object");
            });

            it("throws understandable error if response in array is not a string", function () {
                var error;

                try {
                    this.server.respondWith("/", [200, {}]);
                } catch (e) {
                    error = e;
                }

                assert.isObject(error);
                assert.equals(error.message, "Fake server response body should be string, but was undefined");
            });

            it("is able to pass the same args to respond directly", function () {
                this.server.respond("Oh yeah! Duffman!");

                assert.equals(this.getRootAsync.respond.args[0], [200, {}, "Oh yeah! Duffman!"]);
                assert.equals(this.getPathAsync.respond.args[0], [200, {}, "Oh yeah! Duffman!"]);
                assert.equals(this.postRootAsync.respond.args[0], [200, {}, "Oh yeah! Duffman!"]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, "Oh yeah! Duffman!"]);
            });

            it("responds to most recently defined match", function () {
                this.server.respondWith("POST", "", "All POSTs");
                this.server.respondWith("POST", "/path", "Particular POST");

                this.server.respond();

                assert.equals(this.postRootAsync.respond.args[0], [200, {}, "All POSTs"]);
                assert.equals(this.postPathAsync.respond.args[0], [200, {}, "Particular POST"]);
            });
        });

        describe(".respondWith (FunctionHandler)", function () {
            beforeEach(function () {
                this.server = sinonFakeServer.create();
            });

            afterEach(function () {
                this.server.restore();
            });

            it("yields response to request function handler", function () {
                var handler = sinonSpy();
                this.server.respondWith("/hello", handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();

                this.server.respond();

                assert(handler.calledOnce);
                assert(handler.calledWith(xhr));
            });

            it("responds to request from function handler", function () {
                this.server.respondWith("/hello", function (xhr) {
                    xhr.respond(200, { "Content-Type": "application/json" }, "{\"id\":42}");
                });

                var request = new FakeXMLHttpRequest();
                request.open("GET", "/hello");
                request.send();

                this.server.respond();

                assert.equals(request.status, 200);
                assert.equals(request.responseHeaders, { "Content-Type": "application/json" });
                assert.equals(request.responseText, "{\"id\":42}");
            });

            it("yields response to request function handler when method matches", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", "/hello", handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();

                this.server.respond();

                assert(handler.calledOnce);
            });

            it("yields response to request function handler when url contains RegExp characters", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", "/hello?world", handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello?world");
                xhr.send();

                this.server.respond();

                assert(handler.calledOnce);
            });

            it("does not yield response to request function handler when method does not match", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", "/hello", handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("POST", "/hello");
                xhr.send();

                this.server.respond();

                assert(!handler.called);
            });

            it("yields response to request function handler when regexp url matches", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", /\/.*/, handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();

                this.server.respond();

                assert(handler.calledOnce);
            });

            it("does not yield response to request function handler when regexp url does not match", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", /\/a.*/, handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();

                this.server.respond();

                assert(!handler.called);
            });

            it("adds function handler without method or url filter", function () {
                this.server.respondWith(function (xhr) {
                    xhr.respond(200, { "Content-Type": "application/json" }, "{\"id\":42}");
                });

                var request = new FakeXMLHttpRequest();
                request.open("GET", "/whatever");
                request.send();

                this.server.respond();

                assert.equals(request.status, 200);
                assert.equals(request.responseHeaders, { "Content-Type": "application/json" });
                assert.equals(request.responseText, "{\"id\":42}");
            });

            it("does not process request further if processed by function", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", "/aloha", [200, {}, "Oh hi"]);
                this.server.respondWith("GET", /\/a.*/, handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.respond = sinonSpy();
                xhr.open("GET", "/aloha");
                xhr.send();

                this.server.respond();

                assert(handler.called);
                assert(xhr.respond.calledOnce);
            });

            it("yields URL capture groups to response handler", function () {
                var handler = sinonSpy();
                this.server.respondWith("GET", /\/people\/(\d+)/, handler);
                var xhr = new FakeXMLHttpRequest();
                xhr.respond = sinonSpy();
                xhr.open("GET", "/people/3");
                xhr.send();

                this.server.respond();

                assert(handler.called);
                assert.equals(handler.args[0], [xhr, "3"]);
            });
        });

        describe("respond with fake HTTP Verb", function () {
            beforeEach(function () {
                this.server = sinonFakeServer.create();

                this.request = new FakeXMLHttpRequest();
                this.request.open("post", "/path", true);
                this.request.send("_method=delete");
                sinonSpy(this.request, "respond");
            });

            afterEach(function () {
                this.server.restore();
            });

            it("does not respond to DELETE request with _method parameter", function () {
                this.server.respondWith("DELETE", "", "");

                this.server.respond();

                assert.equals(this.request.respond.args[0], [404, {}, ""]);
            });

            it("responds to 'fake' DELETE request", function () {
                this.server.fakeHTTPMethods = true;
                this.server.respondWith("DELETE", "", "OK");

                this.server.respond();

                assert.equals(this.request.respond.args[0], [200, {}, "OK"]);
            });

            it("does not respond to POST when faking DELETE", function () {
                this.server.fakeHTTPMethods = true;
                this.server.respondWith("POST", "", "OK");

                this.server.respond();

                assert.equals(this.request.respond.args[0], [404, {}, ""]);
            });

            it("does not fake method when not POSTing", function () {
                this.server.fakeHTTPMethods = true;
                this.server.respondWith("DELETE", "", "OK");

                var request = new FakeXMLHttpRequest();
                request.open("GET", "/");
                request.send();
                request.respond = sinonSpy();
                this.server.respond();

                assert.equals(request.respond.args[0], [404, {}, ""]);
            });

            it("customizes HTTP method extraction", function () {
                this.server.getHTTPMethod = function () {
                    return "PUT";
                };

                this.server.respondWith("PUT", "", "OK");

                this.server.respond();

                assert.equals(this.request.respond.args[0], [200, {}, "OK"]);
            });

            it("does not fail when getting the HTTP method from a request with no body", function () {
                var server = this.server;
                server.fakeHTTPMethods = true;

                assert.equals(server.getHTTPMethod({ method: "POST" }), "POST");
            });
        });

        describe(".autoResponse", function () {
            beforeEach(function () {
                this.get = function get(url) {
                    var request = new FakeXMLHttpRequest();
                    sinonSpy(request, "respond");
                    request.open("get", url, true);
                    request.send();
                    return request;
                };

                this.server = sinonFakeServer.create();
                this.clock = fakeTimers.useFakeTimers();
            });

            afterEach(function () {
                this.server.restore();
                this.clock.restore();
            });

            it("responds async automatically after 10ms", function () {
                this.server.autoRespond = true;
                var request = this.get("/path");

                this.clock.tick(10);

                assert.isTrue(request.respond.calledOnce);
            });

            it("normal server does not respond automatically", function () {
                var request = this.get("/path");

                this.clock.tick(100);

                assert.isTrue(!request.respond.called);
            });

            it("auto-responds only once", function () {
                this.server.autoRespond = true;
                var requests = [this.get("/path")];
                this.clock.tick(5);
                requests.push(this.get("/other"));
                this.clock.tick(5);

                assert.isTrue(requests[0].respond.calledOnce);
                assert.isTrue(requests[1].respond.calledOnce);
            });

            it("auto-responds after having already responded", function () {
                this.server.autoRespond = true;
                var requests = [this.get("/path")];
                this.clock.tick(10);
                requests.push(this.get("/other"));
                this.clock.tick(10);

                assert.isTrue(requests[0].respond.calledOnce);
                assert.isTrue(requests[1].respond.calledOnce);
            });

            it("sets auto-respond timeout to 50ms", function () {
                this.server.autoRespond = true;
                this.server.autoRespondAfter = 50;

                var request = this.get("/path");
                this.clock.tick(49);
                assert.isFalse(request.respond.called);

                this.clock.tick(1);
                assert.isTrue(request.respond.calledOnce);
            });

            it("auto-responds if two successive requests are made with a single XHR", function () {
                this.server.autoRespond = true;

                var request = this.get("/path");

                this.clock.tick(10);

                assert.isTrue(request.respond.calledOnce);

                request.open("get", "/other", true);
                request.send();

                this.clock.tick(10);

                assert.isTrue(request.respond.calledTwice);
            });

            it("auto-responds if timeout elapses between creating XHR object and sending request with it", function () {
                this.server.autoRespond = true;

                var request = new FakeXMLHttpRequest();
                sinonSpy(request, "respond");

                this.clock.tick(100);

                request.open("get", "/path", true);
                request.send();

                this.clock.tick(10);

                assert.isTrue(request.respond.calledOnce);
            });
        });

        describe(".respondImmediately", function () {
            beforeEach(function () {
                this.get = function get(url) {
                    var request = new FakeXMLHttpRequest();
                    sinonSpy(request, "respond");
                    request.open("get", url, true);
                    request.send();
                    return request;
                };

                this.server = sinonFakeServer.create();
                this.server.respondImmediately = true;
            });

            afterEach(function () {
                this.server.restore();
            });

            it("responds synchronously", function () {
                var request = this.get("/path");
                assert.isTrue(request.respond.calledOnce);
            });

            it("doesn't rely on a clock", function () {
                this.clock = fakeTimers.useFakeTimers();

                var request = this.get("/path");
                assert.isTrue(request.respond.calledOnce);

                this.clock.restore();
            });
        });

        describe(".log", function () {
            beforeEach(function () {
                this.server = sinonFakeServer.create();
            });

            afterEach(function () {
                this.server.restore();
            });

            it("logs response and request", function () {
                sinonSpy(this.server, "log");
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();
                var response = [200, {}, "Hello!"];
                this.server.respond("GET", /.*/, response);
                assert(this.server.log.calledOnce);
                assert(this.server.log.calledWithExactly(response, xhr));
            });

            it("can be overridden", function () {
                this.server.log = sinonSpy();
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/hello");
                xhr.send();
                var response = [200, {}, "Hello!"];
                this.server.respond("GET", /.*/, response);
                assert(this.server.log.calledOnce);
                assert(this.server.log.calledWithExactly(response, xhr));
            });
        });
    });
}
