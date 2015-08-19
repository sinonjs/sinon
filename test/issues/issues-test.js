(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../../lib/sinon");
    var assert = buster.assert;
    var refute = buster.refute;

    buster.testCase("issues", {
        setUp: function () {
            this.sandbox = sinon.sandbox.create();
        },

        tearDown: function () {
            this.sandbox.restore();
        },

        "// #283": function () {
            function testSinonFakeTimersWith(interval, ticks) {
                var clock = sinon.useFakeTimers();

                var spy = sinon.spy();
                var id = setInterval(spy, interval);
                assert(!spy.calledOnce);
                clock.tick(ticks);
                assert(spy.calledOnce);

                clearInterval(id);
                clock.restore();
            }

            // FAILS
            testSinonFakeTimersWith(10, 101);

            // PASS
            testSinonFakeTimersWith(99, 101);

            // FAILS
            testSinonFakeTimersWith(100, 200);

            // PASS
            testSinonFakeTimersWith(199, 200);

            // FAILS
            testSinonFakeTimersWith(500, 1001);

            // PASS
            testSinonFakeTimersWith(1000, 1001);
        },

        "// #397": function () {
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
        },

        "#458": {
            "on node": {
                requiresSupportFor: {
                    process: typeof process !== "undefined"
                },

                "stub out fs.readFileSync": function () {
                    var fs = require("fs");
                    var testCase = this;

                    refute.exception(function () {
                        testCase.sandbox.stub(fs, "readFileSync");
                    });
                }
            }
        },

        "#624": {
            "//useFakeTimers should be idempotent": function () {
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
            }
        }
    });
}(this));
