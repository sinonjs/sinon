"use strict";

var referee = require("referee");
var sinonFakeServerWithClock = require("../../lib/sinon/util/fake_server_with_clock");
var sinonFakeServer = require("../../lib/sinon/util/fake_server");
var sinonSandbox = require("../../lib/sinon/sandbox");
var fakeTimers = require("../../lib/sinon/util/fake_timers");
var sinonSpy = require("../../lib/sinon/spy");
var FakeXMLHttpRequest = require("../../lib/sinon/util/fake_xml_http_request").FakeXMLHttpRequest;
var assert = referee.assert;
var refute = referee.refute;

if (typeof window !== "undefined") {
    describe("sinonFakeServerWithClock", function () {

        describe("without pre-existing fake clock", function () {
            beforeEach(function () {
                this.server = sinonFakeServerWithClock.create();
            });

            afterEach(function () {
                this.server.restore();
                if (this.clock) {
                    this.clock.restore();
                }
            });

            it("calls 'super' when adding requests", function () {
                var sandbox = sinonSandbox.create();
                var addRequest = sandbox.stub(sinonFakeServer, "addRequest");
                var xhr = {};
                this.server.addRequest(xhr);

                assert(addRequest.calledWith(xhr));
                assert(addRequest.calledOn(this.server));
                sandbox.restore();
            });

            it("sets reference to clock when adding async request", function () {
                this.server.addRequest({ async: true });

                assert.isObject(this.server.clock);
                assert.isFunction(this.server.clock.tick);
            });

            it("sets longest timeout from setTimeout", function () {
                this.server.addRequest({ async: true });

                setTimeout(function () {}, 12);
                setTimeout(function () {}, 29);
                setInterval(function () {}, 12);
                setTimeout(function () {}, 27);

                assert.equals(this.server.longestTimeout, 29);
            });

            it("sets longest timeout from setInterval", function () {
                this.server.addRequest({ async: true });

                setTimeout(function () {}, 12);
                setTimeout(function () {}, 29);
                setInterval(function () {}, 132);
                setTimeout(function () {}, 27);

                assert.equals(this.server.longestTimeout, 132);
            });

            it("resets clock", function () {
                this.server.addRequest({ async: true });

                this.server.respond("");
                assert.same(setTimeout, fakeTimers.timers.setTimeout);
            });

            it("does not reset clock second time", function () {
                this.server.addRequest({ async: true });
                this.server.respond("");
                this.clock = fakeTimers.useFakeTimers();
                this.server.addRequest({ async: true });
                this.server.respond("");

                refute.same(setTimeout, fakeTimers.timers.setTimeout);
            });
        });

        describe("existing clock", function () {
            beforeEach(function () {
                this.clock = fakeTimers.useFakeTimers();
                this.server = sinonFakeServerWithClock.create();
            });

            afterEach(function () {
                this.clock.restore();
                this.server.restore();
            });

            it("uses existing clock", function () {
                this.server.addRequest({ async: true });

                assert.same(this.server.clock, this.clock);
            });

            it("records longest timeout using setTimeout and existing clock", function () {
                this.server.addRequest({ async: true });

                setInterval(function () {}, 42);
                setTimeout(function () {}, 23);
                setTimeout(function () {}, 53);
                setInterval(function () {}, 12);

                assert.same(this.server.longestTimeout, 53);
            });

            it("records longest timeout using setInterval and existing clock", function () {
                this.server.addRequest({ async: true });

                setInterval(function () {}, 92);
                setTimeout(function () {}, 73);
                setTimeout(function () {}, 53);
                setInterval(function () {}, 12);

                assert.same(this.server.longestTimeout, 92);
            });

            it("does not reset clock", function () {
                this.server.respond("");

                assert.same(setTimeout.clock, this.clock);
            });
        });

        describe(".respond", function () {
            var sandbox;

            beforeEach(function () {
                this.server = sinonFakeServerWithClock.create();
                this.server.addRequest({ async: true });
            });

            afterEach(function () {
                this.server.restore();
                if (sandbox) {
                    sandbox.restore();
                    sandbox = null;
                }
            });

            it("ticks the clock to fire the longest timeout", function () {
                this.server.longestTimeout = 96;

                this.server.respond();

                assert.equals(this.server.clock.now, 96);
            });

            it("ticks the clock to fire the longest timeout when multiple responds", function () {
                setInterval(function () {}, 13);
                this.server.respond();
                var xhr = new FakeXMLHttpRequest();
                // please the linter, we can't have unused variables
                // even when we're instantiating FakeXMLHttpRequest for it's side effects
                assert(xhr);
                setInterval(function () {}, 17);
                this.server.respond();

                assert.equals(this.server.clock.now, 17);
            });

            it("resets longest timeout", function () {
                this.server.longestTimeout = 96;

                this.server.respond();

                assert.equals(this.server.longestTimeout, 0);
            });

            it("calls original respond", function () {
                sandbox = sinonSandbox.create();
                var obj = {};
                var respond = sandbox.stub(sinonFakeServer, "respond").returns(obj);

                var result = this.server.respond("GET", "/", "");

                assert.equals(result, obj);
                assert(respond.calledWith("GET", "/", ""));
                assert(respond.calledOn(this.server));
            });
        });

        describe("jQuery compat mode", function () {
            beforeEach(function () {
                this.server = sinonFakeServerWithClock.create();

                this.request = new FakeXMLHttpRequest();
                this.request.open("get", "/", true);
                this.request.send();
                sinonSpy(this.request, "respond");
            });

            afterEach(function () {
                this.server.restore();
            });

            it("handles clock automatically", function () {
                this.server.respondWith("OK");
                var spy = sinonSpy();

                setTimeout(spy, 13);
                this.server.respond();
                this.server.restore();

                assert(spy.called);
                assert.same(setTimeout, fakeTimers.timers.setTimeout);
            });

            it("finishes xhr from setInterval like jQuery 1.3.x does", function () {
                this.server.respondWith("Hello World");
                var xhr = new FakeXMLHttpRequest();
                xhr.open("GET", "/");
                xhr.send();

                var spy = sinonSpy();

                setInterval(function () {
                    spy(xhr.responseText, xhr.statusText, xhr);
                }, 13);

                this.server.respond();

                assert.equals(spy.args[0][0], "Hello World");
                assert.equals(spy.args[0][1], "OK");
                assert.equals(spy.args[0][2].status, 200);
            });
        });
    });
}
