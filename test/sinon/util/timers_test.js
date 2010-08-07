/*jslint indent: 2, onevar: false, eqeqeq: false*/
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
 * Copyright (c) 2010 Christian Johansen
 */
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
      this.clock = sinon.clock.create();
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
      var stubs = [sinon.stub.create().throws(), sinon.stub.create()];
      this.clock.setTimeout(stubs[0], 100);
      this.clock.setTimeout(stubs[1], 120);
      this.clock.tick(120);

      assert(stubs[0].called);
      assert(stubs[1].called);
    },

    "should call function with global object as this": function () {
      var stub = sinon.stub.create().throws();
      this.clock.setTimeout(stub, 100);
      this.clock.tick(100);

      assert(stub.calledOn(global));
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
      global.Date = function () {};
      var date = new this.clock.Date();

      assert(this.Date.prototype.isPrototypeOf(date));
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
        jstestdriver.console.log("Browser does not support Date.now");
        assertUndefined(this.clock.Date.now);
      }
    },

    "should mirror parse method": function () {
      assertSame(Date.parse, this.clock.Date.parse);
    },

    "should mirror UTC method": function () {
      assertSame(Date.UTC, this.clock.Date.UTC);
    },

    "should mirror toSource if supported": function () {
      if (Date.toSource) {
        assertSame(Date.toSource(), this.clock.Date.toSource());
      } else {
        jstestdriver.console.log("Browser does not support Date.toSource");
        assertUndefined(this.clock.Date.toSource);
      }
    },

    "should mirror toString": function () {
      assertSame(Date.toString(), this.clock.Date.toString());
    }
  });

  var globalDate = Date;

  testCase("SinonStubTimersTest", {
    tearDown: function () {
      this.clock.restore();
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

      setTimeout(stub, 1000);
      this.clock.tick(1000);

      assertFalse(stub.called);
      assertSame(sinon.timers.setTimeout, setTimeout);
    },

    "should restore global clearTimeout": function () {
      this.clock = sinon.useFakeTimers();
      var stub = sinon.stub.create();
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

      setInterval(stub, 1000);
      this.clock.tick(1000);

      assertFalse(stub.called);
      assertSame(sinon.timers.setInterval, setInterval);
    },

    "should restore global clearInterval": function () {
      this.clock = sinon.useFakeTimers();
      var stub = sinon.stub.create();
      this.clock.restore();

      assertSame(sinon.timers.clearInterval, clearInterval);
    },

    "should fake Date constructor": function () {
      this.clock = sinon.useFakeTimers(0, "Date");
      var now = new Date();

      assertNotSame(sinon.timers.Date, Date);
      assertEquals(0, now.getTime());
    },

    "should restore Date constructor": function () {
      this.clock = sinon.useFakeTimers(0, "Date");
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
    }
  });
}(this));
