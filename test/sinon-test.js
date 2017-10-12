"use strict";

var assert = require("referee").assert;
var hasPromise = typeof Promise === "function";
var Sandbox = require("../lib/sinon/sandbox");

if (!hasPromise) {
    return;
}

var proxyquire = require("proxyquire");

describe("sinon module", function () {
    var sinon,
        fakeNise;

    beforeEach(function () {
        fakeNise = {
            fakeServer: {
                create: function () {
                    return "47c86a4c-6b48-4748-bb8c-d853f999720c";
                }
            },
            fakeServerWithClock: {
                create: function () {
                    return "e69974f8-4568-48d1-a5e9-2b511a59c14b";
                }
            },
            fakeXhr: {
                xhr: "958e8996-0cc3-4136-8a0e-6a120f5311bc",
                FakeXMLHttpRequest: "6adbf569-f6d7-4b86-be22-38340ae0f8c8",
                useFakeXMLHttpRequest: "ba8bd609-c921-4a62-a1b9-49336bd426a4"
            }
        };
        sinon = proxyquire("../lib/sinon", {
            nise: fakeNise
        });
    });

    describe("deprecated methods", function () {
        it(".sandbox.create", function () {
            // eslint-disable-next-line max-len
            var expectedMessage = "`sandbox.create()` is deprecated. Use default sandbox at `sinon.sandbox` or create new sandboxes with `sinon.createSandbox()`";
            var infoStub = sinon.stub(console, "info");
            var actual = sinon.sandbox.create();

            sinon.assert.calledWith(infoStub, expectedMessage);

            assert.hasPrototype(actual, Sandbox.prototype);

            infoStub.restore();
        });
    });

    describe("exports", function () {
        describe("default sandbox", function () {
            it("should be an instance of Sandbox", function () {
                assert.hasPrototype(sinon, Sandbox.prototype);
            });
        });

        describe("createSandbox", function () {
            it("should be a unary Function named 'createSandbox'", function () {
                assert.isFunction(sinon.createSandbox);
                assert.equals(sinon.createSandbox.length, 1);
                assert.equals(sinon.createSandbox.name, "createSandbox");
            });
        });

        describe("fakeServer", function () {
            it("should be the fakeServer export from nise", function () {
                assert.same(sinon.fakeServer, fakeNise.fakeServer);
            });
        });

        describe("createFakeServer", function () {
            it("should be fakeServer.create from nise", function () {
                assert.equals(sinon.createFakeServer(), fakeNise.fakeServer.create());
            });
        });

        describe("fakeServerWithClock", function () {
            it("should be the fakeServerWithClock export from nise", function () {
                assert.same(sinon.fakeServerWithClock, fakeNise.fakeServerWithClock);
            });
        });

        describe("createFakeServerWithClock", function () {
            it("should be fakeServerWithClock.create from nise", function () {
                assert.equals(sinon.createFakeServerWithClock(), fakeNise.fakeServerWithClock.create());
            });
        });

        describe("xhr", function () {
            it("should be the fakeXhr.xhr export from nise", function () {
                assert.equals(sinon.xhr, fakeNise.fakeXhr.xhr);
            });
        });

        describe("FakeXMLHttpRequest", function () {
            it("should be the fakeXhr.FakeXMLHttpRequest export from nise", function () {
                assert.equals(sinon.FakeXMLHttpRequest, fakeNise.fakeXhr.FakeXMLHttpRequest);
            });
        });

        describe("useFakeXMLHttpRequest", function () {
            it("should be the fakeXhr.useFakeXMLHttpRequest export from nise", function () {
                assert.equals(sinon.useFakeXMLHttpRequest, fakeNise.fakeXhr.useFakeXMLHttpRequest);
            });
        });
    });
});
