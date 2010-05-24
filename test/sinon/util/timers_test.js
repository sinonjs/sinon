/*jslint indent: 2, onevar: false, eqeqeq: false*/
/*globals testCase
          sinon
          called
          assert
          assertFalse
          assertEquals
          assertNotEquals
          assertNumber
          assertException
          assertFunction*/
(function (global) {
  testCase("SetTimeOutTest", {
    setUp: function () {
      this.clock = sinon.clock.create();
    },

    tearDown: function () {
      delete global.called;
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
      global.called = false;

      this.clock.setTimeout("called = true", 10);
      this.clock.tick(10);

      assert(called);
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
}(this));
