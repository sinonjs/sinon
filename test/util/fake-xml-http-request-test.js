"use strict";

var referee = require("referee");
var sinonStub = require("../../lib/sinon/stub");
var sinonSpy = require("../../lib/sinon/spy");
var sinonExtend = require("../../lib/sinon/extend");
var sinonSandbox = require("../../lib/sinon/sandbox");
var sinonFakeXhr = require("../../lib/sinon/util/fake_xml_http_request");

var TextDecoder = global.TextDecoder || require("text-encoding").TextDecoder;
var FakeXMLHttpRequest = sinonFakeXhr.FakeXMLHttpRequest;
var assert = referee.assert;
var refute = referee.refute;

var globalXMLHttpRequest = global.XMLHttpRequest;
var globalActiveXObject = global.ActiveXObject;

var supportsProgressEvents = typeof ProgressEvent !== "undefined";
var supportsFormData = typeof FormData !== "undefined";
var supportsArrayBuffer = typeof ArrayBuffer !== "undefined";
var supportsBlob = (function () {
    try {
        return !!new Blob();
    } catch (e) {
        return false;
    }
})();

var fakeXhrSetUp = function () {
    this.fakeXhr = sinonFakeXhr.useFakeXMLHttpRequest();
};

var fakeXhrTearDown = function () {
    if (typeof this.fakeXhr.restore === "function") {
        this.fakeXhr.restore();
    }
};

var runWithWorkingXHROveride = function (workingXHR, test) {
    try {
        var original = sinonFakeXhr.xhr.workingXHR;
        sinonFakeXhr.xhr.workingXHR = workingXHR;
        test();
    } finally {
        sinonFakeXhr.xhr.workingXHR = original;
    }
};

var assertArrayBufferMatches = function (actual, expected, encoding) {
    assert(actual instanceof ArrayBuffer, "${0} expected to be an ArrayBuffer");
    var actualString = new TextDecoder(encoding || "utf-8").decode(actual);
    assert.same(actualString, expected, "ArrayBuffer [${0}] expected to match ArrayBuffer [${1}]");
};

var assertBlobMatches = function (actual, expected, done) {
    var actualReader = new FileReader();
    actualReader.onloadend = function () {
        assert.same(actualReader.result, expected);
        done();
    };
    actualReader.readAsText(actual);
};

var assertProgressEvent = function (event, progress) {
    assert.equals(event.loaded, progress);
    assert.equals(event.total, progress);
    assert.equals(event.lengthComputable, !!progress);
};

var assertEventOrdering = function (event, progress, callback) {
    it("should follow request sequence for " + event, function (done) {
        var expectedOrder = [
            "upload:progress",
            "upload:" + event,
            "upload:loadend",
            "xhr:progress",
            "xhr:on" + event,
            "xhr:" + event
        ];
        var eventOrder = [];

        function observe(name) {
            return function (e) {
                assertProgressEvent(e, progress);
                eventOrder.push(name);
            };
        }

        this.xhr.open("GET", "/");
        this.xhr.send();

        this.xhr.upload.addEventListener("progress", observe("upload:progress"));
        this.xhr.upload.addEventListener("loadend", observe("upload:loadend"));
        this.xhr.addEventListener("progress", observe("xhr:progress"));
        this.xhr.addEventListener("loadend", function (e) {
            assertProgressEvent(e, progress);

            // finish next tick to allow any events that might fire
            // after loadend to trigger
            setTimeout(function () {
                assert.equals(eventOrder, expectedOrder);

                done();
            }, 1);
        });

        // listen for abort, error, and load events to make sure only
        // the expected events fire
        ["abort", "error", "load"].forEach(
            function (name) {
                this.xhr.upload.addEventListener(name, observe("upload:" + name));
                this.xhr.addEventListener(name, observe("xhr:" + name));
                this.xhr["on" + name] = observe("xhr:on" + name);
            },
            this
        );

        callback(this.xhr);
    });
};

if (typeof window !== "undefined") {
    describe("FakeXMLHttpRequest", function () {

        afterEach(function () {
            delete FakeXMLHttpRequest.onCreate;
        });

        it("is constructor", function () {
            assert.isFunction(FakeXMLHttpRequest);
            assert.same(FakeXMLHttpRequest.prototype.constructor, FakeXMLHttpRequest);
        });

        it("implements readyState constants", function () {
            assert.same(FakeXMLHttpRequest.OPENED, 1);
            assert.same(FakeXMLHttpRequest.HEADERS_RECEIVED, 2);
            assert.same(FakeXMLHttpRequest.LOADING, 3);
            assert.same(FakeXMLHttpRequest.DONE, 4);
        });

        it("calls onCreate if listener is set", function () {
            var onCreate = sinonSpy();
            FakeXMLHttpRequest.onCreate = onCreate;

            // instantiating FakeXMLHttpRequest for it's onCreate side effect
            var xhr = new FakeXMLHttpRequest(); // eslint-disable-line no-unused-vars

            assert(onCreate.called);
        });

        it("passes new object to onCreate if set", function () {
            var onCreate = sinonSpy();
            FakeXMLHttpRequest.onCreate = onCreate;

            var xhr = new FakeXMLHttpRequest();

            assert.same(onCreate.getCall(0).args[0], xhr);
        });

        describe(".withCredentials", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("property is set if we support standards CORS", function () {
                assert.equals(sinonFakeXhr.xhr.supportsCORS, "withCredentials" in this.xhr);
            });

        });

        describe(".open", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("is method", function () {
                assert.isFunction(this.xhr.open);
            });

            it("sets properties on object", function () {
                this.xhr.open("GET", "/my/url", true, "cjno", "pass");

                assert.equals(this.xhr.method, "GET");
                assert.equals(this.xhr.url, "/my/url");
                assert.isTrue(this.xhr.async);
                assert.equals(this.xhr.username, "cjno");
                assert.equals(this.xhr.password, "pass");
            });

            it("is async by default", function () {
                this.xhr.open("GET", "/my/url");

                assert.isTrue(this.xhr.async);
            });

            it("sets async to false", function () {
                this.xhr.open("GET", "/my/url", false);

                assert.isFalse(this.xhr.async);
            });

            it("sets response to empty string", function () {
                this.xhr.open("GET", "/my/url");

                assert.same(this.xhr.response, "");
            });

            it("sets responseText to empty string", function () {
                this.xhr.open("GET", "/my/url");

                assert.same(this.xhr.responseText, "");
            });

            it("sets responseXML to null", function () {
                this.xhr.open("GET", "/my/url");

                assert.isNull(this.xhr.responseXML);
            });

            it("sets requestHeaders to blank object", function () {
                this.xhr.open("GET", "/my/url");

                assert.isObject(this.xhr.requestHeaders);
                assert.equals(this.xhr.requestHeaders, {});
            });

            it("sets readyState to OPENED", function () {
                this.xhr.open("GET", "/my/url");

                assert.same(this.xhr.readyState, FakeXMLHttpRequest.OPENED);
            });

            it("sets send flag to false", function () {
                this.xhr.open("GET", "/my/url");

                assert.isFalse(this.xhr.sendFlag);
            });

            it("dispatches onreadystatechange with reset state", function () {
                var state = {};

                this.xhr.onreadystatechange = function () {
                    sinonExtend(state, this);
                };

                this.xhr.open("GET", "/my/url");

                assert.equals(state.method, "GET");
                assert.equals(state.url, "/my/url");
                assert.isTrue(state.async);
                refute.defined(state.username);
                refute.defined(state.password);
                assert.same(state.response, "");
                assert.same(state.responseText, "");
                assert.isNull(state.responseXML);
                refute.defined(state.responseHeaders);
                assert.equals(state.readyState, FakeXMLHttpRequest.OPENED);
                assert.isFalse(state.sendFlag);
            });
        });

        describe(".setRequestHeader", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
                this.xhr.open("GET", "/");
            });

            it("throws exception if readyState is not OPENED", function () {
                var xhr = new FakeXMLHttpRequest();

                assert.exception(function () {
                    xhr.setRequestHeader("X-EY", "No-no");
                });
            });

            it("throws exception if send flag is true", function () {
                var xhr = this.xhr;
                xhr.sendFlag = true;

                assert.exception(function () {
                    xhr.setRequestHeader("X-EY", "No-no");
                });
            });

            it("disallows unsafe headers", function () {
                var xhr = this.xhr;

                assert.exception(function () {
                    xhr.setRequestHeader("Accept-Charset", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Accept-Encoding", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Connection", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Content-Length", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Cookie", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Cookie2", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Content-Transfer-Encoding", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Date", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Expect", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Host", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Keep-Alive", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Referer", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("TE", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Trailer", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Transfer-Encoding", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Upgrade", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("User-Agent", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Via", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Proxy-Oops", "");
                });

                assert.exception(function () {
                    xhr.setRequestHeader("Sec-Oops", "");
                });
            });

            it("sets header and value", function () {
                this.xhr.setRequestHeader("X-Fake", "Yeah!");

                assert.equals(this.xhr.requestHeaders, { "X-Fake": "Yeah!" });
            });

            it("appends same-named header values", function () {
                this.xhr.setRequestHeader("X-Fake", "Oh");
                this.xhr.setRequestHeader("X-Fake", "yeah!");

                assert.equals(this.xhr.requestHeaders, { "X-Fake": "Oh,yeah!" });
            });
        });

        describe(".send", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("throws if request is not open", function () {
                var xhr = new FakeXMLHttpRequest();

                assert.exception(function () {
                    xhr.send();
                });
            });

            it("throws if send flag is true", function () {
                var xhr = this.xhr;
                xhr.open("GET", "/");
                xhr.sendFlag = true;

                assert.exception(function () {
                    xhr.send();
                });
            });

            it("sets HEAD body to null", function () {
                this.xhr.open("HEAD", "/");
                this.xhr.send("Data");

                assert.isNull(this.xhr.requestBody);
            });

            if (supportsFormData) {
                describe("sets mime to text/plain", function () {
                    it("test", function () {
                        this.xhr.open("POST", "/");
                        this.xhr.send("Data");

                        assert.equals(this.xhr.requestHeaders["Content-Type"], "text/plain;charset=utf-8");
                    });
                });
            }

            it("does not override mime", function () {
                this.xhr.open("POST", "/");
                this.xhr.setRequestHeader("Content-Type", "text/html");
                this.xhr.send("Data");

                assert.equals(this.xhr.requestHeaders["Content-Type"], "text/html;charset=utf-8");
            });

            it("does not add new 'Content-Type' header if 'content-type' already exists", function () {
                this.xhr.open("POST", "/");
                this.xhr.setRequestHeader("content-type", "application/json");
                this.xhr.send("Data");

                assert.equals(this.xhr.requestHeaders["Content-Type"], undefined);
                assert.equals(this.xhr.requestHeaders["content-type"], "application/json;charset=utf-8");
            });

            if (supportsFormData) {
                describe("does not add 'Content-Type' header if data is FormData", function () {
                    it("test", function () {
                        this.xhr.open("POST", "/");
                        var formData = new FormData();
                        formData.append("username", "biz");
                        this.xhr.send("Data");

                        assert.equals(this.xhr.requestHeaders["content-type"], undefined);
                    });
                });
            }

            it("sets request body to string data for GET", function () {
                this.xhr.open("GET", "/");
                this.xhr.send("Data");

                assert.equals(this.xhr.requestBody, "Data");
            });

            it("sets request body to string data for POST", function () {
                this.xhr.open("POST", "/");
                this.xhr.send("Data");

                assert.equals(this.xhr.requestBody, "Data");
            });

            it("sets error flag to false", function () {
                this.xhr.open("POST", "/");
                this.xhr.send("Data");

                assert.isFalse(this.xhr.errorFlag);
            });

            it("sets send flag to true", function () {
                this.xhr.open("POST", "/");
                this.xhr.send("Data");

                assert.isTrue(this.xhr.sendFlag);
            });

            it("does not set send flag to true if sync", function () {
                this.xhr.open("POST", "/", false);
                this.xhr.send("Data");

                assert.isFalse(this.xhr.sendFlag);
            });

            it("dispatches onreadystatechange", function () {
                var event, state;
                this.xhr.open("POST", "/", false);

                this.xhr.onreadystatechange = function (e) {
                    event = e;
                    state = this.readyState;
                };

                this.xhr.send("Data");

                assert.equals(state, FakeXMLHttpRequest.OPENED);
                assert.equals(event.type, "readystatechange");
                assert.defined(event.target);
            });

            it("dispatches event using DOM Event interface", function () {
                var listener = sinonSpy();
                this.xhr.open("POST", "/", false);
                this.xhr.addEventListener("readystatechange", listener);

                this.xhr.send("Data");

                assert(listener.calledOnce);
                assert.equals(listener.args[0][0].type, "readystatechange");
                assert.defined(listener.args[0][0].target);
            });

            it("dispatches onSend callback if set", function () {
                this.xhr.open("POST", "/", true);
                var callback = sinonSpy();
                this.xhr.onSend = callback;

                this.xhr.send("Data");

                assert(callback.called);
            });

            it("dispatches onSend with request as argument", function () {
                this.xhr.open("POST", "/", true);
                var callback = sinonSpy();
                this.xhr.onSend = callback;

                this.xhr.send("Data");

                assert(callback.calledWith(this.xhr));
            });

            it("dispatches onSend when async", function () {
                this.xhr.open("POST", "/", false);
                var callback = sinonSpy();
                this.xhr.onSend = callback;

                this.xhr.send("Data");

                assert(callback.calledWith(this.xhr));
            });
        });

        describe(".setResponseHeaders", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("sets request headers", function () {
                var object = { id: 42 };
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders(object);

                assert.equals(this.xhr.responseHeaders, object);
            });

            it("calls readyStateChange with HEADERS_RECEIVED", function () {
                var object = { id: 42 };
                this.xhr.open("GET", "/");
                this.xhr.send();
                var spy = this.xhr.readyStateChange = sinonSpy();

                this.xhr.setResponseHeaders(object);

                assert(spy.calledWith(FakeXMLHttpRequest.HEADERS_RECEIVED));
            });

            it("does not call readyStateChange if sync", function () {
                var object = { id: 42 };
                this.xhr.open("GET", "/", false);
                this.xhr.send();
                var spy = this.xhr.readyStateChange = sinonSpy();

                this.xhr.setResponseHeaders(object);

                assert.isFalse(spy.called);
            });

            it("changes readyState to HEADERS_RECEIVED if sync", function () {
                var object = { id: 42 };
                this.xhr.open("GET", "/", false);
                this.xhr.send();

                this.xhr.setResponseHeaders(object);

                assert.equals(this.xhr.readyState, FakeXMLHttpRequest.HEADERS_RECEIVED);
            });

            it("throws if headers were already set", function () {
                var xhr = this.xhr;

                xhr.open("GET", "/", false);
                xhr.send();
                xhr.setResponseHeaders({});

                assert.exception(function () {
                    xhr.setResponseHeaders({});
                });
            });
        });

        describe(".setResponseBodyAsync", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders({});
            });

            it("invokes onreadystatechange handler with LOADING state", function () {
                var spy = sinonSpy();
                this.xhr.readyStateChange = spy;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert(spy.calledWith(FakeXMLHttpRequest.LOADING));
            });

            it("invokes onreadystatechange handler for each 10 byte chunk", function () {
                var spy = sinonSpy();
                this.xhr.readyStateChange = spy;
                this.xhr.chunkSize = 10;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert.equals(spy.callCount, 4);
            });

            it("invokes onreadystatechange handler for each x byte chunk", function () {
                var spy = sinonSpy();
                this.xhr.readyStateChange = spy;
                this.xhr.chunkSize = 20;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert.equals(spy.callCount, 3);
            });

            it("invokes onreadystatechange handler with partial data", function () {
                var pieces = [];
                var mismatch = false;

                this.xhr.readyStateChange = function () {
                    if (this.response !== this.responseText) {
                        mismatch = true;
                    }
                    pieces.push(this.responseText);
                };
                this.xhr.chunkSize = 9;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert.isFalse(mismatch);
                assert.equals(pieces[1], "Some text");
            });

            it("calls onreadystatechange with DONE state", function () {
                var spy = sinonSpy();
                this.xhr.readyStateChange = spy;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert(spy.calledWith(FakeXMLHttpRequest.DONE));
            });

            it("throws if not open", function () {
                var xhr = new FakeXMLHttpRequest();

                assert.exception(function () {
                    xhr.setResponseBody("");
                });
            });

            it("throws if no headers received", function () {
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/");
                xhr.send();

                assert.exception(function () {
                    xhr.setResponseBody("");
                });
            });

            it("throws if body was already sent", function () {
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/");
                xhr.send();
                xhr.setResponseHeaders({});
                xhr.setResponseBody("");

                assert.exception(function () {
                    xhr.setResponseBody("");
                });
            });

            it("throws if body is not a string", function () {
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/");
                xhr.send();
                xhr.setResponseHeaders({});

                assert.exception(function () {
                    xhr.setResponseBody({});
                }, "InvalidBodyException");
            });

            if (supportsArrayBuffer) {
                describe("with ArrayBuffer support", function () {
                    it("invokes onreadystatechange for each chunk when responseType='arraybuffer'", function () {
                        var spy = sinonSpy();
                        this.xhr.readyStateChange = spy;
                        this.xhr.chunkSize = 10;

                        this.xhr.responseType = "arraybuffer";

                        this.xhr.setResponseBody("Some text goes in here ok?");

                        assert.equals(spy.callCount, 4);
                    });
                });
            }

            if (supportsBlob) {
                describe("with Blob support", function () {
                    it("invokes onreadystatechange handler for each 10 byte chunk when responseType='blob'",
                        function () {
                            var spy = sinonSpy();
                            this.xhr.readyStateChange = spy;
                            this.xhr.chunkSize = 10;

                            this.xhr.responseType = "blob";

                            this.xhr.setResponseBody("Some text goes in here ok?");

                            assert.equals(spy.callCount, 4);
                        });
                });
            }
        });

        describe(".setResponseBodySync", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
                this.xhr.open("GET", "/", false);
                this.xhr.send();
                this.xhr.setResponseHeaders({});
            });

            it("does not throw", function () {
                var xhr = this.xhr;

                refute.exception(function () {
                    xhr.setResponseBody("");
                });
            });

            it("sets readyState to DONE", function () {
                this.xhr.setResponseBody("");

                assert.equals(this.xhr.readyState, FakeXMLHttpRequest.DONE);
            });

            it("throws if responding to request twice", function () {
                var xhr = this.xhr;
                this.xhr.setResponseBody("");

                assert.exception(function () {
                    xhr.setResponseBody("");
                });
            });

            it("calls onreadystatechange for sync request with DONE state", function () {
                var spy = sinonSpy();
                this.xhr.readyStateChange = spy;

                this.xhr.setResponseBody("Some text goes in here ok?");

                assert(spy.calledWith(FakeXMLHttpRequest.DONE));
            });

            it("simulates synchronous request", function () {
                var xhr = new FakeXMLHttpRequest();

                xhr.onSend = function () {
                    this.setResponseHeaders({});
                    this.setResponseBody("Oh yeah");
                };

                xhr.open("GET", "/", false);
                xhr.send();

                assert.equals(xhr.responseText, "Oh yeah");
            });
        });

        describe(".respond", function () {
            beforeEach(function () {
                this.sandbox = sinonSandbox.create();
                this.xhr = new FakeXMLHttpRequest({
                    setTimeout: this.sandbox.spy(),
                    useImmediateExceptions: false
                });
                this.xhr.open("GET", "/");
                var spy = this.spy = sinonSpy();

                this.xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        spy.call(this);
                    }
                };

                this.xhr.send();
            });

            afterEach(function () {
                this.sandbox.restore();
            });

            it("fire onload event", function () {
                this.onload = this.spy;
                this.xhr.respond(200, {}, "");
                assert.equals(this.spy.callCount, 1);
            });

            it("fire onload event with this set to the XHR object", function (done) {
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/");

                xhr.onload = function () {
                    assert.same(this, xhr);

                    done();
                };

                xhr.send();
                xhr.respond(200, {}, "");
            });

            it("calls readystate handler with readyState DONE once", function () {
                this.xhr.respond(200, {}, "");

                assert.equals(this.spy.callCount, 1);
            });

            it("defaults to status 200, no headers, and blank body", function () {
                this.xhr.respond();

                assert.equals(this.xhr.status, 200);
                assert.equals(this.xhr.getAllResponseHeaders(), "");
                assert.equals(this.xhr.responseText, "");
            });

            it("sets status", function () {
                this.xhr.respond(201);

                assert.equals(this.xhr.status, 201);
            });

            it("sets status text", function () {
                this.xhr.respond(201);

                assert.equals(this.xhr.statusText, "Created");
            });

            it("sets headers", function () {
                sinonSpy(this.xhr, "setResponseHeaders");
                var responseHeaders = { some: "header", value: "over here" };
                this.xhr.respond(200, responseHeaders);

                assert.equals(this.xhr.setResponseHeaders.args[0][0], responseHeaders);
            });

            it("sets response text", function () {
                this.xhr.respond(200, {}, "'tis some body text");

                assert.equals(this.xhr.responseText, "'tis some body text");
            });

            it("completes request when onreadystatechange fails", function () {
                this.xhr.onreadystatechange = sinonStub().throws();
                this.xhr.respond(200, {}, "'tis some body text");

                assert.equals(this.xhr.onreadystatechange.callCount, 4);
            });

            it("sets status before transitioning to readyState HEADERS_RECEIVED", function () {
                var status, statusText;
                this.xhr.onreadystatechange = function () {
                    if (this.readyState === 2) {
                        status = this.status;
                        statusText = this.statusText;
                    }
                };
                this.xhr.respond(204);

                assert.equals(status, 204);
                assert.equals(statusText, "No Content");
            });
        });

        describe(".getResponseHeader", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("returns null if request is not finished", function () {
                this.xhr.open("GET", "/");
                assert.isNull(this.xhr.getResponseHeader("Content-Type"));
            });

            it("returns null if header is Set-Cookie", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                assert.isNull(this.xhr.getResponseHeader("Set-Cookie"));
            });

            it("returns null if header is Set-Cookie2", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                assert.isNull(this.xhr.getResponseHeader("Set-Cookie2"));
            });

            it("returns header value", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

                assert.equals(this.xhr.getResponseHeader("Content-Type"), "text/html");
            });

            it("returns header value if sync", function () {
                this.xhr.open("GET", "/", false);
                this.xhr.send();
                this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

                assert.equals(this.xhr.getResponseHeader("Content-Type"), "text/html");
            });

            it("returns null if header is not set", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                assert.isNull(this.xhr.getResponseHeader("Content-Type"));
            });

            it("returns headers case insensitive", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

                assert.equals(this.xhr.getResponseHeader("content-type"), "text/html");
            });
        });

        describe(".getAllResponseHeaders", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("returns empty string if request is not finished", function () {
                this.xhr.open("GET", "/");
                assert.equals(this.xhr.getAllResponseHeaders(), "");
            });

            it("does not return Set-Cookie and Set-Cookie2 headers", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders({
                    "Set-Cookie": "Hey",
                    "Set-Cookie2": "There"
                });

                assert.equals(this.xhr.getAllResponseHeaders(), "");
            });

            it("returns headers", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.setResponseHeaders({
                    "Content-Type": "text/html",
                    "Set-Cookie2": "There",
                    "Content-Length": "32"
                });

                assert.equals(this.xhr.getAllResponseHeaders(), "Content-Type: text/html\r\nContent-Length: 32\r\n");
            });

            it("returns headers if sync", function () {
                this.xhr.open("GET", "/", false);
                this.xhr.send();
                this.xhr.setResponseHeaders({
                    "Content-Type": "text/html",
                    "Set-Cookie2": "There",
                    "Content-Length": "32"
                });

                assert.equals(this.xhr.getAllResponseHeaders(), "Content-Type: text/html\r\nContent-Length: 32\r\n");
            });
        });

        describe(".abort", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("sets aborted flag to true", function () {
                this.xhr.abort();

                assert.isTrue(this.xhr.aborted);
            });

            it("sets response to empty string", function () {
                this.xhr.response = "Partial data";

                this.xhr.abort();

                assert.same(this.xhr.response, "");
            });

            it("sets responseText to empty string", function () {
                this.xhr.responseText = "Partial data";

                this.xhr.abort();

                assert.same(this.xhr.responseText, "");
            });

            it("sets errorFlag to true", function () {
                this.xhr.abort();

                assert.isTrue(this.xhr.errorFlag);
            });

            it("nulls request headers", function () {
                this.xhr.open("GET", "/");
                this.xhr.setRequestHeader("X-Test", "Sumptn");

                this.xhr.abort();

                assert.equals(this.xhr.requestHeaders, {});
            });

            it("does not have undefined response headers", function () {
                this.xhr.open("GET", "/");

                this.xhr.abort();

                assert.defined(this.xhr.responseHeaders);
            });

            it("nulls response headers", function () {
                this.xhr.open("GET", "/");

                this.xhr.abort();

                assert.equals(this.xhr.responseHeaders, {});
            });

            it("sets state to DONE if sent before", function () {
                var readyState;
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.onreadystatechange = function () {
                    readyState = this.readyState;
                };

                this.xhr.abort();

                assert.equals(readyState, FakeXMLHttpRequest.DONE);
            });

            it("sets send flag to false if sent before", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.abort();

                assert.isFalse(this.xhr.sendFlag);
            });

            it("dispatches readystatechange event if sent before", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.onreadystatechange = sinonStub();

                this.xhr.abort();

                assert(this.xhr.onreadystatechange.called);
            });

            it("sets readyState to unsent if sent before", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.abort();

                assert.equals(this.xhr.readyState, FakeXMLHttpRequest.UNSENT);
            });

            it("does not dispatch readystatechange event if readyState is unsent", function () {
                this.xhr.onreadystatechange = sinonStub();

                this.xhr.abort();

                assert.isFalse(this.xhr.onreadystatechange.called);
            });

            it("does not dispatch readystatechange event if readyState is opened but not sent", function () {
                this.xhr.open("GET", "/");
                this.xhr.onreadystatechange = sinonStub();

                this.xhr.abort();

                assert.isFalse(this.xhr.onreadystatechange.called);
            });

            assertEventOrdering("abort", 0, function (xhr) {
                xhr.abort();
            });
        });

        describe(".error", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("sets response to empty string", function () {
                this.xhr.response = "Partial data";

                this.xhr.error();

                assert.same(this.xhr.response, "");
            });

            it("sets responseText to empty string", function () {
                this.xhr.responseText = "Partial data";

                this.xhr.error();

                assert.same(this.xhr.responseText, "");
            });

            it("sets errorFlag to true", function () {
                this.xhr.errorFlag = false;
                this.xhr.error();

                assert.isTrue(this.xhr.errorFlag);
            });

            it("nulls request headers", function () {
                this.xhr.open("GET", "/");
                this.xhr.setRequestHeader("X-Test", "Sumptn");

                this.xhr.error();

                assert.equals(this.xhr.requestHeaders, {});
            });

            it("nulls response headers", function () {
                this.xhr.open("GET", "/");

                this.xhr.error();

                assert.equals(this.xhr.responseHeaders, {});
            });

            it("dispatches readystatechange event if sent before", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();
                this.xhr.onreadystatechange = sinonStub();

                this.xhr.error();

                assert(this.xhr.onreadystatechange.called);
            });

            it("sets readyState to DONE", function () {
                this.xhr.open("GET", "/");

                this.xhr.error();

                assert.equals(this.xhr.readyState, FakeXMLHttpRequest.DONE);
            });

            assertEventOrdering("error", 0, function (xhr) {
                xhr.error();
            });
        });

        describe(".response", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("is initially the empty string if responseType === ''", function () {
                this.xhr.responseType = "";
                this.xhr.open("GET", "/");
                assert.same(this.xhr.response, "");
            });

            it("is initially the empty string if responseType === 'text'", function () {
                this.xhr.responseType = "text";
                this.xhr.open("GET", "/");
                assert.same(this.xhr.response, "");
            });

            it("is initially null if responseType === 'json'", function () {
                this.xhr.responseType = "json";
                this.xhr.open("GET", "/");
                assert.isNull(this.xhr.response);
            });

            it("is initially null if responseType === 'document'", function () {
                this.xhr.responseType = "document";
                this.xhr.open("GET", "/");
                assert.isNull(this.xhr.response);
            });

            it("is the empty string when the response body is empty", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, {}, "");

                assert.same(this.xhr.response, "");
            });

            it("parses JSON for responseType='json'", function () {
                this.xhr.responseType = "json";
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify({foo: true}));

                var response = this.xhr.response;
                assert.isObject(response);
                assert.isTrue(response.foo);
            });

            it("does not parse JSON if responseType!='json'", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                var responseText = JSON.stringify({foo: true});

                this.xhr.respond(200, { "Content-Type": "application/json" },
                                 responseText);

                var response = this.xhr.response;
                assert.isString(response);
                assert.equals(response, responseText);
            });

            if (supportsArrayBuffer) {
                describe("with ArrayBuffer support", function () {
                    it("is initially null if responseType === 'arraybuffer'", function () {
                        this.xhr.responseType = "arraybuffer";
                        this.xhr.open("GET", "/");
                        assert.isNull(this.xhr.response);
                    });

                    it("defaults to empty ArrayBuffer response", function () {
                        this.xhr.responseType = "arraybuffer";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond();
                        assertArrayBufferMatches(this.xhr.response, "");
                    });

                    it("returns ArrayBuffer when responseType='arraybuffer'", function () {
                        this.xhr.responseType = "arraybuffer";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond(200, { "Content-Type": "application/octet-stream" }, "a test buffer");

                        assertArrayBufferMatches(this.xhr.response, "a test buffer");
                    });

                    it("returns binary data correctly when responseType='arraybuffer'", function () {
                        this.xhr.responseType = "arraybuffer";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond(200, { "Content-Type": "application/octet-stream" }, "\xFF");

                        assertArrayBufferMatches(this.xhr.response, "\xFF");
                    });
                });
            }

            if (supportsBlob) {
                describe("with Blob support", function () {
                    it("is initially null if responseType === 'blob'", function () {
                        this.xhr.responseType = "blob";
                        this.xhr.open("GET", "/");
                        assert.isNull(this.xhr.response);
                    });

                    it("defaults to empty Blob response", function (done) {
                        this.xhr.responseType = "blob";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond();

                        assertBlobMatches(this.xhr.response, "", done);
                    });

                    it("returns blob with correct data", function (done) {
                        this.xhr.responseType = "blob";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond(200, { "Content-Type": "application/octet-stream" }, "a test blob");

                        assertBlobMatches(this.xhr.response, "a test blob", done);
                    });

                    it("returns blob with correct binary data", function (done) {
                        this.xhr.responseType = "blob";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        this.xhr.respond(200, { "Content-Type": "application/octet-stream" }, "\xFF");

                        assertBlobMatches(this.xhr.response, "\xFF", done);
                    });

                    it("does parse utf-8 content outside ASCII range properly", function (done) {
                        this.xhr.responseType = "blob";
                        this.xhr.open("GET", "/");
                        this.xhr.send();

                        var responseText = JSON.stringify({foo: "♥"});

                        this.xhr.respond(200, { "Content-Type": "application/octet-stream" },
                                       responseText);

                        assertBlobMatches(this.xhr.response, responseText, done);
                    });
                });
            }
        });

        describe(".responseXML", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
            });

            it("is initially null", function () {
                this.xhr.open("GET", "/");
                assert.isNull(this.xhr.responseXML);
            });

            it("is null when the response body is empty", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, {}, "");

                assert.isNull(this.xhr.responseXML);
            });

            it("parses XML for application/xml", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "application/xml" },
                                 "<div><h1>Hola!</h1></div>");

                var doc = this.xhr.responseXML;
                var elements = doc.documentElement.getElementsByTagName("h1");
                assert.equals(elements.length, 1);
                assert.equals(elements[0].tagName, "h1");
            });

            it("parses XML for text/xml", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "text/xml" },
                                 "<div><h1>Hola!</h1></div>");

                refute.isNull(this.xhr.responseXML);
            });

            it("parses XML for custom xml content type", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "application/text+xml" },
                                 "<div><h1>Hola!</h1></div>");

                refute.isNull(this.xhr.responseXML);
            });

            it("parses XML with no Content-Type", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, {}, "<div><h1>Hola!</h1></div>");

                var doc = this.xhr.responseXML;
                var elements = doc.documentElement.getElementsByTagName("h1");
                assert.equals(elements.length, 1);
                assert.equals(elements[0].tagName, "h1");
            });

            it("does not parse XML with Content-Type text/plain", function () {
                this.xhr.open("GET", "/");
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "text/plain" }, "<div></div>");

                assert.isNull(this.xhr.responseXML);
            });

            it("does not parse XML with Content-Type text/plain if sync", function () {
                this.xhr.open("GET", "/", false);
                this.xhr.send();

                this.xhr.respond(200, { "Content-Type": "text/plain" }, "<div></div>");

                assert.isNull(this.xhr.responseXML);
            });
        });

        describe("stub XHR", function () {
            beforeEach(fakeXhrSetUp);
            afterEach(fakeXhrTearDown);

            it("returns FakeXMLHttpRequest constructor", function () {
                assert.same(this.fakeXhr, FakeXMLHttpRequest);
            });

            it("temporarily blesses FakeXMLHttpRequest with restore method", function () {
                assert.isFunction(this.fakeXhr.restore);
            });

            it("calling restore removes temporary method", function () {
                this.fakeXhr.restore();

                refute.defined(this.fakeXhr.restore);
            });

            it("removes XMLHttpRequest onCreate listener", function () {
                FakeXMLHttpRequest.onCreate = function () {};

                this.fakeXhr.restore();

                refute.defined(FakeXMLHttpRequest.onCreate);
            });

            it("optionally keeps XMLHttpRequest onCreate listener", function () {
                var onCreate = function () {};
                FakeXMLHttpRequest.onCreate = onCreate;

                this.fakeXhr.restore(true);

                assert.same(FakeXMLHttpRequest.onCreate, onCreate);
            });
        });

        if (typeof XMLHttpRequest !== "undefined") {
            describe(".filtering", function () {
                beforeEach(function () {
                    FakeXMLHttpRequest.useFilters = true;
                    FakeXMLHttpRequest.filters = [];
                    sinonFakeXhr.useFakeXMLHttpRequest();
                });

                afterEach(function () {
                    FakeXMLHttpRequest.useFilters = false;
                    FakeXMLHttpRequest.restore();
                    if (FakeXMLHttpRequest.defake.restore) {
                        FakeXMLHttpRequest.defake.restore();
                    }
                });

                it("does not defake XHR requests that don't match a filter", function () {
                    sinonStub(FakeXMLHttpRequest, "defake");

                    FakeXMLHttpRequest.addFilter(function () {
                        return false;
                    });
                    new XMLHttpRequest().open("GET", "http://example.com");

                    refute(FakeXMLHttpRequest.defake.called);
                });

                it("defakes XHR requests that match a filter", function () {
                    sinonStub(FakeXMLHttpRequest, "defake");

                    FakeXMLHttpRequest.addFilter(function () {
                        return true;
                    });
                    new XMLHttpRequest().open("GET", "http://example.com");

                    assert(FakeXMLHttpRequest.defake.calledOnce);
                });
            });
        }

        describe("defaked XHR", function () {
            beforeEach(function () {
                this.fakeXhr = new FakeXMLHttpRequest();
            });

            it("updates attributes from working XHR object when ready state changes", function () {
                var workingXHRInstance,
                    readyStateCb;
                var workingXHROverride = function () {
                    workingXHRInstance = this;
                    this.addEventListener = function (str, fn) {
                        readyStateCb = fn;
                    };
                    this.open = function () {};
                };
                var fakeXhr = this.fakeXhr;
                runWithWorkingXHROveride(workingXHROverride, function () {
                    FakeXMLHttpRequest.defake(fakeXhr, []);
                    workingXHRInstance.statusText = "This is the status text of the real XHR";
                    workingXHRInstance.readyState = 4;
                    readyStateCb();
                    assert.equals(fakeXhr.statusText, "This is the status text of the real XHR");
                });
            });

            it("passes on methods to working XHR object", function () {
                var workingXHRInstance,
                    spy;
                var workingXHROverride = function () {
                    workingXHRInstance = this;
                    this.addEventListener = this.open = function () {};
                };
                var fakeXhr = this.fakeXhr;
                runWithWorkingXHROveride(workingXHROverride, function () {
                    FakeXMLHttpRequest.defake(fakeXhr, []);
                    workingXHRInstance.getResponseHeader = spy = sinonSpy();
                    fakeXhr.getResponseHeader();
                    assert(spy.calledOnce);
                });
            });

            it("calls legacy onreadystatechange handlers with target set to fakeXHR", function () {
                var spy,
                    readyStateCb;
                var workingXHROverride = function () {
                    this.addEventListener = function (str, fn) {
                        readyStateCb = fn;
                    };
                    this.open = function () {};
                };
                var fakeXhr = this.fakeXhr;

                runWithWorkingXHROveride(workingXHROverride, function () {
                    FakeXMLHttpRequest.defake(fakeXhr, []);
                    fakeXhr.onreadystatechange = spy = sinonSpy();
                    readyStateCb();
                    assert(spy.calledOnce);

                    // Fix to make weinre work
                    assert.isObject(spy.args[0][0]);
                    assert.equals(spy.args[0][0].target, fakeXhr);
                });
            });

            it("performs initial readystatechange on opening when filters are being used, but don't match",
                function () {
                    try {
                        FakeXMLHttpRequest.useFilters = true;
                        var spy = sinonSpy();
                        this.fakeXhr.addEventListener("readystatechange", spy);
                        this.fakeXhr.open("GET", "http://example.com", true);
                        assert(spy.calledOnce);
                    } finally {
                        FakeXMLHttpRequest.useFilters = false;
                    }
                });
        });

        describe("defaked XHR filters", function () {
            beforeEach(function () {
                FakeXMLHttpRequest.useFilters = true;
                FakeXMLHttpRequest.filters = [];
                sinonFakeXhr.useFakeXMLHttpRequest();
                FakeXMLHttpRequest.addFilter(function () {
                    return true;
                });
            });

            afterEach(function () {
                FakeXMLHttpRequest.useFilters = false;
                FakeXMLHttpRequest.filters = [];
                FakeXMLHttpRequest.restore();
            });

            it.skip("loads resource asynchronously", function (done) {
                var req = new XMLHttpRequest();

                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        assert.match(this.responseText, /loaded successfully/);
                        assert.match(this.response, /loaded successfully/);
                        done();
                    }
                };

                req.open("GET", "/test/resources/xhr_target.txt", true);
                req.send();
            });

            it.skip("loads resource synchronously", function () {
                var req = new XMLHttpRequest();
                req.open("GET", "/test/resources/xhr_target.txt", false);
                req.send();

                assert.match(req.responseText, /loaded successfully/);
                assert.match(req.response, /loaded successfully/);
            });
        });

        if (typeof ActiveXObject === "undefined") {
            describe("missing ActiveXObject", function () {
                beforeEach(fakeXhrSetUp);
                afterEach(fakeXhrTearDown);

                it("does not expose ActiveXObject", function () {
                    assert.equals(typeof ActiveXObject, "undefined");
                });

                it("does not expose ActiveXObject when restored", function () {
                    this.fakeXhr.restore();

                    assert.equals(typeof ActiveXObject, "undefined");
                });
            });
        } else {
            describe("native ActiveXObject", function () {
                beforeEach(fakeXhrSetUp);
                afterEach(fakeXhrTearDown);

                it("hijacks ActiveXObject", function () {
                    refute.same(global.ActiveXObject, globalActiveXObject);
                    refute.same(global.ActiveXObject, globalActiveXObject);
                    refute.same(ActiveXObject, globalActiveXObject); // eslint-disable-line no-undef
                });

                it("restores global ActiveXObject", function () {
                    this.fakeXhr.restore();

                    assert.same(global.ActiveXObject, globalActiveXObject);
                    assert.same(global.ActiveXObject, globalActiveXObject);
                    assert.same(ActiveXObject, globalActiveXObject); // eslint-disable-line no-undef
                });

                it("creates FakeXHR object with ActiveX Microsoft.XMLHTTP", function () {
                    var xhr = new ActiveXObject("Microsoft.XMLHTTP"); // eslint-disable-line no-undef

                    assert(xhr instanceof FakeXMLHttpRequest);
                });

                it("creates FakeXHR object with ActiveX Msxml2.XMLHTTP", function () {
                    var xhr = new ActiveXObject("Msxml2.XMLHTTP"); // eslint-disable-line no-undef

                    assert(xhr instanceof FakeXMLHttpRequest);
                });

                it("creates FakeXHR object with ActiveX Msxml2.XMLHTTP.3.0", function () {
                    var xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0"); // eslint-disable-line no-undef

                    assert(xhr instanceof FakeXMLHttpRequest);
                });

                it("creates FakeXHR object with ActiveX Msxml2.XMLHTTP.6.0", function () {
                    var xhr = new ActiveXObject("Msxml2.XMLHTTP.6.0"); // eslint-disable-line no-undef

                    assert(xhr instanceof FakeXMLHttpRequest);
                });
            });
        }

        if (typeof XMLHttpRequest === "undefined") {
            describe("missing native XHR", function () {
                beforeEach(fakeXhrSetUp);
                afterEach(fakeXhrTearDown);

                it("does not expose XMLHttpRequest", function () {
                    assert.equals(typeof XMLHttpRequest, "undefined");
                });

                it("does not expose XMLHttpRequest after restore", function () {
                    this.fakeXhr.restore();

                    assert.equals(typeof XMLHttpRequest, "undefined");
                });
            });
        } else {
            describe("native XHR", function () {
                beforeEach(fakeXhrSetUp);
                afterEach(fakeXhrTearDown);

                it("replaces global XMLHttpRequest", function () {
                    refute.same(XMLHttpRequest, globalXMLHttpRequest);
                    assert.same(XMLHttpRequest, FakeXMLHttpRequest);
                });

                it("restores global XMLHttpRequest", function () {
                    this.fakeXhr.restore();
                    assert.same(global.XMLHttpRequest, globalXMLHttpRequest);
                });
            });
        }

        describe("progress events", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
                this.xhr.open("GET", "/some/url");
            });

            it("triggers 'loadstart' event on #send", function (done) {
                this.xhr.addEventListener("loadstart", function () {
                    assert(true);

                    done();
                });

                this.xhr.send();
            });

            it("triggers 'loadstart' with event target set to the XHR object", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("loadstart", function (event) {
                    assert.same(xhr, event.target);

                    done();
                });

                this.xhr.send();
            });

            it("calls #onloadstart on #send", function (done) {
                this.xhr.onloadstart = function () {
                    assert(true);

                    done();
                };

                this.xhr.send();
            });

            it("triggers 'load' event on success", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("load", function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    refute.equals(xhr.status, 0);

                    done();
                });

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            it("triggers 'load' event on for non-200 events", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("load", function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    assert.equals(xhr.status, 500);

                    done();
                });

                this.xhr.send();
                this.xhr.respond(500, {}, "");
            });

            it("triggers 'load' with event target set to the XHR object", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("load", function (event) {
                    assert.same(xhr, event.target);

                    done();
                });

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            it("calls #onload on success", function (done) {
                var xhr = this.xhr;

                this.xhr.onload = function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    refute.equals(xhr.status, 0);

                    done();
                };

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            it("calls #onload for non-200 events", function (done) {
                var xhr = this.xhr;

                this.xhr.onload = function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    assert.equals(xhr.status, 500);

                    done();
                };

                this.xhr.send();
                this.xhr.respond(500, {}, "");
            });

            it("does not trigger 'load' event on abort", function (done) {
                this.xhr.addEventListener("load", function () {
                    assert(false);
                });

                this.xhr.addEventListener("abort", function () {
                    assert(true);

                    // finish on next tick
                    setTimeout(done, 0);
                });

                this.xhr.send();
                this.xhr.abort();
            });

            it("triggers 'abort' event on cancel", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("abort", function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    assert.equals(xhr.status, 0);

                    setTimeout(function () {
                        assert.equals(xhr.readyState, FakeXMLHttpRequest.UNSENT);
                        done();
                    }, 0);
                });

                this.xhr.send();
                this.xhr.abort();
            });

            it("triggers 'abort' with event target set to the XHR object", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("abort", function (event) {
                    assert.same(xhr, event.target);

                    done();
                });

                this.xhr.send();
                this.xhr.abort();
            });

            it("calls #onabort on cancel", function (done) {
                var xhr = this.xhr;

                this.xhr.onabort = function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    assert.equals(xhr.status, 0);

                    setTimeout(function () {
                        assert.equals(xhr.readyState, FakeXMLHttpRequest.UNSENT);
                        done();
                    }, 0);
                };

                this.xhr.send();
                this.xhr.abort();
            });

            it("triggers 'loadend' event at the end", function (done) {
                this.xhr.addEventListener("loadend", function (e) {
                    assertProgressEvent(e, 100);
                    assert(true);

                    done();
                });

                this.xhr.send();
                this.xhr.respond(403, {}, "");
            });

            it("triggers 'loadend' with event target set to the XHR object", function (done) {
                var xhr = this.xhr;

                this.xhr.addEventListener("loadend", function (event) {
                    assertProgressEvent(event, 100);
                    assert.same(xhr, event.target);

                    done();
                });

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            it("calls #onloadend at the end", function (done) {
                this.xhr.onloadend = function (e) {
                    assertProgressEvent(e, 100);
                    assert(true);

                    done();
                };

                this.xhr.send();
                this.xhr.respond(403, {}, "");
            });

            if (supportsProgressEvents) {
                it("triggers (download) progress event when response is done", function (done) {
                    this.xhr.addEventListener("progress", function (e) {
                        assert.equals(e.total, 100);
                        assert.equals(e.loaded, 20);
                        assert.isTrue(e.lengthComputable);
                        done();
                    });
                    this.xhr.downloadProgress({
                        total: 100,
                        loaded: 20
                    });
                });
            }

            assertEventOrdering("load", 100, function (xhr) {
                xhr.respond(200, {}, "");
            });
        });

        describe("xhr.upload", function () {
            beforeEach(function () {
                this.xhr = new FakeXMLHttpRequest();
                this.xhr.open("POST", "/some/url", true);
            });

            if (supportsProgressEvents) {
                it("progress event is triggered with xhr.uploadProgress({loaded, 20, total, 100})", function (done) {
                    this.xhr.upload.addEventListener("progress", function (e) {
                        assert.equals(e.total, 100);
                        assert.equals(e.loaded, 20);
                        assert.isTrue(e.lengthComputable);
                        done();
                    });
                    this.xhr.uploadProgress({
                        total: 100,
                        loaded: 20
                    });
                });
            }

            it("triggers 'load' event on success", function (done) {
                var xhr = this.xhr;

                this.xhr.upload.addEventListener("load", function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    refute.equals(xhr.status, 0);
                    done();
                });

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            if (supportsProgressEvents) {
                it("fires event with 100% progress on 'load'", function (done) {
                    this.xhr.upload.addEventListener("progress", function (e) {
                        assert.equals(e.total, 100);
                        assert.equals(e.loaded, 100);
                        done();
                    });

                    this.xhr.send();
                    this.xhr.respond(200, {}, "");
                });
            }

            it("fires events in an order similar to a browser", function (done) {
                var xhr = this.xhr;
                var events = [];

                this.xhr.upload.addEventListener("progress", function (e) {
                    events.push(e.type);
                });
                this.xhr.upload.addEventListener("load", function (e) {
                    events.push(e.type);
                });
                this.xhr.addEventListener("readystatechange", function (e) {
                    if (xhr.readyState === 4) {
                        events.push(e.type);
                        if (supportsProgressEvents) {
                            assert.equals(events.splice(0, 1)[0], "progress");
                        }
                        assert.equals(events, ["load", "readystatechange"]);
                        done();
                    }
                });

                this.xhr.send();
                this.xhr.respond(200, {}, "");
            });

            it("calls 'abort' on cancel", function (done) {
                var xhr = this.xhr;

                this.xhr.upload.addEventListener("abort", function () {
                    assert.equals(xhr.readyState, FakeXMLHttpRequest.DONE);
                    assert.equals(xhr.status, 0);

                    setTimeout(function () {
                        assert.equals(xhr.readyState, FakeXMLHttpRequest.UNSENT);
                        done();
                    }, 0);
                });

                this.xhr.send();
                this.xhr.abort();
            });

            if (typeof CustomEvent !== "undefined") {
                describe("error event", function () {
                    it("is triggered with xhr.uploadError(new Error('foobar'))", function (done) {
                        this.xhr.upload.addEventListener("error", function (e) {
                            assert.equals(e.detail.message, "foobar");

                            done();
                        });
                        this.xhr.uploadError(new Error("foobar"));
                    });
                });
            }

            it("event listeners can be removed", function () {
                var callback = function () {};
                this.xhr.upload.addEventListener("load", callback);
                this.xhr.upload.removeEventListener("load", callback);
                assert.equals(this.xhr.upload.eventListeners.load.length, 0);
            });
        });
    });
}
