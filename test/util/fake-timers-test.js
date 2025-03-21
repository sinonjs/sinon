"use strict";

const referee = require("@sinonjs/referee");
const fakeTimers = require("../../lib/sinon/util/fake-timers");
const sinonStub = require("../../lib/sinon/stub");
const sinonSpy = require("../../lib/sinon/spy");

const assert = referee.assert;
const refute = referee.refute;
const GlobalDate = Date;
const setImmediatePresent = typeof setImmediate === "function";

// `setTimeout` supports a string as the first argument, which we currently
// support for historical reasons
//
// This is not supported in node, and `@sinonjs/fake-timers` will throw an
// error, when passed a string as the first argument in node
//
// See https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
function supportsCodeInSettimeout() {
    try {
        // eslint-disable-next-line no-implied-eval
        const id = setTimeout("console.log('hello');", 100);
        clearTimeout(id);
        return true;
    } catch (error) {
        return false;
    }
}

const usesEvalInSettimeout = supportsCodeInSettimeout();

describe("fakeTimers.clock", function () {
    beforeEach(function () {
        this.global = typeof global !== "undefined" ? global : window;
    });

    describe(".setTimeout", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
            this.global.sinonClockEvalCalled = false;
        });

        afterEach(function () {
            delete this.global.sinonClockEvalCalled;
        });

        it("throws if no arguments", function () {
            const clock = this.clock;

            assert.exception(function () {
                clock.setTimeout();
            });
        });

        it("returns a timer id whose primitive representation is a number", function () {
            // eslint-disable-next-line no-empty-function
            const noop = function () {};
            const result = this.clock.setTimeout(noop);

            assert.isNumber(Number(result));
        });

        it("returns unique id", function () {
            // eslint-disable-next-line no-empty-function
            const noop = function () {};
            const id1 = this.clock.setTimeout(noop);
            const id2 = this.clock.setTimeout(noop);

            refute.equals(id2, id1);
        });

        it("sets timers on instance", function () {
            const clock1 = fakeTimers.clock.create();
            const clock2 = fakeTimers.clock.create();
            const stubs = [sinonStub(), sinonStub()];

            clock1.setTimeout(stubs[0], 100);
            clock2.setTimeout(stubs[1], 100);
            clock2.tick(200);

            assert.isFalse(stubs[0].called);
            assert(stubs[1].called);
        });

        if (!usesEvalInSettimeout) {
            it("throws on non-function callbacks", function () {
                const string = "apple pie";

                assert.exception(
                    function () {
                        this.clock.setTimeout(string, 10);
                    }.bind(this),
                    {
                        message:
                            "[ERR_INVALID_CALLBACK]: Callback must be a function. Received apple pie of type string",
                    },
                );
            });
        }

        it("passes setTimeout parameters", function () {
            const clock = fakeTimers.clock.create();
            const stub = sinonStub();

            clock.setTimeout(stub, 2, "the first", "the second");

            clock.tick(3);

            assert.isTrue(stub.calledWithExactly("the first", "the second"));
        });

        it("calls correct timeout on recursive tick", function () {
            const clock = fakeTimers.clock.create();
            const stub = sinonStub();
            const recurseCallback = function () {
                clock.tick(100);
            };

            clock.setTimeout(recurseCallback, 50);
            clock.setTimeout(stub, 100);

            clock.tick(50);
            assert(stub.called);
        });
    });

    describe(".setImmediate", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
        });

        if (typeof setImmediate === "function") {
            it("returns a timer whose primitive representation is a number", function () {
                const result = this.clock.setImmediate(function () {
                    return;
                });

                assert.isNumber(Number(result));
            });

            it("calls the given callback immediately", function () {
                const stub = sinonStub();

                this.clock.setImmediate(stub);
                this.clock.tick(0);

                assert(stub.called);
            });

            it("throws if no arguments", function () {
                const clock = this.clock;

                assert.exception(function () {
                    clock.setImmediate();
                });
            });

            it("manages separate timers per clock instance", function () {
                const clock1 = fakeTimers.clock.create();
                const clock2 = fakeTimers.clock.create();
                const stubs = [sinonStub(), sinonStub()];

                clock1.setImmediate(stubs[0]);
                clock2.setImmediate(stubs[1]);
                clock2.tick(0);

                assert.isFalse(stubs[0].called);
                assert(stubs[1].called);
            });

            it("passes extra parameters through to the callback", function () {
                const stub = sinonStub();

                this.clock.setImmediate(stub, "value1", 2);
                this.clock.tick(1);

                assert(stub.calledWithExactly("value1", 2));
            });
        } else {
            it("shouldn't install setImmediate", function () {
                refute.isFunction(this.clock.setImmediate);
            });
        }
    });

    describe(".clearImmediate", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
        });

        if (typeof clearImmediate === "function") {
            it("removes immediate callbacks", function () {
                const callback = sinonStub();

                const id = this.clock.setImmediate(callback);
                this.clock.clearImmediate(id);
                this.clock.tick(1);

                assert.isFalse(callback.called);
            });
        } else {
            it("shouldn't install clearImmediate", function () {
                refute.isFunction(this.clock.clearImmediate);
            });
        }
    });

    describe(".tick", function () {
        beforeEach(function () {
            this.clock = fakeTimers.useFakeTimers(0);
        });

        afterEach(function () {
            this.clock.restore();
        });

        it("triggers immediately without specified delay", function () {
            const stub = sinonStub();
            this.clock.setTimeout(stub);

            this.clock.tick(0);

            assert(stub.called);
        });

        it("does not trigger without sufficient delay", function () {
            const stub = sinonStub();
            this.clock.setTimeout(stub, 100);
            this.clock.tick(10);

            assert.isFalse(stub.called);
        });

        it("triggers after sufficient delay", function () {
            const stub = sinonStub();
            this.clock.setTimeout(stub, 100);
            this.clock.tick(100);

            assert(stub.called);
        });

        it("triggers simultaneous timers", function () {
            const spies = [sinonSpy(), sinonSpy()];
            this.clock.setTimeout(spies[0], 100);
            this.clock.setTimeout(spies[1], 100);

            this.clock.tick(100);

            assert(spies[0].called);
            assert(spies[1].called);
        });

        it("triggers multiple simultaneous timers", function () {
            const spies = [sinonSpy(), sinonSpy(), sinonSpy(), sinonSpy()];
            this.clock.setTimeout(spies[0], 100);
            this.clock.setTimeout(spies[1], 100);
            this.clock.setTimeout(spies[2], 99);
            this.clock.setTimeout(spies[3], 100);

            this.clock.tick(100);

            assert(spies[0].called);
            assert(spies[1].called);
            assert(spies[2].called);
            assert(spies[3].called);
        });

        it("triggers multiple simultaneous timers with zero callAt", function () {
            const test = this;
            const spies = [
                sinonSpy(function () {
                    test.clock.setTimeout(spies[1], 0);
                }),
                sinonSpy(),
                sinonSpy(),
            ];

            // First spy calls another setTimeout with delay=0
            this.clock.setTimeout(spies[0], 0);
            this.clock.setTimeout(spies[2], 10);

            this.clock.tick(10);

            assert(spies[0].called);
            assert(spies[1].called);
            assert(spies[2].called);
        });

        it("waits after setTimeout was called", function () {
            this.clock.tick(100);
            const stub = sinonStub();
            this.clock.setTimeout(stub, 150);
            this.clock.tick(50);

            assert.isFalse(stub.called);
            this.clock.tick(100);
            assert(stub.called);
        });

        it("mini integration test", function () {
            const stubs = [sinonStub(), sinonStub(), sinonStub()];
            this.clock.setTimeout(stubs[0], 100);
            this.clock.setTimeout(stubs[1], 120);
            this.clock.tick(10);
            this.clock.tick(89);
            assert.isFalse(stubs[0].called);
            assert.isFalse(stubs[1].called);
            this.clock.setTimeout(stubs[2], 20);
            this.clock.tick(1);
            assert(stubs[0].called);
            assert.isFalse(stubs[1].called);
            assert.isFalse(stubs[2].called);
            this.clock.tick(19);
            assert.isFalse(stubs[1].called);
            assert(stubs[2].called);
            this.clock.tick(1);
            assert(stubs[1].called);
        });

        it("triggers even when some throw", function () {
            const clock = this.clock;
            const stubs = [sinonStub().throws(), sinonStub()];

            clock.setTimeout(stubs[0], 100);
            clock.setTimeout(stubs[1], 120);

            assert.exception(function () {
                clock.tick(120);
            });

            assert(stubs[0].called);
            assert(stubs[1].called);
        });

        it("calls function with global object or null (strict mode) as this", function () {
            const clock = this.clock;
            const stub = sinonStub().throws();
            clock.setTimeout(stub, 100);

            assert.exception(function () {
                clock.tick(100);
            });

            assert(stub.calledOn(this.global) || stub.calledOn(null));
        });

        it("triggers in the order scheduled", function () {
            const spies = [sinonSpy(), sinonSpy()];
            this.clock.setTimeout(spies[0], 13);
            this.clock.setTimeout(spies[1], 11);

            this.clock.tick(15);

            assert(spies[1].calledBefore(spies[0]));
        });

        it("creates updated Date while ticking", function () {
            const spy = sinonSpy();

            this.clock.setInterval(function () {
                spy(new Date().getTime());
            }, 10);

            this.clock.tick(100);

            assert.equals(spy.callCount, 10);
            assert(spy.calledWith(10));
            assert(spy.calledWith(20));
            assert(spy.calledWith(30));
            assert(spy.calledWith(40));
            assert(spy.calledWith(50));
            assert(spy.calledWith(60));
            assert(spy.calledWith(70));
            assert(spy.calledWith(80));
            assert(spy.calledWith(90));
            assert(spy.calledWith(100));
        });

        it("fires timer in intervals of 13", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 13);

            this.clock.tick(500);

            assert.equals(spy.callCount, 38);
        });

        it("fires timers in correct order", function () {
            this.timeout(5000);

            const spy13 = sinonSpy();
            const spy10 = sinonSpy();

            this.clock.setInterval(function () {
                spy13(new Date().getTime());
            }, 13);

            this.clock.setInterval(function () {
                spy10(new Date().getTime());
            }, 10);

            this.clock.tick(500);

            assert.equals(spy13.callCount, 38);
            assert.equals(spy10.callCount, 50);

            assert(spy13.calledWith(416));
            assert(spy10.calledWith(320));

            assert(spy10.getCall(0).calledBefore(spy13.getCall(0)));
            assert(spy10.getCall(4).calledBefore(spy13.getCall(3)));
        });

        it("triggers timeouts and intervals in the order scheduled", function () {
            const spies = [sinonSpy(), sinonSpy()];
            this.clock.setInterval(spies[0], 10);
            this.clock.setTimeout(spies[1], 50);

            this.clock.tick(100);

            assert(spies[0].calledBefore(spies[1]));
            assert.equals(spies[0].callCount, 10);
            assert.equals(spies[1].callCount, 1);
        });

        it("does not fire canceled intervals", function () {
            // eslint-disable-next-line prefer-const
            let id;
            const callback = sinonSpy(function () {
                if (callback.callCount === 3) {
                    clearInterval(id);
                }
            });

            id = this.clock.setInterval(callback, 10);
            this.clock.tick(100);

            assert.equals(callback.callCount, 3);
        });

        it("passes 6 seconds", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 4000);

            this.clock.tick("08");

            assert.equals(spy.callCount, 2);
        });

        it("passes 1 minute", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 6000);

            this.clock.tick("01:00");

            assert.equals(spy.callCount, 10);
        });

        it("passes 2 hours, 34 minutes and 12 seconds", function () {
            this.timeout(50000);

            const spy = sinonSpy();
            this.clock.setInterval(spy, 10000);

            this.clock.tick("02:34:10");

            assert.equals(spy.callCount, 925);
        });

        it("throws for invalid format", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 10000);
            const test = this;

            assert.exception(function () {
                test.clock.tick("12:02:34:10");
            });

            assert.equals(spy.callCount, 0);
        });

        it("throws for invalid minutes", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 10000);
            const test = this;

            assert.exception(function () {
                test.clock.tick("67:10");
            });

            assert.equals(spy.callCount, 0);
        });

        it("throws for negative minutes", function () {
            const spy = sinonSpy();
            this.clock.setInterval(spy, 10000);
            const test = this;

            assert.exception(function () {
                test.clock.tick("-7:10");
            });

            assert.equals(spy.callCount, 0);
        });

        it("treats missing argument as 0", function () {
            this.clock.tick();

            assert.equals(this.clock.now, 0);
        });

        it("fires nested setTimeout calls properly", function () {
            let i = 0;
            const clock = this.clock;

            const callback = function () {
                ++i;
                clock.setTimeout(function () {
                    callback();
                }, 100);
            };

            callback();

            clock.tick(1000);

            assert.equals(i, 11);
        });

        it("does not silently catch exceptions", function () {
            const clock = this.clock;

            clock.setTimeout(function () {
                throw new Error("oh no!");
            }, 1000);

            assert.exception(function () {
                clock.tick(1000);
            });
        });

        it("returns the current now value", function () {
            const clock = this.clock;
            const value = clock.tick(200);
            assert.equals(clock.now, value);
        });
    });

    describe(".clearTimeout", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
        });

        it("removes timeout", function () {
            const stub = sinonStub();
            const id = this.clock.setTimeout(stub, 50);
            this.clock.clearTimeout(id);
            this.clock.tick(50);

            assert.isFalse(stub.called);
        });

        it("ignores null argument", function () {
            this.clock.clearTimeout(null);
            assert(true); // doesn't fail
        });
    });

    describe(".reset", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
        });

        it("empties timeouts queue", function () {
            const stub = sinonStub();
            this.clock.setTimeout(stub);
            this.clock.reset();
            this.clock.tick(0);

            assert.isFalse(stub.called);
        });
    });

    describe(".setInterval", function () {
        beforeEach(function () {
            this.clock = fakeTimers.clock.create();
        });

        it("throws if no arguments", function () {
            const clock = this.clock;

            assert.exception(function () {
                clock.setInterval();
            });
        });

        it("returns a timer whose primitive representation is a number", function () {
            // eslint-disable-next-line no-empty-function
            const noop = function () {};
            const result = this.clock.setInterval(noop);

            assert.isNumber(Number(result));
        });

        it("returns unique id", function () {
            // eslint-disable-next-line no-empty-function
            const noop = function () {};
            const id1 = this.clock.setInterval(noop);
            const id2 = this.clock.setInterval(noop);

            refute.equals(id2, id1);
        });

        it("schedules recurring timeout", function () {
            const stub = sinonStub();
            this.clock.setInterval(stub, 10);
            this.clock.tick(99);

            assert.equals(stub.callCount, 9);
        });

        it("does not schedule recurring timeout when cleared", function () {
            const clock = this.clock;
            // eslint-disable-next-line
            let id;
            const stub = sinonSpy(function () {
                if (stub.callCount === 3) {
                    clock.clearInterval(id);
                }
            });

            id = this.clock.setInterval(stub, 10);
            this.clock.tick(100);

            assert.equals(stub.callCount, 3);
        });

        it("passes setTimeout parameters", function () {
            const clock = fakeTimers.clock.create();
            const stub = sinonStub();

            clock.setInterval(stub, 2, "the first", "the second");

            clock.tick(3);

            assert.isTrue(stub.calledWithExactly("the first", "the second"));
        });
    });

    describe(".date", function () {
        beforeEach(function () {
            this.now = new GlobalDate().getTime() - 3000;
            this.clock = fakeTimers.clock.create(this.now);
            this.Date = this.global.Date;
        });

        afterEach(function () {
            this.global.Date = this.Date;
        });

        it("provides date constructor", function () {
            assert.isFunction(this.clock.Date);
        });

        it("creates real Date objects", function () {
            const date = new this.clock.Date();

            assert(Date.prototype.isPrototypeOf(date));
        });

        it("creates date strings when called as function", function () {
            const date = this.clock.Date();

            assert.isString(date);
        });

        it("creates real Date objects when Date constructor is gone", function () {
            const OriginalDateClass = Date;

            // eslint-disable-next-line no-global-assign, no-native-reassign
            Date = function () {
                return;
            };
            this.global.Date = function () {
                return;
            };

            const date = new this.clock.Date();

            assert(date instanceof OriginalDateClass);
        });

        it("creates Date objects representing clock time", function () {
            const date = new this.clock.Date();

            assert.equals(date.getTime(), new Date(this.now).getTime());
        });

        it("listens to ticking clock", function () {
            const date1 = new this.clock.Date();
            this.clock.tick(3);
            const date2 = new this.clock.Date();

            assert.equals(date2.getTime() - date1.getTime(), 3);
        });

        it("creates regular date when passing timestamp", function () {
            const date = new Date();
            const fakeDate = new this.clock.Date(date.getTime());

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing year, month", function () {
            const date = new Date(2010, 4);
            const fakeDate = new this.clock.Date(2010, 4);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing y, m, d", function () {
            const date = new Date(2010, 4, 2);
            const fakeDate = new this.clock.Date(2010, 4, 2);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing y, m, d, h", function () {
            const date = new Date(2010, 4, 2, 12);
            const fakeDate = new this.clock.Date(2010, 4, 2, 12);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing y, m, d, h, m", function () {
            const date = new Date(2010, 4, 2, 12, 42);
            const fakeDate = new this.clock.Date(2010, 4, 2, 12, 42);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing y, m, d, h, m, s", function () {
            const date = new Date(2010, 4, 2, 12, 42, 53);
            const fakeDate = new this.clock.Date(2010, 4, 2, 12, 42, 53);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("creates regular date when passing y, m, d, h, m, s, ms", function () {
            const date = new Date(2010, 4, 2, 12, 42, 53, 498);
            const fakeDate = new this.clock.Date(2010, 4, 2, 12, 42, 53, 498);

            assert.equals(fakeDate.getTime(), date.getTime());
        });

        it("supports now method if present", function () {
            assert.same(typeof this.clock.Date.now, typeof Date.now);
        });

        describe(".now", function () {
            before(function () {
                if (typeof Date.now !== "function") {
                    this.skip();
                }
            });

            it("returns clock.now", function () {
                assert.equals(this.clock.Date.now(), this.now);
            });
        });

        describe("unsupported now", function () {
            before(function () {
                if (typeof Date.now === "function") {
                    this.skip();
                }
            });

            it("is undefined", function () {
                assert.isUndefined(this.clock.Date.now);
            });
        });

        it("mirrors parse method", function () {
            assert.same(this.clock.Date.parse, Date.parse);
        });

        it("mirrors UTC method", function () {
            assert.same(this.clock.Date.UTC, Date.UTC);
        });

        it("mirrors toUTCString method", function () {
            assert.same(
                this.clock.Date.prototype.toUTCString,
                Date.prototype.toUTCString,
            );
        });

        describe(".toSource", function () {
            before(function () {
                if (typeof Date.toSource !== "function") {
                    this.skip();
                }
            });

            it("is mirrored", function () {
                assert.same(this.clock.Date.toSource(), Date.toSource());
            });
        });

        describe("unsupported toSource", function () {
            before(function () {
                if (typeof Date.toSource === "function") {
                    this.skip();
                }
            });

            it("is undefined", function () {
                assert.isUndefined(this.clock.Date.toSource);
            });
        });

        it("mirrors toString", function () {
            assert.same(this.clock.Date.toString(), Date.toString());
        });
    });

    describe(".useFakeTimers", function () {
        beforeEach(function () {
            this.dateNow = this.global.Date.now;
            this.original = {
                Date: this.global.Date,
                setTimeout: this.global.setTimeout,
                clearTimeout: this.global.clearTimeout,
                setInterval: this.global.setInterval,
                clearInterval: this.global.clearInterval,
                setImmediate: this.global.setImmediate,
                clearImmediate: this.global.clearImmediate,
            };
        });

        afterEach(function () {
            this.global.Date = this.original.Date;
            this.global.setTimeout = this.original.setTimeout;
            this.global.clearTimeout = this.original.clearTimeout;
            this.global.setInterval = this.original.setInterval;
            this.global.clearInterval = this.original.clearInterval;
            this.global.setImmediate = this.original.setImmediate;
            this.global.clearImmediate = this.original.clearImmediate;

            clearTimeout(this.timer);
            if (typeof this.dateNow === "undefined") {
                delete this.global.Date.now;
            } else {
                this.global.Date.now = this.dateNow;
            }
        });

        it("returns clock object", function () {
            this.clock = fakeTimers.useFakeTimers();

            assert.isObject(this.clock);
            assert.isFunction(this.clock.tick);
        });

        it("has clock property", function () {
            this.clock = fakeTimers.useFakeTimers();

            assert.same(setTimeout.clock, this.clock);
            assert.same(clearTimeout.clock, this.clock);
            assert.same(setInterval.clock, this.clock);
            assert.same(clearInterval.clock, this.clock);
            assert.same(Date.clock, this.clock);
        });

        it("sets initial timestamp", function () {
            this.clock = fakeTimers.useFakeTimers(1400);

            assert.equals(this.clock.now, 1400);
        });

        it("replaces global setTimeout", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();

            setTimeout(stub, 1000);
            this.clock.tick(1000);

            assert(stub.called);
        });

        it("returns a timer whose primitive representation is a number", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();
            const to = setTimeout(stub, 1000);

            assert.isNumber(Number(to));
        });

        it("replaces global clearTimeout", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();

            clearTimeout(setTimeout(stub, 1000));
            this.clock.tick(1000);

            assert.isFalse(stub.called);
        });

        it("restores global setTimeout", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();
            this.clock.restore();

            this.timer = setTimeout(stub, 1000);
            this.clock.tick(1000);

            assert.isFalse(stub.called);
            assert.same(setTimeout, fakeTimers.timers.setTimeout);
        });

        it("restores global clearTimeout", function () {
            this.clock = fakeTimers.useFakeTimers();
            sinonStub();
            this.clock.restore();

            assert.same(clearTimeout, fakeTimers.timers.clearTimeout);
        });

        it("replaces global setInterval", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();

            setInterval(stub, 500);
            this.clock.tick(1000);

            assert(stub.calledTwice);
        });

        it("replaces global clearInterval", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();

            clearInterval(setInterval(stub, 500));
            this.clock.tick(1000);

            assert.isFalse(stub.called);
        });

        it("restores global setInterval", function () {
            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();
            this.clock.restore();

            this.timer = setInterval(stub, 1000);
            this.clock.tick(1000);

            assert.isFalse(stub.called);
            assert.same(setInterval, fakeTimers.timers.setInterval);
        });

        it("restores global clearInterval", function () {
            this.clock = fakeTimers.useFakeTimers();
            sinonStub();
            this.clock.restore();

            assert.same(clearInterval, fakeTimers.timers.clearInterval);
        });

        it("restores global setImmediate", function () {
            if (typeof setImmediate !== "function") {
                this.skip();
            }

            this.clock = fakeTimers.useFakeTimers();
            const stub = sinonStub();
            this.clock.restore();

            this.timer = setImmediate(stub);
            this.clock.tick(1);

            assert.isFalse(stub.called);
            assert.same(setImmediate, fakeTimers.timers.setImmediate);
        });

        it("does not install global setImmediate", function () {
            if (typeof setImmediate !== "undefined") {
                this.skip();
            }

            this.clock = fakeTimers.useFakeTimers();

            assert.isUndefined(setImmediate);
        });

        it("restores global clearImmediate", function () {
            if (typeof clearImmediate !== "function") {
                this.skip();
            }

            this.clock = fakeTimers.useFakeTimers();
            sinonStub();
            this.clock.restore();

            assert.same(clearImmediate, fakeTimers.timers.clearImmediate);
        });

        it("does not install global clearImmediate", function () {
            if (typeof clearImmediate !== "undefined") {
                this.skip();
            }

            this.clock = fakeTimers.useFakeTimers();

            assert.isUndefined(clearImmediate);
        });

        it("deletes global timer on restore if it was inherited onto the global object", function () {
            const globalProto = {
                Date: class SomeDate {},
                setTimeout() {
                    return 42;
                },
            };
            const global = Object.create(globalProto);

            this.clock = fakeTimers.useFakeTimers({
                global,
                toFake: ["setTimeout"],
            });
            assert(global.hasOwnProperty("setTimeout"));
            this.clock.restore();

            refute(global.hasOwnProperty("setTimeout"));
        });

        it("restores global timer on restore if it is present on the global object itself", function () {
            // Directly give the global object a tick method
            function originalSetTimeout() {
                return 42;
            }

            const global = {
                Date: class SomeDate {},
                setTimeout: originalSetTimeout,
            };

            this.clock = fakeTimers.useFakeTimers({
                global,
                toFake: ["setTimeout"],
            });
            assert(global.hasOwnProperty("setTimeout"));
            refute.equals(global.setTimeout, originalSetTimeout);
            this.clock.restore();

            assert(global.hasOwnProperty("setTimeout"));
            assert.equals(global.setTimeout, originalSetTimeout);
        });

        it("fakes Date constructor", function () {
            this.clock = fakeTimers.useFakeTimers(0);
            const now = new Date();

            refute.same(Date, fakeTimers.timers.Date);
            assert.equals(now.getTime(), 0);
        });

        it("fake Date constructor should mirror Date's properties", function () {
            this.clock = fakeTimers.useFakeTimers(0);

            assert(Boolean(Date.parse));
            assert(Boolean(Date.UTC));
        });

        it("decide on Date.now support at call-time when supported", function () {
            this.global.Date.now = function () {
                return;
            };
            this.clock = fakeTimers.useFakeTimers(0);

            assert.equals(typeof Date.now, "function");
        });

        it("decide on Date.now support at call-time when unsupported", function () {
            this.global.Date.now = null;
            this.clock = fakeTimers.useFakeTimers(0);

            assert.isNull(Date.now);
        });

        it("mirrors custom Date properties", function () {
            const f = function () {
                return;
            };
            this.global.Date.format = f;
            fakeTimers.useFakeTimers();

            assert.equals(Date.format, f);
        });

        it("restores Date constructor", function () {
            this.clock = fakeTimers.useFakeTimers(0);
            this.clock.restore();

            assert.same(GlobalDate, fakeTimers.timers.Date);
        });

        it("fakes provided methods", function () {
            this.clock = fakeTimers.useFakeTimers({
                toFake: ["setTimeout", "Date"],
            });

            refute.same(setTimeout, fakeTimers.timers.setTimeout);
            refute.same(Date, fakeTimers.timers.Date);
        });

        it("resets faked methods", function () {
            this.clock = fakeTimers.useFakeTimers({
                toFake: ["setTimeout", "Date"],
            });
            this.clock.restore();

            assert.same(setTimeout, fakeTimers.timers.setTimeout);
            assert.same(Date, fakeTimers.timers.Date);
        });

        it("does not fake methods not provided", function () {
            this.clock = fakeTimers.useFakeTimers({
                toFake: ["setTimeout", "Date"],
            });

            assert.same(clearTimeout, fakeTimers.timers.clearTimeout);
            assert.same(setInterval, fakeTimers.timers.setInterval);
            assert.same(clearInterval, fakeTimers.timers.clearInterval);
        });

        context("with nextTick", function () {
            before(function () {
                if (
                    typeof process === "undefined" ||
                    typeof process.nextTick === "undefined"
                ) {
                    this.skip();
                }
            });

            it("installs nextTick by default", function () {
                this.clock = fakeTimers.useFakeTimers();
                let called = false;
                process.nextTick(function () {
                    called = true;
                });
                this.clock.runAll();
                assert(called);
                this.clock.restore();
            });
        });

        it("installs clock in advancing mode and triggers setTimeout", function (done) {
            this.clock = fakeTimers.useFakeTimers({ shouldAdvanceTime: true });
            this.clock.setTimeout(
                function () {
                    this.clock.restore();
                    done();
                }.bind(this),
                10,
            );
        });

        it("installs clock in advancing mode and triggers setInterval", function (done) {
            this.clock = fakeTimers.useFakeTimers({ shouldAdvanceTime: true });
            let counter = 0;
            const iterations = 3;
            const id = this.clock.setInterval(
                function () {
                    if (counter++ < iterations) {
                        return;
                    }
                    this.clock.clearInterval(id);
                    this.clock.restore();
                    done();
                }.bind(this),
                10,
            );
        });

        it("installs clock in advancing mode and triggers setImmediate", function (done) {
            if (!setImmediatePresent) {
                this.skip();
            }

            this.clock = fakeTimers.useFakeTimers({ shouldAdvanceTime: true });
            this.clock.setImmediate(
                function () {
                    this.clock.restore();
                    done();
                }.bind(this),
            );
        });

        it("throws on old useFakeTimers signatures", function () {
            const expectedError =
                "useFakeTimers expected epoch or config object. See https://github.com/sinonjs/sinon";

            assert.exception(
                function () {
                    fakeTimers.useFakeTimers("setImmediate");
                },
                { name: "TypeError", message: expectedError },
            );

            assert.exception(
                function () {
                    fakeTimers.useFakeTimers("setImmediate", "Date");
                },
                { name: "TypeError", message: expectedError },
            );

            assert.exception(
                function () {
                    fakeTimers.useFakeTimers(1000, "setImmediate", "Date");
                },
                { name: "TypeError", message: expectedError },
            );

            assert.exception(
                function () {
                    fakeTimers.useFakeTimers(
                        new Date(10000000),
                        "setImmediate",
                        "Date",
                    );
                },
                { name: "TypeError", message: expectedError },
            );
        });

        it("supports a way to pass the global context", function () {
            const stub = sinonStub();
            const globalCtx = {
                Date: sinonStub(),
                setTimeout: stub,
                clearTimeout: sinonStub(),
            };
            this.clock = fakeTimers.useFakeTimers({
                global: globalCtx,
                toFake: Object.keys(globalCtx),
            });
            assert.isUndefined(this.clock.performance);
            assert.same(this.clock._setTimeout, stub); // eslint-disable-line no-underscore-dangle
            this.clock.restore();
        });
    });
});
