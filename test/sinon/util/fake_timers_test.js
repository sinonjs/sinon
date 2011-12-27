/*jslint onevar: false, eqeqeq: false, plusplus: false*/
/*globals testCase
          sinon
          called
          jstestdriver
          assert
          assertFalse
          assertEquals
          assertNotEquals
          assertNumber
          assertException
          assertSame
          assertNotSame
          assertUndefined
          assertObject
          assertFunction
          setTimeout
          setInterval
          clearTimeout
          clearInterval*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../../test_case_shim");
    var sinon = require("../../../lib/sinon");
    sinon.extend(sinon, require("../../../lib/sinon/util/fake_timers"));
}

(function (global) {
    testCase("SetTimeOutTest", {
        setUp: function () {
            this.clock = sinon.clock.create();
            sinon.clock.evalCalled = false;
        },

        tearDown: function () {
            delete sinon.clock.evalCalled;
        },

        "should be function": function () {
            assertFunction(this.clock.setTimeout);
        },

        "should throw if no arguments": function () {
            var clock = this.clock;

            assertException(function () {
                clock.setTimeout();
            });
        },

        "should return numeric id": function () {
            var result = this.clock.setTimeout("");

            assertNumber(result);
        },

        "should return unique id": function () {
            var id1 = this.clock.setTimeout("");
            var id2 = this.clock.setTimeout("");

            assertNotEquals(id1, id2);
        },

        "should set timers on instance": function () {
            var clock1 = sinon.clock.create();
            var clock2 = sinon.clock.create();
            var stubs = [sinon.stub.create(), sinon.stub.create()];

            clock1.setTimeout(stubs[0], 100);
            clock2.setTimeout(stubs[1], 100);
            clock2.tick(200);

            assertFalse(stubs[0].called);
            assert(stubs[1].called);
        },

        "should eval non-function callbacks": function () {
            this.clock.setTimeout("sinon.clock.evalCalled = true", 10);
            this.clock.tick(10);

            assert(sinon.clock.evalCalled);
        }
    });

    testCase("ClockTickTest", {
        setUp: function () {
            this.clock = sinon.useFakeTimers(0);
        },

        tearDown: function () {
            this.clock.restore();
        },

        "should trigger immediately without specified delay": function () {
            var stub = sinon.stub.create();
            this.clock.setTimeout(stub);

            this.clock.tick(0);

            assert(stub.called);
        },

        "should not trigger without sufficient delay": function () {
            var stub = sinon.stub.create();
            this.clock.setTimeout(stub, 100);
            this.clock.tick(10);

            assertFalse(stub.called);
        },

        "should trigger after sufficient delay": function () {
            var stub = sinon.stub.create();
            this.clock.setTimeout(stub, 100);
            this.clock.tick(100);

            assert(stub.called);
        },

        "should trigger simultaneous timers": function () {
            var spies = [sinon.spy(), sinon.spy()];
            this.clock.setTimeout(spies[0], 100);
            this.clock.setTimeout(spies[1], 100);

            this.clock.tick(100);

            assert(spies[0].called);
            assert(spies[1].called);
        },

        "should trigger multiple simultaneous timers": function () {
            var spies = [sinon.spy(), sinon.spy(), sinon.spy(), sinon.spy()];
            this.clock.setTimeout(spies[0], 100);
            this.clock.setTimeout(spies[1], 100);
            this.clock.setTimeout(spies[2], 99);
            this.clock.setTimeout(spies[3], 100);

            this.clock.tick(100);

            assert(spies[0].called);
            assert(spies[1].called);
            assert(spies[2].called);
            assert(spies[3].called);
        },

        "should wait after setTimeout was called": function () {
            this.clock.tick(100);
            var stub = sinon.stub.create();
            this.clock.setTimeout(stub, 150);
            this.clock.tick(50);

            assertFalse(stub.called);
            this.clock.tick(100);
            assert(stub.called);
        },

        "mini integration test": function () {
            var stubs = [sinon.stub.create(), sinon.stub.create(), sinon.stub.create()];
            this.clock.setTimeout(stubs[0], 100);
            this.clock.setTimeout(stubs[1], 120);
            this.clock.tick(10);
            this.clock.tick(89);
            assertFalse(stubs[0].called);
            assertFalse(stubs[1].called);
            this.clock.setTimeout(stubs[2], 20);
            this.clock.tick(1);
            assert(stubs[0].called);
            assertFalse(stubs[1].called);
            assertFalse(stubs[2].called);
            this.clock.tick(19);
            assertFalse(stubs[1].called);
            assert(stubs[2].called);
            this.clock.tick(1);
            assert(stubs[1].called);
        },

        "should trigger even when some throw": function () {
            var clock = this.clock;
            var stubs = [sinon.stub.create().throws(), sinon.stub.create()];

            clock.setTimeout(stubs[0], 100);
            clock.setTimeout(stubs[1], 120);

            assertException(function() {
              clock.tick(120);
            });

            assert(stubs[0].called);
            assert(stubs[1].called);
        },

        "should call function with global object or null (strict mode) as this": function () {
            var clock = this.clock;
            var stub = sinon.stub.create().throws();
            clock.setTimeout(stub, 100);

            assertException(function() {
              clock.tick(100);
            });

            assert(stub.calledOn(global) || stub.calledOn(null));
        },

        "should trigger in the order scheduled": function () {
            var spies = [sinon.spy.create(), sinon.spy.create()];
            this.clock.setTimeout(spies[0], 13);
            this.clock.setTimeout(spies[1], 11);

            this.clock.tick(15);

            assert(spies[1].calledBefore(spies[0]));
        },

        "should create updated Date while ticking": function () {
            var spy = sinon.spy.create();

            this.clock.setInterval(function () {
                spy(new Date().getTime());
            }, 10);

            this.clock.tick(100);

            assertEquals(10, spy.callCount);
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
        },

        "should fire timer in intervals of 13": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 13);

            this.clock.tick(500);

            assertEquals(38, spy.callCount);
        },

        "should fire timers in correct order": function () {
            var spy13 = sinon.spy.create();
            var spy10 = sinon.spy.create();

            this.clock.setInterval(function () {
                spy13(new Date().getTime());
            }, 13);

            this.clock.setInterval(function () {
                spy10(new Date().getTime());
            }, 10);

            this.clock.tick(500);

            assertEquals(38, spy13.callCount);
            assertEquals(50, spy10.callCount);

            assert(spy13.calledWith(416));
            assert(spy10.calledWith(320));

            assert(spy10.getCall(0).calledBefore(spy13.getCall(0)));
            assert(spy10.getCall(4).calledBefore(spy13.getCall(3)));
        },

        "should trigger timeouts and intervals in the order scheduled": function () {
            var spies = [sinon.spy.create(), sinon.spy.create()];
            this.clock.setInterval(spies[0], 10);
            this.clock.setTimeout(spies[1], 50);

            this.clock.tick(100);

            assert(spies[0].calledBefore(spies[1]));
            assertEquals(10, spies[0].callCount);
            assertEquals(1, spies[1].callCount);
        },

        "should not fire canceled intervals": function () {
            var id;
            var callback = sinon.spy(function () {
                if (callback.callCount == 3) {
                    clearTimeout(id);
                }
            });

            id = this.clock.setInterval(callback, 10);
            this.clock.tick(100);

            assertEquals(3, callback.callCount);
        },

        "should pass 6 seconds": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 4000);

            this.clock.tick("08");

            assertEquals(2, spy.callCount);
        },

        "should pass 1 minute": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 6000);

            this.clock.tick("01:00");

            assertEquals(10, spy.callCount);
        },

        "should pass 2 hours, 34 minutes and 12 seconds": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 10000);

            this.clock.tick("02:34:10");

            assertEquals(925, spy.callCount);
        },

        "should throw for invalid format": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 10000);
            var test = this;

            assertException(function () {
                test.clock.tick("12:02:34:10");
            });

            assertEquals(0, spy.callCount);
        },

        "should throw for invalid minutes": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 10000);
            var test = this;

            assertException(function () {
                test.clock.tick("67:10");
            });

            assertEquals(0, spy.callCount);
        },

        "should throw for negative minutes": function () {
            var spy = sinon.spy.create();
            this.clock.setInterval(spy, 10000);
            var test = this;

            assertException(function () {
                test.clock.tick("-7:10");
            });

            assertEquals(0, spy.callCount);
        },

        "should treat missing argument as 0": function () {
            this.clock.tick();

            assertEquals(0, this.clock.now);
        },

        "should fire nested setTimeout calls properly": function () {
            var i = 0;
            var clock = this.clock;

            var callback = function () {
                ++i;
                clock.setTimeout(function () {
                    callback();
                }, 100);
            };

            callback();

            clock.tick(1000);

            assertEquals(11, i);
        },

        "should not silently catch exceptions": function () {
          var clock = this.clock;

          clock.setTimeout(function() {
            throw new Exception('oh no!');
          }, 1000);

          assertException(function() {
            clock.tick(1000);
          });
        }
    });

    testCase("ClockClearTimeoutTest", {
        setUp: function () {
            this.clock = sinon.clock.create();
        },

        "should remove timeout": function () {
            var stub = sinon.stub.create();
            var id = this.clock.setTimeout(stub, 50);
            this.clock.clearTimeout(id);
            this.clock.tick(50);

            assertFalse(stub.called);
        }
    });

    testCase("ClockResetTest", {
        setUp: function () {
            this.clock = sinon.clock.create();
        },

        "should empty timeouts queue": function () {
            var stub = sinon.stub.create();
            this.clock.setTimeout(stub);
            this.clock.reset();
            this.clock.tick(0);

            assertFalse(stub.called);
        }
    });

    testCase("SetIntervalTest", {
        setUp: function () {
            this.clock = sinon.clock.create();
        },

        "should be function": function () {
            assertFunction(this.clock.setInterval);
        },

        "should throw if no arguments": function () {
            var clock = this.clock;

            assertException(function () {
                clock.setInterval();
            });
        },

        "should return numeric id": function () {
            var result = this.clock.setInterval("");

            assertNumber(result);
        },

        "should return unique id": function () {
            var id1 = this.clock.setInterval("");
            var id2 = this.clock.setInterval("");

            assertNotEquals(id1, id2);
        },

        "should schedule recurring timeout": function () {
            var stub = sinon.stub.create();
            this.clock.setInterval(stub, 10);
            this.clock.tick(99);

            assertEquals(9, stub.callCount);
        },

        "should not schedule recurring timeout when cleared": function () {
            var clock = this.clock;
            var id;
            var stub = sinon.spy.create(function () {
                if (stub.callCount == 3) {
                    clock.clearInterval(id);
                }
            });

            id = this.clock.setInterval(stub, 10);
            this.clock.tick(100);

            assertEquals(3, stub.callCount);
        }
    });

    testCase("ClockDateTest", {
        setUp: function () {
            this.now = new Date().getTime() - 3000;
            this.clock = sinon.clock.create(this.now);
            this.Date = global.Date;
        },

        tearDown: function () {
            global.Date = this.Date;
        },

        "should provide date constructor": function () {
            assertFunction(this.clock.Date);
        },

        "should create real Date objects": function () {
            var date = new this.clock.Date();

            assert(Date.prototype.isPrototypeOf(date));
        },

        "should create real Date objects when called as function": function () {
            var date = this.clock.Date();

            assert(Date.prototype.isPrototypeOf(date));
        },

        "should create real Date objects when Date constructor is gone": function () {
            var realDate = new Date();
            Date = function () {};
            global.Date = function () {};

            var date = new this.clock.Date();

            assertSame(realDate.constructor.prototype, date.constructor.prototype);
        },

        "should create Date objects representing clock time": function () {
            var date = new this.clock.Date();

            assertEquals(new Date(this.now).getTime(), date.getTime());
        },

        "should return Date object representing clock time": function () {
            var date = this.clock.Date();

            assertEquals(new Date(this.now).getTime(), date.getTime());
        },

        "should listen to ticking clock": function () {
            var date1 = new this.clock.Date();
            this.clock.tick(3);
            var date2 = new this.clock.Date();

            assertEquals(3, date2.getTime() - date1.getTime());
        },

        "should create regular date when passing timestamp": function () {
            var date = new Date();
            var fakeDate = new this.clock.Date(date.getTime());

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with timestamp": function () {
            var date = new Date();
            var fakeDate = this.clock.Date(date.getTime());

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing year, month": function () {
            var date = new Date(2010, 4);
            var fakeDate = new this.clock.Date(2010, 4);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with year, month": function () {
            var date = new Date(2010, 4);
            var fakeDate = this.clock.Date(2010, 4);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing y, m, d": function () {
            var date = new Date(2010, 4, 2);
            var fakeDate = new this.clock.Date(2010, 4, 2);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with y, m, d": function () {
            var date = new Date(2010, 4, 2);
            var fakeDate = this.clock.Date(2010, 4, 2);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing y, m, d, h": function () {
            var date = new Date(2010, 4, 2, 12);
            var fakeDate = new this.clock.Date(2010, 4, 2, 12);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with y, m, d, h": function () {
            var date = new Date(2010, 4, 2, 12);
            var fakeDate = this.clock.Date(2010, 4, 2, 12);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing y, m, d, h, m": function () {
            var date = new Date(2010, 4, 2, 12, 42);
            var fakeDate = new this.clock.Date(2010, 4, 2, 12, 42);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with y, m, d, h, m": function () {
            var date = new Date(2010, 4, 2, 12, 42);
            var fakeDate = this.clock.Date(2010, 4, 2, 12, 42);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing y, m, d, h, m, s": function () {
            var date = new Date(2010, 4, 2, 12, 42, 53);
            var fakeDate = new this.clock.Date(2010, 4, 2, 12, 42, 53);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with y, m, d, h, m, s": function () {
            var date = new Date(2010, 4, 2, 12, 42, 53);
            var fakeDate = this.clock.Date(2010, 4, 2, 12, 42, 53);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should create regular date when passing y, m, d, h, m, s, ms": function () {
            var date = new Date(2010, 4, 2, 12, 42, 53, 498);
            var fakeDate = new this.clock.Date(2010, 4, 2, 12, 42, 53, 498);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should return regular date when calling with y, m, d, h, m, s, ms": function () {
            var date = new Date(2010, 4, 2, 12, 42, 53, 498);
            var fakeDate = this.clock.Date(2010, 4, 2, 12, 42, 53, 498);

            assertEquals(date.getTime(), fakeDate.getTime());
        },

        "should mirror native Date.prototype": function () {
            assertSame(Date.prototype, this.clock.Date.prototype);
        },

        "should support now method if present": function () {
            assertSame(typeof Date.now, typeof this.clock.Date.now);
        },

        "now should return clock.now if native date supports it": function () {
            if (Date.now) {
                assertEquals(this.now, this.clock.Date.now());
            } else {
                jstestdriver.console.log("Environment does not support Date.now");
                assertUndefined(this.clock.Date.now);
            }
        },

        "should mirror parse method": function () {
            assertSame(Date.parse, this.clock.Date.parse);
        },

        "should mirror UTC method": function () {
            assertSame(Date.UTC, this.clock.Date.UTC);
        },

        "should mirror toUTCString method": function () {
            assertSame(Date.prototype.toUTCString, this.clock.Date.prototype.toUTCString);
        },

        "should mirror toSource if supported": function () {
            if (Date.toSource) {
                assertSame(Date.toSource(), this.clock.Date.toSource());
            } else {
                jstestdriver.console.log("Environment does not support Date.toSource");
                assertUndefined(this.clock.Date.toSource);
            }
        },

        "should mirror toString": function () {
            assertSame(Date.toString(), this.clock.Date.toString());
        }
    });

    testCase("SinonStubTimersTest", {
        setUp: function () {
            this.dateNow = global.Date.now;
        },

        tearDown: function () {
            if (this.clock) {
                this.clock.restore();
            }

            clearTimeout(this.timer);
            if (typeof this.dateNow == "undefined") {
                delete global.Date.now;
            } else {
                global.Date.now = this.dateNow;
            }
        },

        "should return clock object": function () {
            this.clock = sinon.useFakeTimers();

            assertObject(this.clock);
            assertFunction(this.clock.tick);
        },

        "should have clock property": function () {
            this.clock = sinon.useFakeTimers();

            assertSame(this.clock, setTimeout.clock);
            assertSame(this.clock, clearTimeout.clock);
            assertSame(this.clock, setInterval.clock);
            assertSame(this.clock, clearInterval.clock);
            assertSame(this.clock, Date.clock);
        },

        "should set initial timestamp": function () {
            this.clock = sinon.useFakeTimers(1400);

            assertEquals(1400, this.clock.now);
        },

        "should replace global setTimeout": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();

            setTimeout(stub, 1000);
            this.clock.tick(1000);

            assert(stub.called);
        },

        "global fake setTimeout should return id": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();

            var id = setTimeout(stub, 1000);

            assertNumber(id);
        },

        "should replace global clearTimeout": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();

            clearTimeout(setTimeout(stub, 1000));
            this.clock.tick(1000);

            assertFalse(stub.called);
        },

        "should restore global setTimeout": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();
            this.clock.restore();

            this.timer = setTimeout(stub, 1000);
            this.clock.tick(1000);

            assertFalse(stub.called);
            assertSame(sinon.timers.setTimeout, setTimeout);
        },

        "should restore global clearTimeout": function () {
            this.clock = sinon.useFakeTimers();
            sinon.stub.create();
            this.clock.restore();

            assertSame(sinon.timers.clearTimeout, clearTimeout);
        },

        "should replace global setInterval": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();

            setInterval(stub, 500);
            this.clock.tick(1000);

            assert(stub.calledTwice);
        },

        "should replace global clearInterval": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();

            clearInterval(setInterval(stub, 500));
            this.clock.tick(1000);

            assertFalse(stub.called);
        },

        "should restore global setInterval": function () {
            this.clock = sinon.useFakeTimers();
            var stub = sinon.stub.create();
            this.clock.restore();

            this.timer = setInterval(stub, 1000);
            this.clock.tick(1000);

            assertFalse(stub.called);
            assertSame(sinon.timers.setInterval, setInterval);
        },

        "should restore global clearInterval": function () {
            this.clock = sinon.useFakeTimers();
            sinon.stub.create();
            this.clock.restore();

            assertSame(sinon.timers.clearInterval, clearInterval);
        },

        "should fake Date constructor": function () {
            this.clock = sinon.useFakeTimers(0);
            var now = new Date();

            assertNotSame(sinon.timers.Date, Date);
            assertEquals(0, now.getTime());
        },

        "fake Date constructor should mirror Date's properties": function () {
            this.clock = sinon.useFakeTimers(0);

            assert(!!Date.parse);
            assert(!!Date.UTC);
        },

        "decide on Date.now support at call-time when supported": function () {
            global.Date.now = function () {};
            this.clock = sinon.useFakeTimers(0);

            assertEquals("function", typeof Date.now);
        },

        "decide on Date.now support at call-time when unsupported": function () {
            global.Date.now = null;
            this.clock = sinon.useFakeTimers(0);

            assertUndefined(Date.now);
        },

        "should restore Date constructor": function () {
            this.clock = sinon.useFakeTimers(0);
            this.clock.restore();

            assertSame(sinon.timers.Date, Date);
        },

        "should fake provided methods": function () {
            this.clock = sinon.useFakeTimers("setTimeout", "Date");

            assertNotSame(sinon.timers.setTimeout, setTimeout);
            assertNotSame(sinon.timers.Date, Date);
        },

        "should reset faked methods": function () {
            this.clock = sinon.useFakeTimers("setTimeout", "Date");
            this.clock.restore();

            assertSame(sinon.timers.setTimeout, setTimeout);
            assertSame(sinon.timers.Date, Date);
        },

        "should not fake methods not provided": function () {
            this.clock = sinon.useFakeTimers("setTimeout", "Date");

            assertSame(sinon.timers.clearTimeout, clearTimeout);
            assertSame(sinon.timers.setInterval, setInterval);
            assertSame(sinon.timers.clearInterval, clearInterval);
        },

        "should not be able to use date object for now": function () {
            assertException(function () {
                sinon.useFakeTimers(new Date(2011, 9, 1));
            });
        }
    });
}(typeof global != "undefined" ? global : this));
