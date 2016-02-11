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
        },

        "#852 - createStubInstance on intherited constructors": {
            "must not throw error": function () {
                var A = function () {};
                var B = function () {};

                B.prototype = Object.create(A.prototype);
                B.prototype.constructor = A;

                refute.exception(function () {
                    sinon.createStubInstance(B);
                });
            }
        },

        "#852(2) - createStubInstance should on same constructor": {
            "must be idempotent": function () {
                var A = function () {};
                refute.exception(function () {
                    sinon.createStubInstance(A);
                    sinon.createStubInstance(A);
                });
            }
        },

        "#947 - sandbox.reset - prototype methods": {
            "should reset callCount": function () {
                function Car() {}

                Car.prototype.honk = function () {
                    return "honk honk";
                };

                var sandbox = sinon.sandbox.create();
                var car1 = new Car();
                var car2 = new Car();

                var honkSpy = sandbox.spy(car1, "honk");
                var honkStub = sandbox.stub(car2, "honk");

                car1.honk();
                car2.honk();

                assert.equals(honkSpy.callCount, 1);
                assert.equals(honkStub.callCount, 1);

                sandbox.reset();

                assert.equals(car1.honk.callCount, 0);
                assert.equals(car2.honk.callCount, 0);

                sandbox.restore();
            }
        },

        "#947 - sandbox.reset - on instance methods": {
            "should reset callCount": function () {
                function Car() {
                    this.honk = function () {
                        return "honky honky";
                    };
                }

                var sandbox = sinon.sandbox.create();
                var car1 = new Car();
                var car2 = new Car();

                var honkSpy = sandbox.spy(car1, "honk");
                var honkStub = sandbox.stub(car2, "honk");

                honkStub.returns("forty two");

                car1.honk();
                car2.honk();

                assert.equals(honkSpy.callCount, 1);
                assert.equals(honkStub.callCount, 1);

                sandbox.reset();

                assert.equals(car1.honk.callCount, 0);
                assert.equals(car2.honk.callCount, 0);

                sandbox.restore();
            }
        },

        "#947 - sandbox.reset - on literal object members": {
            "should reset callCount": function () {
                var car = {
                    honk: function () {
                        return "honker";
                    },

                    honky: function () {
                        return "honkity honk";
                    }
                };

                var sandbox = sinon.sandbox.create();

                var honkSpy = sandbox.spy(car, "honk");
                var honkStub = sandbox.stub(car, "honky", function () {
                    return 42;
                });

                car.honk();
                car.honky();

                assert.equals(honkSpy.callCount, 1);
                assert.equals(honkStub.callCount, 1);

                sandbox.reset();

                assert.equals(car.honk.callCount, 0);
                assert.equals(car.honky.callCount, 0);

                sandbox.restore();
            }
        }
    });
}(this));
