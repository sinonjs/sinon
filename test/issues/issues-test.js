"use strict";

var referee = require("referee");
var sinon = require("../../lib/sinon");
var configureLogError = require("../../lib/sinon/util/core/log_error.js");
var assert = referee.assert;
var refute = referee.refute;


describe("issues", function () {
    beforeEach(function () {
        this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    it("#283", function () {
        function testSinonFakeTimersWith(interval, ticks) {
            var clock = sinon.useFakeTimers();

            var spy = sinon.spy();
            var id = setInterval(spy, interval);
            assert(!spy.calledOnce);
            clock.tick(ticks);
            assert(spy.callCount === Math.floor(ticks / interval));

            clearInterval(id);
            clock.restore();
        }

        testSinonFakeTimersWith(10, 101);
        testSinonFakeTimersWith(99, 101);
        testSinonFakeTimersWith(100, 200);
        testSinonFakeTimersWith(199, 200);
        testSinonFakeTimersWith(500, 1001);
        testSinonFakeTimersWith(1000, 1001);
    });

    it.skip("#397", function () {
        var clock = sinon.useFakeTimers();

        var cb2 = sinon.spy();
        var cb1 = sinon.spy(function () {
            setTimeout(cb2, 0);
        });

        setTimeout(cb1, 0);

        clock.tick(10);
        assert(cb1.called);
        assert(!cb2.called);

        clock.tick(10);
        assert(cb2.called);

        clock.restore();
    });

    describe("#458", function () {
        if (typeof require("fs").readFileSync !== "undefined") {
            describe("on node", function () {
                it("stub out fs.readFileSync", function () {
                    var fs = require("fs");
                    var testCase = this;

                    refute.exception(function () {
                        testCase.sandbox.stub(fs, "readFileSync");
                    });
                });
            });
        }
    });

    describe("#624", function () {
        it.skip("useFakeTimers should be idempotent", function () {
            // Issue #624 shows that useFakeTimers is not idempotent when it comes to
            // using Date.now
            // This test verifies that it's working, at least for Date.now
            var clock;

            clock = sinon.useFakeTimers(new Date("2014-12-29").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-12-15").getTime());
            assert.equals(clock.now, Date.now());

            clock = sinon.useFakeTimers(new Date("2015-1-5").getTime());
            assert.equals(clock.now, Date.now());
        });
    });

    describe("#835", function () {
        it("logError() throws an exception if the passed err is read-only", function () {
            var logError = configureLogError({useImmediateExceptions: true});

            // passes
            var err = { name: "TestError", message: "this is a proper exception" };
            try {
                logError("#835 test", err);
            } catch (ex) {
                assert.equals(ex.name, err.name);
            }

            // fails until this issue is fixed
            try {
                logError("#835 test", "this literal string is not a proper exception");
            } catch (ex) {
                assert.equals(ex.name, "#835 test");
            }
        });
    });

    describe("#852 - createStubInstance on intherited constructors", function () {
        it("must not throw error", function () {
            var A = function () {};
            var B = function () {};

            B.prototype = Object.create(A.prototype);
            B.prototype.constructor = A;

            refute.exception(function () {
                sinon.createStubInstance(B);
            });
        });
    });

    describe("#852(2) - createStubInstance should on same constructor", function () {
        it("must be idempotent", function () {
            var A = function () {};
            refute.exception(function () {
                sinon.createStubInstance(A);
                sinon.createStubInstance(A);
            });
        });
    });
});
