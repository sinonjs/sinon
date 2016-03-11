"use strict";

var referee = require("referee");
var sinon = require("../../lib/sinon");
var assert = referee.assert;
var refute = referee.refute;
var globalXDomainRequest = global.XDomainRequest;

var fakeXdrSetUp = function () {
    this.fakeXdr = sinon.useFakeXDomainRequest();
};
var fakeXdrTearDown = function () {
    if (typeof this.fakeXdr.restore === "function") {
        this.fakeXdr.restore();
    }
};

if (typeof window !== "undefined") {
    describe("sinon.FakeXDomainRequest", function () {

        it("is constructor", function () {
            assert.isFunction(sinon.FakeXDomainRequest);
            assert.same(sinon.FakeXDomainRequest.prototype.constructor, sinon.FakeXDomainRequest);
        });
        it("implements readyState constants", function () {
            assert.same(sinon.FakeXDomainRequest.UNSENT, 0);
            assert.same(sinon.FakeXDomainRequest.OPENED, 1);
            assert.same(sinon.FakeXDomainRequest.LOADING, 3);
            assert.same(sinon.FakeXDomainRequest.DONE, 4);
        });
        it("calls onCreate if listener is set", function () {
            var onCreate = sinon.spy();
            sinon.FakeXDomainRequest.onCreate = onCreate;

            var xhr = new sinon.FakeXDomainRequest();

            // makes the linter happy
            assert(xhr);
            assert(onCreate.called);
        });
        it("passes new object to onCreate if set", function () {
            var onCreate = sinon.spy();
            sinon.FakeXDomainRequest.onCreate = onCreate;

            var xhr = new sinon.FakeXDomainRequest();

            assert.same(onCreate.getCall(0).args[0], xhr);
        });

        describe(".open", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
            });
            it("is method", function () {
                assert.isFunction(this.xdr.open);
            });
            it("sets properties on object", function () {
                this.xdr.open("GET", "/my/url");

                assert.equals(this.xdr.method, "GET");
                assert.equals(this.xdr.url, "/my/url");
            });
            it("sets responseText to null", function () {
                this.xdr.open("GET", "/my/url");

                assert.isNull(this.xdr.responseText);
            });
            it("sets send flag to false", function () {
                this.xdr.open("GET", "/my/url");

                assert.isFalse(this.xdr.sendFlag);
            });
            it("sets readyState to OPENED", function () {
                this.xdr.open("GET", "/my/url");

                assert.same(this.xdr.readyState, sinon.FakeXDomainRequest.OPENED);
            });
            it("sets requestHeaders to blank object", function () {
                this.xdr.open("GET", "/my/url");

                assert.isObject(this.xdr.requestHeaders);
                assert.equals(this.xdr.requestHeaders, {});
            });
        });

        describe(".send", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
            });

            it("throws if request is not open", function () {
                var xdr = new sinon.FakeXDomainRequest();

                assert.exception(function () {
                    xdr.send();
                });
            });
            it("throws if send flag is true", function () {
                var xdr = this.xdr;
                xdr.open("GET", "/");
                xdr.sendFlag = true;

                assert.exception(function () {
                    xdr.send();
                });
            });

            it("sets HEAD body to null", function () {
                this.xdr.open("HEAD", "/");
                this.xdr.send("Data");

                assert.isNull(this.xdr.requestBody);
            });
            it("sets mime to text/plain for all methods", function () {
                var methods = ["GET", "HEAD", "POST"];
                for (var i = 0; i < methods.length; i++) {
                    this.xdr.open(methods[i], "/");
                    this.xdr.send("Data");

                    assert.equals(this.xdr.requestHeaders["Content-Type"], "text/plain;charset=utf-8");
                }
            });
            it("sets request body to string data for GET", function () {
                this.xdr.open("GET", "/");
                this.xdr.send("Data");

                assert.equals(this.xdr.requestBody, "Data");
            });
            it("sets request body to string data for POST", function () {
                this.xdr.open("POST", "/");
                this.xdr.send("Data");

                assert.equals(this.xdr.requestBody, "Data");
            });
            it("sets error flag to false", function () {
                this.xdr.open("POST", "/");
                this.xdr.send("Data");

                assert.isFalse(this.xdr.errorFlag);
            });

            it("sets send flag to true", function () {
                this.xdr.open("POST", "/");
                this.xdr.send("Data");

                assert.isTrue(this.xdr.sendFlag);
            });
            it("calls readyStateChange", function () {
                this.xdr.open("POST", "/", false);
                var spy = sinon.spy();
                this.xdr.readyStateChange = spy;

                this.xdr.send("Data");

                assert.equals(this.xdr.readyState, sinon.FakeXDomainRequest.OPENED);
                assert.isTrue(spy.called);
            });
        });

        describe(".setResponseBody", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
                this.xdr.open("GET", "/");
                this.xdr.send();
            });
            it("invokes readyStateChange handler with LOADING state", function () {
                var spy = sinon.spy();
                this.xdr.readyStateChange = spy;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert(spy.calledWith(sinon.FakeXDomainRequest.LOADING));
            });
            it("fire onprogress event", function () {
                var spy = sinon.spy();
                this.xdr.onprogress = spy;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert.isTrue(spy.called);
            });
            it("invokes readyStateChange handler for each 10 byte chunk", function () {
                var spy = sinon.spy();
                this.xdr.readyStateChange = spy;
                this.xdr.chunkSize = 10;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert.equals(spy.callCount, 4);
            });
            it("invokes readyStateChange handler for each x byte chunk", function () {
                var spy = sinon.spy();
                this.xdr.readyStateChange = spy;
                this.xdr.chunkSize = 20;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert.equals(spy.callCount, 3);
            });
            it("invokes readyStateChange handler with partial data", function () {
                var pieces = [];

                var spy = sinon.spy(function () {
                    pieces.push(this.responseText);
                });

                this.xdr.readyStateChange = spy;
                this.xdr.chunkSize = 9;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert.equals(pieces[1], "Some text");
            });
            it("calls readyStateChange with DONE state", function () {
                var spy = sinon.spy();
                this.xdr.readyStateChange = spy;

                this.xdr.setResponseBody("Some text goes in here ok?");

                assert(spy.calledWith(sinon.FakeXDomainRequest.DONE));
            });
            it("throws if not open", function () {
                var xdr = new sinon.FakeXDomainRequest();

                assert.exception(function () {
                    xdr.setResponseBody("");
                });
            });
            it("throws if body was already sent", function () {
                var xdr = new sinon.FakeXDomainRequest();
                xdr.open("GET", "/");
                xdr.send();
                xdr.setResponseBody("");

                assert.exception(function () {
                    xdr.setResponseBody("");
                });
            });
            it("throws if body is not a string", function () {
                var xdr = new sinon.FakeXDomainRequest();
                xdr.open("GET", "/");
                xdr.send();

                assert.exception(function () {
                    xdr.setResponseBody({});
                }, "InvalidBodyException");
            });
        });

        describe(".respond", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
                this.xdr.open("GET", "/");
                var spy = this.spy = sinon.spy();
                this.xdr.onload = spy.call(this);
                this.xdr.send();
            });
            it("fire onload event", function () {
                this.onload = this.spy;
                this.xdr.respond(200, {}, "");
                assert.equals(this.spy.callCount, 1);
            });
            it("fire onload event with this set to the XHR object", function (done) {
                var xdr = new sinon.FakeXDomainRequest();
                xdr.open("GET", "/");

                xdr.onload = function () {
                    assert.same(this, xdr);
                    done();
                };

                xdr.send();
                xdr.respond(200, {}, "");
            });
            it("calls readystate handler with readyState DONE once", function () {
                this.xdr.respond(200, {}, "");

                assert.equals(this.spy.callCount, 1);
            });
            it("defaults to status 200, no headers, and blank body", function () {
                this.xdr.respond();

                assert.equals(this.xdr.status, 200);
                assert.equals(this.xdr.responseText, "");
            });
            it("sets status", function () {
                this.xdr.respond(201);

                assert.equals(this.xdr.status, 201);
            });
        });

        describe(".simulatetimeout", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
                this.xdr.open("GET", "/");
                this.xdr.send();
                this.xdr.timeout = 100;
            });
            it("fires ontimeout event", function () {
                var spy = sinon.spy();
                this.xdr.ontimeout = spy;

                this.xdr.simulatetimeout();

                assert.isTrue(this.xdr.isTimeout);
                assert.isTrue(spy.called);
            });
            it("readyState is DONE", function () {
                this.xdr.simulatetimeout();

                assert.equals(this.xdr.readyState, sinon.FakeXDomainRequest.DONE);
            });

            it("ensures responseText is not accessible", function () {
                var spy = sinon.spy();
                this.xdr.ontimeout = spy;

                this.xdr.simulatetimeout();

                assert.isTrue(spy.called);
                refute.defined(this.xdr.responseText);
            });
        });

        describe(".abort", function () {
            beforeEach(function () {
                this.xdr = new sinon.FakeXDomainRequest();
            });
            it("sets aborted flag to true", function () {
                this.xdr.aborted = true;

                this.xdr.abort();

                assert.isTrue(this.xdr.aborted);
            });
            it("sets responseText to null", function () {
                this.xdr.responseText = "Partial data";

                this.xdr.abort();

                assert.isNull(this.xdr.responseText);
            });
            it("sets errorFlag to true", function () {
                this.xdr.errorFlag = true;

                this.xdr.abort();

                assert.isTrue(this.xdr.errorFlag);
            });
            it("fire onerror event", function () {
                var spy = sinon.spy();
                this.xdr.onerror = spy;

                this.xdr.open("GET", "/");
                this.xdr.send();
                this.xdr.abort();

                assert.equals(spy.callCount, 1);
            });
            it("sets state to DONE if sent before", function () {
                this.xdr.open("GET", "/");
                this.xdr.send();

                this.xdr.readyStateChange = sinon.spy();

                this.xdr.abort();

                assert(this.xdr.readyStateChange.calledWith(sinon.FakeXDomainRequest.DONE));
            });
            it("sets send flag to false if sent before", function () {
                this.xdr.open("GET", "/");
                this.xdr.send();

                this.xdr.abort();

                assert.isFalse(this.xdr.sendFlag);
            });
            it("does not dispatch readystatechange event if readyState is unsent", function () {
                this.xdr.readyStateChange = sinon.stub();

                this.xdr.abort();

                assert.isFalse(this.xdr.readyStateChange.called);
            });
            it("does not dispatch readystatechange event if readyState is opened but not sent", function () {
                this.xdr.open("GET", "/");
                this.xdr.readyStateChange = sinon.stub();

                this.xdr.abort();

                assert.isFalse(this.xdr.readyStateChange.called);
            });
        });

        if (typeof XDomainRequest === "undefined") {
            describe("missing native XDR", function () {
                beforeEach(fakeXdrSetUp);
                afterEach(fakeXdrTearDown);

                it("does not expose XDomainRequest", function () {
                    assert.equals(typeof XDomainRequest, "undefined");
                });

                it("does not expose XDomainRequest after restore", function () {
                    this.fakeXdr.restore();

                    assert.equals(typeof XDomainRequest, "undefined");
                });
            });
        } else {
            describe("native XDR", function () {
                beforeEach(fakeXdrSetUp);
                afterEach(fakeXdrTearDown);

                it("replaces global XDomainRequest", function () {
                    refute.same(XDomainRequest, globalXDomainRequest);
                    assert.same(XDomainRequest, sinon.FakeXDomainRequest);
                });

                it("restores global XDomainRequest", function () {
                    this.fakeXdr.restore();

                    assert.same(XDomainRequest, globalXDomainRequest);
                });
            });
        }

    });
}
