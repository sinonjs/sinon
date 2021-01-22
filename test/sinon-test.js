"use strict";

var assert = require("@sinonjs/referee").assert;
var functionName = require("@sinonjs/commons").functionName;
var Sandbox = require("../lib/sinon/sandbox");
var proxyquire = require("proxyquire");

describe("sinon module", function () {
    var sinon, fakeNise;

    before(function () {
        if (typeof Promise !== "function") {
            this.skip();
        }
    });

    beforeEach(function () {
        fakeNise = {
            fakeServer: {
                create: function () {
                    return "47c86a4c-6b48-4748-bb8c-d853f999720c";
                },
            },
            fakeServerWithClock: {
                create: function () {
                    return "e69974f8-4568-48d1-a5e9-2b511a59c14b";
                },
            },
            fakeXhr: {
                xhr: "958e8996-0cc3-4136-8a0e-6a120f5311bc",
                FakeXMLHttpRequest: "6adbf569-f6d7-4b86-be22-38340ae0f8c8",
                useFakeXMLHttpRequest: "ba8bd609-c921-4a62-a1b9-49336bd426a4",
            },
        };
        sinon = proxyquire("../lib/sinon", {
            nise: fakeNise,
        });
    });

    describe("exports", function () {
        describe("default sandbox", function () {
            it("should be an instance of Sandbox", function () {
                // use full sinon for this test as it compares sinon instance
                // proxyquire changes the instance, so `actual instanceof Sandbox` returns `false`
                // see https://github.com/sinonjs/sinon/pull/1586#issuecomment-354457231
                sinon = require("../lib/sinon");

                assert.hasPrototype(sinon, Sandbox.prototype);
            });
        });

        describe("createSandbox", function () {
            it("should be a unary Function named 'createSandbox'", function () {
                assert.isFunction(sinon.createSandbox);
                assert.equals(sinon.createSandbox.length, 1);
                // Use helper because IE 11 doesn't support the `name` property:
                assert.equals(
                    functionName(sinon.createSandbox),
                    "createSandbox"
                );
            });
        });

        describe("fakeServer", function () {
            it("should be the fakeServer export from nise", function () {
                assert.same(sinon.fakeServer, fakeNise.fakeServer);
            });
        });

        describe("createFakeServer", function () {
            it("should be fakeServer.create from nise", function () {
                assert.equals(
                    sinon.createFakeServer(),
                    fakeNise.fakeServer.create()
                );
            });
        });

        describe("fakeServerWithClock", function () {
            it("should be the fakeServerWithClock export from nise", function () {
                assert.same(
                    sinon.fakeServerWithClock,
                    fakeNise.fakeServerWithClock
                );
            });
        });

        describe("createFakeServerWithClock", function () {
            it("should be fakeServerWithClock.create from nise", function () {
                assert.equals(
                    sinon.createFakeServerWithClock(),
                    fakeNise.fakeServerWithClock.create()
                );
            });
        });

        describe("xhr", function () {
            it("should be the fakeXhr.xhr export from nise", function () {
                assert.equals(sinon.xhr, fakeNise.fakeXhr.xhr);
            });
        });

        describe("FakeXMLHttpRequest", function () {
            it("should be the fakeXhr.FakeXMLHttpRequest export from nise", function () {
                assert.equals(
                    sinon.FakeXMLHttpRequest,
                    fakeNise.fakeXhr.FakeXMLHttpRequest
                );
            });
        });

        describe("useFakeXMLHttpRequest", function () {
            var nise;

            beforeEach(function () {
                // use full sinon for this test as it compares sinon instance
                // proxyquire changes the instance, so `actual instanceof Sandbox` returns `false`
                // see https://github.com/sinonjs/sinon/pull/1586#issuecomment-354457231
                sinon = require("../lib/sinon");

                nise = require("nise");
            });

            afterEach(function () {
                nise.fakeXhr.useFakeXMLHttpRequest.restore();
            });

            it("should be the fakeXhr.useFakeXMLHttpRequest export from nise", function () {
                sinon.spy(nise.fakeXhr, "useFakeXMLHttpRequest");
                sinon.useFakeXMLHttpRequest();
                assert.isTrue(nise.fakeXhr.useFakeXMLHttpRequest.called);
            });
        });
    });
});
