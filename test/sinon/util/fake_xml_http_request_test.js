/*jslint onevar: false, eqeqeq: false, browser: true*/
/*globals window
          jstestdriver
          XMLHttpRequest
          ActiveXObject
          testCase
          sinon
          assert
          assertSame
          assertNotSame
          assertEquals
          assertTrue
          assertFalse
          assertNull
          assertNotNull
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
"use strict";

(function (global) {
    testCase("FakeXMLHttpRequestTest", {
        tearDown: function () {
            delete sinon.FakeXMLHttpRequest.onCreate;
        },

        "should be constructor": function () {
            assertFunction(sinon.FakeXMLHttpRequest);
            assertSame(sinon.FakeXMLHttpRequest, sinon.FakeXMLHttpRequest.prototype.constructor);
        },

        "should implement readyState constants": function () {
            assertSame(1, sinon.FakeXMLHttpRequest.OPENED);
            assertSame(2, sinon.FakeXMLHttpRequest.HEADERS_RECEIVED);
            assertSame(3, sinon.FakeXMLHttpRequest.LOADING);
            assertSame(4, sinon.FakeXMLHttpRequest.DONE);
        },

        "should call onCreate if listener is set": function () {
            var onCreate = sinon.spy();
            sinon.FakeXMLHttpRequest.onCreate = onCreate;

            var xhr = new sinon.FakeXMLHttpRequest();

            assert(onCreate.called);
        },

        "should pass new object to onCreate if set": function () {
            var onCreate = sinon.spy();
            sinon.FakeXMLHttpRequest.onCreate = onCreate;

            var xhr = new sinon.FakeXMLHttpRequest();

            assertSame(xhr, onCreate.getCall(0).args[0]);
        }
    });

    testCase("FakeXMLHttpRequestOpenTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
        },

        "should be method": function () {
            assertFunction(this.xhr.open);
        },

        "should set properties on object": function () {
            this.xhr.open("GET", "/my/url", true, "cjno", "pass");

            assertEquals("GET", this.xhr.method);
            assertEquals("/my/url", this.xhr.url);
            assertTrue(this.xhr.async);
            assertEquals("cjno", this.xhr.username);
            assertEquals("pass", this.xhr.password);
        },

        "should be async by default": function () {
            this.xhr.open("GET", "/my/url");

            assertTrue(this.xhr.async);
        },

        "should set async to false": function () {
            this.xhr.open("GET", "/my/url", false);

            assertFalse(this.xhr.async);
        },

        "should set responseText to null": function () {
            this.xhr.open("GET", "/my/url");

            assertNull(this.xhr.responseText);
        },

        "should set requestHeaders to blank object": function () {
            this.xhr.open("GET", "/my/url");

            assertObject(this.xhr.requestHeaders);
            assertEquals({}, this.xhr.requestHeaders);
        },

        "should set readyState to OPENED": function () {
            this.xhr.open("GET", "/my/url");

            assertSame(sinon.FakeXMLHttpRequest.OPENED, this.xhr.readyState);
        },

        "should set send flag to false": function () {
            this.xhr.open("GET", "/my/url");

            assertFalse(this.xhr.sendFlag);
        },

        "should dispatch onreadystatechange with reset state": function () {
            var state = {};

            this.xhr.onreadystatechange = function () {
                sinon.extend(state, this);
            };

            this.xhr.open("GET", "/my/url");

            assertEquals("GET", state.method);
            assertEquals("/my/url", state.url);
            assertTrue(state.async);
            assertUndefined(state.username);
            assertUndefined(state.password);
            assertNull(state.responseText);
            assertUndefined(state.responseHeaders);
            assertEquals(sinon.FakeXMLHttpRequest.OPENED, state.readyState);
            assertFalse(state.sendFlag);
        }
    });

    testCase("FakeXMLHttpRequestSetRequestHeaderTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
        },

        "should throw exception if readyState is not OPENED": function () {
            var xhr = new sinon.FakeXMLHttpRequest();

            assertException(function () {
                xhr.setRequestHeader("X-EY", "No-no");
            });
        },

        "should throw exception if send flag is true": function () {
            var xhr = this.xhr;
            xhr.sendFlag = true;

            assertException(function () {
                xhr.setRequestHeader("X-EY", "No-no");
            });
        },

        "should disallow unsafe headers": function () {
            var xhr = this.xhr;

            assertException(function () {
                xhr.setRequestHeader("Accept-Charset", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Accept-Encoding", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Connection", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Content-Length", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Cookie", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Cookie2", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Content-Transfer-Encoding", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Date", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Expect", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Host", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Keep-Alive", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Referer", "");
            });

            assertException(function () {
                xhr.setRequestHeader("TE", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Trailer", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Transfer-Encoding", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Upgrade", "");
            });

            assertException(function () {
                xhr.setRequestHeader("User-Agent", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Via", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Proxy-Oops", "");
            });

            assertException(function () {
                xhr.setRequestHeader("Sec-Oops", "");
            });
        },

        "should set header and value": function () {
            this.xhr.setRequestHeader("X-Fake", "Yeah!");

            assertEquals({ "X-Fake": "Yeah!" }, this.xhr.requestHeaders);
        },

        "should append same-named header values": function () {
            this.xhr.setRequestHeader("X-Fake", "Oh");
            this.xhr.setRequestHeader("X-Fake", "yeah!");

            assertEquals({ "X-Fake": "Oh,yeah!" }, this.xhr.requestHeaders);
        }
    });

    testCase("FakeXMLHttpRequestSendTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
        },

        "should throw if request is not open": function () {
            var xhr = new sinon.FakeXMLHttpRequest();

            assertException(function () {
                xhr.send();
            });
        },

        "should throw if send flag is true": function () {
            var xhr = this.xhr;
            xhr.open("GET", "/");
            xhr.sendFlag = true;

            assertException(function () {
                xhr.send();
            });
        },

        "should set GET body to null": function () {
            this.xhr.open("GET", "/");
            this.xhr.send("Data");

            assertNull(this.xhr.requestBody);
        },

        "should set HEAD body to null": function () {
            this.xhr.open("HEAD", "/");
            this.xhr.send("Data");

            assertNull(this.xhr.requestBody);
        },

        "should set mime to text/plain": function () {
            this.xhr.open("POST", "/");
            this.xhr.send("Data");

            assertEquals("text/plain;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
        },

        "should not override mime": function () {
            this.xhr.open("POST", "/");
            this.xhr.setRequestHeader("Content-Type", "text/html");
            this.xhr.send("Data");

            assertEquals("text/html;charset=utf-8", this.xhr.requestHeaders["Content-Type"]);
        },

        "should set request body to string data": function () {
            this.xhr.open("POST", "/");
            this.xhr.send("Data");

            assertEquals("Data", this.xhr.requestBody);
        },

        "should set error flag to false": function () {
            this.xhr.open("POST", "/");
            this.xhr.send("Data");

            assertFalse(this.xhr.errorFlag);
        },

        "should set send flag to true": function () {
            this.xhr.open("POST", "/");
            this.xhr.send("Data");

            assertTrue(this.xhr.sendFlag);
        },

        "should not set send flag to true if sync": function () {
            this.xhr.open("POST", "/", false);
            this.xhr.send("Data");

            assertFalse(this.xhr.sendFlag);
        },

        "should dispatch onreadystatechange": function () {
            var state;
            this.xhr.open("POST", "/", false);

            this.xhr.onreadystatechange = function () {
                state = this.readyState;
            };

            this.xhr.send("Data");

            assertEquals(sinon.FakeXMLHttpRequest.OPENED, state);
        },

        "should dispatch event using DOM Event interface": function () {
            var listener = sinon.spy();
            this.xhr.open("POST", "/", false);
            this.xhr.addEventListener("readystatechange", listener);

            this.xhr.send("Data");

            assert(listener.calledOnce);
            assertEquals("readystatechange", listener.args[0][0].type);
        },

        "should dispatch onSend callback if set": function () {
            this.xhr.open("POST", "/", true);
            var callback = sinon.spy();
            this.xhr.onSend = callback;

            this.xhr.send("Data");

            assert(callback.called);
        },

        "should dispatch onSend with request as argument": function () {
            this.xhr.open("POST", "/", true);
            var callback = sinon.spy();
            this.xhr.onSend = callback;

            this.xhr.send("Data");

            assert(callback.calledWith(this.xhr));
        },

        "should dispatch onSend when async": function () {
            this.xhr.open("POST", "/", false);
            var callback = sinon.spy();
            this.xhr.onSend = callback;

            this.xhr.send("Data");

            assert(callback.calledWith(this.xhr));
        }
    });

    testCase("FakeXMLHttpRequestSetResponseHeadersTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
        },

        "should set request headers": function () {
            var object = { id: 42 };
            this.xhr.open("GET", "/");
            this.xhr.send();
            this.xhr.setResponseHeaders(object);

            assertEquals(object, this.xhr.responseHeaders);
        },

        "should call readyStateChange with HEADERS_RECEIVED": function () {
            var object = { id: 42 };
            this.xhr.open("GET", "/");
            this.xhr.send();
            var spy = this.xhr.readyStateChange = sinon.spy();

            this.xhr.setResponseHeaders(object);

            assert(spy.calledWith(sinon.FakeXMLHttpRequest.HEADERS_RECEIVED));
        },

        "should not call readyStateChange if sync": function () {
            var object = { id: 42 };
            this.xhr.open("GET", "/", false);
            this.xhr.send();
            var spy = this.xhr.readyStateChange = sinon.spy();

            this.xhr.setResponseHeaders(object);

            assertFalse(spy.called);
        }
    });

    testCase("FakeXMLHttpRequestSetResponseBodyAsyncTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
            this.xhr.send();
            this.xhr.setResponseHeaders({});
        },

        "should invoke onreadystatechange handler with LOADING state": function () {
            var spy = sinon.spy();
            this.xhr.readyStateChange = spy;

            this.xhr.setResponseBody("Some text goes in here ok?");

            assert(spy.calledWith(sinon.FakeXMLHttpRequest.LOADING));
        },

        "should invoke onreadystatechange handler for each 10 byte chunk": function () {
            var spy = sinon.spy();
            this.xhr.readyStateChange = spy;
            this.xhr.chunkSize = 10;

            this.xhr.setResponseBody("Some text goes in here ok?");

            assertEquals(4, spy.callCount);
        },

        "should invoke onreadystatechange handler for each x byte chunk": function () {
            var spy = sinon.spy();
            this.xhr.readyStateChange = spy;
            this.xhr.chunkSize = 20;

            this.xhr.setResponseBody("Some text goes in here ok?");

            assertEquals(3, spy.callCount);
        },

        "should invoke onreadystatechange handler with partial data": function () {
            var pieces = [];

            var spy = sinon.spy(function () {
                pieces.push(this.responseText);
            });

            this.xhr.readyStateChange = spy;
            this.xhr.chunkSize = 9;

            this.xhr.setResponseBody("Some text goes in here ok?");

            assertEquals("Some text", pieces[1]);
        },

        "should call onreadystatechange with DONE state": function () {
            var spy = sinon.spy();
            this.xhr.readyStateChange = spy;

            this.xhr.setResponseBody("Some text goes in here ok?");

            assert(spy.calledWith(sinon.FakeXMLHttpRequest.DONE));
        },

        "should throw if not open": function () {
            var xhr = new sinon.FakeXMLHttpRequest();

            assertException(function () {
                xhr.setResponseBody("");
            });
        },

        "should throw if no headers received": function () {
            var xhr = new sinon.FakeXMLHttpRequest();
            xhr.open("GET", "/");
            xhr.send();

            assertException(function () {
                xhr.setResponseBody("");
            });
        },

        "should throw if body was already sent": function () {
            var xhr = new sinon.FakeXMLHttpRequest();
            xhr.open("GET", "/");
            xhr.send();
            xhr.setResponseHeaders({});
            xhr.setResponseBody("");

            assertException(function () {
                xhr.setResponseBody("");
            });
        },

        "should throw if body is not a string": function () {
            var xhr = new sinon.FakeXMLHttpRequest();
            xhr.open("GET", "/");
            xhr.send();
            xhr.setResponseHeaders({});

            assertException(function () {
                xhr.setResponseBody({});
            }, "InvalidBodyException");
        }
    });

    testCase("FakeXMLHttpRequestSetResponseBodySyncTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/", false);
            this.xhr.send();
            this.xhr.setResponseHeaders({});
        },

        "should not throw": function () {
            var xhr = this.xhr;

            assertNoException(function () {
                xhr.setResponseBody("");
            });
        },

        "should set readyState to DONE": function () {
            this.xhr.setResponseBody("");

            assertEquals(sinon.FakeXMLHttpRequest.DONE, this.xhr.readyState);
        },

        "should throw if responding to request twice": function () {
            var xhr = this.xhr;
            this.xhr.setResponseBody("");

            assertException(function () {
                xhr.setResponseBody("");
            });
        },

        "should not call onreadystatechange for sync request": function () {
            var xhr = new sinon.FakeXMLHttpRequest();
            var spy = sinon.spy();
            xhr.onreadystatechange = spy;
            xhr.open("GET", "/", false);
            xhr.send();
            var callCount = spy.callCount;

            xhr.setResponseHeaders({});
            xhr.setResponseBody("");

            assertEquals(0, callCount - spy.callCount);
        },

        "should simulate synchronous request": function () {
            var xhr = new sinon.FakeXMLHttpRequest();

            xhr.onSend = function () {
                this.setResponseHeaders({});
                this.setResponseBody("Oh yeah");
            };

            xhr.open("GET", "/", false);
            xhr.send();

            assertEquals("Oh yeah", xhr.responseText);
        }
    });

    testCase("FakeXMLHttpRequestRespondTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
            var spy = this.spy = sinon.spy();

            this.xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    spy.call(this);
                }
            };

            this.xhr.send();
        },

        "should call readystate handler with readyState DONE once": function () {
            this.xhr.respond(200, {}, "");

            assertEquals(1, this.spy.callCount);
        },

        "should default to status 200, no headers, and blank body": function () {
            this.xhr.respond();

            assertEquals(200, this.xhr.status);
            assertEquals("", this.xhr.getAllResponseHeaders());
            assertEquals("", this.xhr.responseText);
        },

        "should set status": function () {
            this.xhr.respond(201);

            assertEquals(201, this.xhr.status);
        },

        "should set status text": function () {
            this.xhr.respond(201);

            assertEquals("Created", this.xhr.statusText);
        },

        "should set headers": function () {
            sinon.spy(this.xhr, "setResponseHeaders");
            var responseHeaders = { some: "header", value: "over here" };
            this.xhr.respond(200, responseHeaders);

            assertEquals(responseHeaders, this.xhr.setResponseHeaders.args[0][0]);
        },

        "should set response text": function () {
            this.xhr.respond(200, {}, "'tis some body text");

            assertEquals("'tis some body text", this.xhr.responseText);
        },

        "should complete request when onreadystatechange fails": function () {
            this.xhr.onreadystatechange = sinon.stub().throws();
            this.xhr.respond(200, {}, "'tis some body text");

            assertEquals(4, this.xhr.onreadystatechange.callCount);
        }
    });

    testCase("FakeXMLHttpRequestGetResponseHeaderTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
        },

        "should return null if request is not finished": function () {
            assertNull(this.xhr.getResponseHeader("Content-Type"));
        },

        "should return null if header is Set-Cookie": function () {
            this.xhr.send();

            assertNull(this.xhr.getResponseHeader("Set-Cookie"));
        },

        "should return null if header is Set-Cookie2": function () {
            this.xhr.send();

            assertNull(this.xhr.getResponseHeader("Set-Cookie2"));
        },

        "should return header value": function () {
            this.xhr.send();
            this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

            assertEquals("text/html", this.xhr.getResponseHeader("Content-Type"));
        },

        "should return null if header is not set": function () {
            this.xhr.send();

            assertNull(this.xhr.getResponseHeader("Content-Type"));
        },

        "should return headers case insensitive": function () {
            this.xhr.send();
            this.xhr.setResponseHeaders({ "Content-Type": "text/html" });

            assertEquals("text/html", this.xhr.getResponseHeader("content-type"));
        }
    });

    testCase("FakeXMLHttpRequestGetAllResponseHeadersTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
        },

        "should return empty string if request is not finished": function () {
            assertEquals("", this.xhr.getAllResponseHeaders());
        },

        "should not return Set-Cookie and Set-Cookie2 headers": function () {
            this.xhr.send();
            this.xhr.setResponseHeaders({
                "Set-Cookie": "Hey",
                "Set-Cookie2": "There"
            });

            assertEquals("", this.xhr.getAllResponseHeaders());
        },

        "should return headers": function () {
            this.xhr.send();
            this.xhr.setResponseHeaders({
                "Content-Type": "text/html",
                "Set-Cookie2": "There",
                "Content-Length": "32"
            });

            assertEquals("Content-Type: text/html\r\nContent-Length: 32\r\n", this.xhr.getAllResponseHeaders());
        }
    });

    testCase("FakeXMLHttpRequestAbortTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
        },

        "should set aborted flag to true": function () {
            this.xhr.aborted = true;

            this.xhr.abort();

            assertTrue(this.xhr.aborted);
        },

        "should set responseText to null": function () {
            this.xhr.responseText = "Partial data";

            this.xhr.abort();

            assertNull(this.xhr.responseText);
        },

        "should set errorFlag to true": function () {
            this.xhr.errorFlag = true;

            this.xhr.abort();

            assertTrue(this.xhr.errorFlag);
        },

        "should null request headers": function () {
            this.xhr.open("GET", "/");
            this.xhr.setRequestHeader("X-Test", "Sumptn");

            this.xhr.abort();

            assertEquals({}, this.xhr.requestHeaders);
        },

        "should set state to DONE if sent before": function () {
            var readyState;
            this.xhr.open("GET", "/");
            this.xhr.send();

            this.xhr.onreadystatechange = function () {
                readyState = this.readyState;
            };

            this.xhr.abort();

            assertEquals(sinon.FakeXMLHttpRequest.DONE, readyState);
        },

        "should set send flag to false if sent before": function () {
            this.xhr.open("GET", "/");
            this.xhr.send();

            this.xhr.abort();

            assertFalse(this.xhr.sendFlag);
        },

        "should dispatch readystatechange event if sent before": function () {
            this.xhr.open("GET", "/");
            this.xhr.send();
            this.xhr.onreadystatechange = sinon.stub();

            this.xhr.abort();

            assert(this.xhr.onreadystatechange.called);
        },

        "should set readyState to unsent if sent before": function () {
            this.xhr.open("GET", "/");
            this.xhr.send();

            this.xhr.abort();

            assertEquals(sinon.FakeXMLHttpRequest.UNSENT, this.xhr.readyState);
        },

        "should not dispatch readystatechange event if readyState is unsent": function () {
            this.xhr.onreadystatechange = sinon.stub();

            this.xhr.abort();

            assertFalse(this.xhr.onreadystatechange.called);
        },

        "should not dispatch readystatechange event if readyState is opened but not sent": function () {
            this.xhr.open("GET", "/");
            this.xhr.onreadystatechange = sinon.stub();

            this.xhr.abort();

            assertFalse(this.xhr.onreadystatechange.called);
        }
    });

    testCase("FakeXMLHttpRequestResponseXMLTest", {
        setUp: function () {
            this.xhr = new sinon.FakeXMLHttpRequest();
            this.xhr.open("GET", "/");
        },

        "should initially be null": function () {
            assertNull(this.xhr.responseXML);
        },

        "should be null when the response body is empty": function () {
            this.xhr.send();

            this.xhr.respond(200, {}, "");

            assertNull(this.xhr.responseXML);
        },

        "should parse XML for application/xml": function () {
            this.xhr.send();

            this.xhr.respond(200, { "Content-Type": "application/xml" },
                             "<div><h1>Hola!</h1></div>");

            var doc = this.xhr.responseXML;
            var elements = doc.documentElement.getElementsByTagName("h1");
            assertEquals(1, elements.length);
            assertEquals("h1", elements[0].tagName);
        },

        "should parse XML for text/xml": function () {
            this.xhr.send();

            this.xhr.respond(200, { "Content-Type": "text/xml" },
                             "<div><h1>Hola!</h1></div>");

            assertNotNull(this.xhr.responseXML);
        },

        "should parse XML for custom xml content type": function () {
            this.xhr.send();

            this.xhr.respond(200, { "Content-Type": "application/text+xml" },
                             "<div><h1>Hola!</h1></div>");

            assertNotNull(this.xhr.responseXML);
        },

        "should parse XML with no Content-Type": function () {
            this.xhr.send();

            this.xhr.respond(200, {}, "<div><h1>Hola!</h1></div>");

            var doc = this.xhr.responseXML;
            var elements = doc.documentElement.getElementsByTagName("h1");
            assertEquals(1, elements.length);
            assertEquals("h1", elements[0].tagName);
        },

        "should not parse XML with Content-Type text/plain": function () {
            this.xhr.send();

            this.xhr.respond(200, { "Content-Type": "text/plain" }, "<div></div>");

            assertNull(this.xhr.responseXML);
        }
    });

    var globalXMLHttpRequest = global.XMLHttpRequest;
    var globalActiveXObject = global.ActiveXObject;

    var fakeXhrSetUp = function () {
        this.fakeXhr = sinon.useFakeXMLHttpRequest();
    };

    var fakeXhrTearDown = function () {
        if (typeof this.fakeXhr.restore == "function") {
            this.fakeXhr.restore();
        }
    };

    testCase("StubXHRTest", {
        setUp: fakeXhrSetUp,
        tearDown: fakeXhrTearDown,

        "should return FakeXMLHttpRequest constructor": function () {
            assertSame(sinon.FakeXMLHttpRequest, this.fakeXhr);
        },

        "should temporarily bless FakeXMLHttpRequest with restore method": function () {
            assertFunction(this.fakeXhr.restore);
        },

        "calling restore should remove temporary method": function () {
            this.fakeXhr.restore();

            assertUndefined(this.fakeXhr.restore);
        },

        "should remove XMLHttpRequest onCreate listener": function () {
            sinon.FakeXMLHttpRequest.onCreate = function () {};

            this.fakeXhr.restore();

            assertUndefined(sinon.FakeXMLHttpRequest.onCreate);
        },

        "should optionally keep XMLHttpRequest onCreate listener": function () {
            var onCreate = function () {};
            sinon.FakeXMLHttpRequest.onCreate = onCreate;

            this.fakeXhr.restore(true);

            assertSame(onCreate, sinon.FakeXMLHttpRequest.onCreate);
        }
    });
    
    testCase("XHRFiltering",{
        setUp: function() {
            sinon.FakeXMLHttpRequest.useFilters = true;
            sinon.FakeXMLHttpRequest.filters = [];
            sinon.useFakeXMLHttpRequest();
        },
        tearDown: function() {
            sinon.FakeXMLHttpRequest.useFilters = false;
            sinon.FakeXMLHttpRequest.restore();
        },
        "should not defake XHR requests that don't match a filter": function() {
            var mock = sinon.mock(sinon.FakeXMLHttpRequest)
            try {
                mock.expects("defake").never()
                sinon.FakeXMLHttpRequest.addFilter(function() { return false });
                new XMLHttpRequest().open("GET","http://example.com");
            } finally { mock.verify(); }
        },
        "should defake XHR requests that match a filter": function() {
            var mock = sinon.mock(sinon.FakeXMLHttpRequest)
            try {
                mock.expects("defake").once()
                sinon.FakeXMLHttpRequest.addFilter(function() { return true });
                new XMLHttpRequest().open("GET","http://example.com");
            } finally { mock.verify(); }
        }
    });
    
    var runWithWorkingXHROveride = function(workingXHR,test) {
        try {
            var original = sinon.xhr.workingXHR;
            sinon.xhr.workingXHR = workingXHR;
            test();
        } finally {
            sinon.xhr.workingXHR = original;
        }
    };
    var fakeXhr;
    testCase("DefakedXHR",{
        setUp: function() {
            fakeXhr = new sinon.FakeXMLHttpRequest();
        },
        "should update attributes from working XHR object when ready state changes": function() {
            var workingXHRInstance;
            var readyStateCb;
            var workingXHROverride = function() {
                workingXHRInstance = this;
                this.addEventListener = function(str,fn) {
                    readyStateCb = fn;
                };
                this.open = function() {};
            };
            runWithWorkingXHROveride(workingXHROverride,function() {
                sinon.FakeXMLHttpRequest.defake(fakeXhr,[]);
                workingXHRInstance.statusText = "This is the status text of the real XHR";
                workingXHRInstance.readyState = 4;
                readyStateCb();
                assertEquals(
                    "This is the status text of the real XHR",
                    fakeXhr.statusText
                );
            });
        },
        "should pass on methods to working XHR object": function() {
            var workingXHRInstance;
            var spy;
            var workingXHROverride = function() {
                workingXHRInstance = this;
                this.addEventListener = this.open = function() {};
            };
            runWithWorkingXHROveride(workingXHROverride,function() {
                sinon.FakeXMLHttpRequest.defake(fakeXhr,[]);
                workingXHRInstance.getResponseHeader = spy = sinon.spy();
                fakeXhr.getResponseHeader();
                sinon.assert.calledOnce(spy);
            });
        },
        "should call leagacy onreadystatechange handlers": function() {
            var workingXHRInstance;
            var spy;
            var readyStateCb;
            var workingXHROverride = function() {
                workingXHRInstance = this;
                this.addEventListener = function(str,fn) {
                    readyStateCb = fn;
                };
                this.open = function() {};
            };
            runWithWorkingXHROveride(workingXHROverride,function() {
                sinon.FakeXMLHttpRequest.defake(fakeXhr,[]);
                fakeXhr.onreadystatechange = spy = sinon.spy()
                readyStateCb();
                sinon.assert.calledOnce(spy);
            });
        },
        "should perform initial readystatechange on opening when filters are being used, but don't match": function() {
            try {
              sinon.FakeXMLHttpRequest.useFilters = true;
              var spy = sinon.spy();
              fakeXhr.addEventListener("readystatechange",spy);
              fakeXhr.open("GET","http://example.com",true);
              sinon.assert.calledOnce(spy);
            } finally {
              sinon.FakeXMLHttpRequest.useFilters = false;
            }
        }
    });

    AsyncTestCase("DefakedXHRTest",{
        setUp: function() {
            sinon.FakeXMLHttpRequest.useFilters = true;
            sinon.FakeXMLHttpRequest.filters = [];
            sinon.useFakeXMLHttpRequest();
            sinon.FakeXMLHttpRequest.addFilter(function() {return true;});
        },
        tearDown: function() {
            sinon.FakeXMLHttpRequest.useFilters = false;
            sinon.FakeXMLHttpRequest.filters = [];
            sinon.FakeXMLHttpRequest.restore();
        },
        "test loads resource asynchronously": function(q) {
            q.call(function(callbacks) {
                var req = new XMLHttpRequest;
                var responseReceived = callbacks.add(function(responseText) {
                    assertMatch(/loaded successfully/, responseText);
                });
                req.onreadystatechange = function() {
                    if(this.readyState == 4) {
                        responseReceived(this.responseText);
                    }
                };

                setTimeout(callbacks.addErrback("timeout on ajax"),1000);

                req.open("GET","/test/test/resources/xhr_target.txt",true);
                req.send();
            });
        },
        "test loads resource synchronously": function() {
            var req = new XMLHttpRequest;
            req.open("GET","/test/test/resources/xhr_target.txt",false);
            req.send();
            assertMatch(/loaded successfully/, req.responseText);
        }
    });

    if (typeof ActiveXObject == "undefined") {
        testCase("StubXHRActiveXTest", {
            setUp: fakeXhrSetUp,
            tearDown: fakeXhrTearDown,

            "should notify user of missing ActiveXObject": function () {
                jstestdriver.console.log("Environment does not support ActiveXObject");
            },

            "should not expose ActiveXObject": function () {
                assertEquals("undefined", typeof ActiveXObject);
            },

            "should not expose ActiveXObject when restored": function () {
                this.fakeXhr.restore();

                assertEquals("undefined", typeof ActiveXObject);
            }
        });
    } else {
        testCase("StubXHRActiveXTest", {
            setUp: fakeXhrSetUp,
            tearDown: fakeXhrTearDown,

            "should hijack ActiveXObject": function () {
                assertNotSame(globalActiveXObject, global.ActiveXObject);
                assertNotSame(globalActiveXObject, window.ActiveXObject);
                assertNotSame(globalActiveXObject, ActiveXObject);
            },

            "should restore global ActiveXObject": function () {
                this.fakeXhr.restore();

                assertSame(globalActiveXObject, global.ActiveXObject);
                assertSame(globalActiveXObject, window.ActiveXObject);
                assertSame(globalActiveXObject, ActiveXObject);
            },

            "should create FakeXHR object with ActiveX Microsoft.XMLHTTP": function () {
                var xhr = new ActiveXObject("Microsoft.XMLHTTP");

                assert(xhr instanceof sinon.FakeXMLHttpRequest);
            },

            "should create FakeXHR object with ActiveX Msxml2.XMLHTTP": function () {
                var xhr = new ActiveXObject("Msxml2.XMLHTTP");

                assert(xhr instanceof sinon.FakeXMLHttpRequest);
            },

            "should create FakeXHR object with ActiveX Msxml2.XMLHTTP.3.0": function () {
                var xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0");

                assert(xhr instanceof sinon.FakeXMLHttpRequest);
            },

            "should create FakeXHR object with ActiveX Msxml2.XMLHTTP.6.0": function () {
                var xhr = new ActiveXObject("Msxml2.XMLHTTP.6.0");

                assert(xhr instanceof sinon.FakeXMLHttpRequest);
            }
        });
    }

    if (typeof XMLHttpRequest == "undefined") {
        testCase("StubXHRNativeTest", {
            setUp: fakeXhrSetUp,
            tearDown: fakeXhrTearDown,

            "should notify user of missing XMLHttpRequest": function () {
                jstestdriver.console.log("Environment does not support XMLHttpRequest");
            },

            "should not expose XMLHttpRequest": function () {
                assertEquals("undefined", typeof XMLHttpRequest);
            },

            "should not expose XMLHttpRequest after restore": function () {
                this.fakeXhr.restore();

                assertEquals("undefined", typeof XMLHttpRequest);
            }
        });
    } else {
        testCase("StubXHRNativeTest", {
            setUp: fakeXhrSetUp,
            tearDown: fakeXhrTearDown,

            "should replace global XMLHttpRequest": function () {
                assertNotSame(globalXMLHttpRequest, XMLHttpRequest);
                assertSame(sinon.FakeXMLHttpRequest, XMLHttpRequest);
            },

            "should restore global XMLHttpRequest": function () {
                this.fakeXhr.restore();

                assertSame(globalXMLHttpRequest, XMLHttpRequest);
            }
        });
    }
}(this));
