"use strict";

var assert = require("referee").assert;
var hasPromise = typeof Promise === "function";

if (!hasPromise) {
    return;
}

describe("sinon module", function () {
    var sinon,
        fakeNise;

    beforeEach(function () {
        var proxyquire = require("proxyquire");

        fakeNise = {
            fakeServer: "47c86a4c-6b48-4748-bb8c-d853f999720c",
            fakeServerWithClock: "e69974f8-4568-48d1-a5e9-2b511a59c14b",
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

    describe("exports", function () {
        describe("fakeServer", function () {
            it("should be the fakeServer export from nise", function () {
                assert.equals(sinon.fakeServer, fakeNise.fakeServer);
            });
        });

        describe("fakeServerWithClock", function () {
            it("should be the fakeServerWithClock export from nise", function () {
                assert.equals(sinon.fakeServerWithClock, fakeNise.fakeServerWithClock);
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
