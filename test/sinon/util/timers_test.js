/*jslint indent: 2, onevar: false*/
/*globals TestCase
          sinon
          assert
          assertFalse
          assertNumber
          assertException
          assertFunction*/
(function (global) {
  var clock = sinon.clock;

  testCase("SetTimeOutTest", {
    tearDown: function () {
      sinon.clock.reset();
    },

    "should be function": function () {
      assertFunction(clock.setTimeout);
    },

    "should throw if no arguments": function () {
      assertException(function () {
        clock.setTimeout();
      });
    },

    "should return numeric id": function () {
      var result = clock.setTimeout("");

      assertNumber(result);
    },

    "should return unique id": function () {
      var id1 = clock.setTimeout("");
      var id2 = clock.setTimeout("");

      assertNotEquals(id1, id2);
    }
  });

  testCase("ClockTickTest", {
    tearDown: function () {
      sinon.clock.reset();
    },

    "should trigger immediately without specified delay": function () {
      var stub = sinon.stub.create();
      clock.setTimeout(stub);
      clock.tick(0);

      assert(stub.called);
    },

    "should not trigger without sufficient delay": function () {
      var stub = sinon.stub.create();
      clock.setTimeout(stub, 100);
      clock.tick(10);

      assertFalse(stub.called);
    },

    "should trigger after sufficient delay": function () {
      var stub = sinon.stub.create();
      clock.setTimeout(stub, 100);
      clock.tick(100);

      assert(stub.called);
    },

    "should wait after setTimeout was called": function () {
      clock.tick(100);
      var stub = sinon.stub.create();
      clock.setTimeout(stub, 150);
      clock.tick(50);

      assertFalse(stub.called);
      clock.tick(100);
      assert(stub.called);
    },

    "mini integration test": function () {
      var stubs = [sinon.stub.create(), sinon.stub.create(), sinon.stub.create()];
      clock.setTimeout(stubs[0], 100);
      clock.setTimeout(stubs[1], 120);
      clock.tick(10);
      clock.tick(89);
      assertFalse(stubs[0].called);
      assertFalse(stubs[1].called);
      clock.setTimeout(stubs[2], 20);
      clock.tick(1);
      assert(stubs[0].called);
      assertFalse(stubs[1].called);
      assertFalse(stubs[2].called);
      clock.tick(19);
      assertFalse(stubs[1].called);
      assert(stubs[2].called);
      clock.tick(1);
      assert(stubs[1].called);
    },

    "should trigger even when some throw": function () {
      var stubs = [sinon.stub.create().throws(), sinon.stub.create()];
      clock.setTimeout(stubs[0], 100);
      clock.setTimeout(stubs[1], 120);
      clock.tick(120);

      assert(stubs[0].called);
      assert(stubs[1].called);
    },

    "should call function with global object as this": function () {
      var stub = sinon.stub.create().throws();
      clock.setTimeout(stub, 100);
      clock.tick(100);

      assert(stub.calledOn(global));
    }
  });

  testCase("ClockClearTimeoutTest", {
    tearDown: function () {
      sinon.clock.reset();
    },

    "should remove timeout": function () {
      var stub = sinon.stub.create();
      var id = clock.setTimeout(stub, 50);
      clock.clearTimeout(id);
      clock.tick(50);

      assertFalse(stub.called);
    }
  });

  testCase("ClockResetTest", {
    "should empty timeouts queue": function () {
      var stub = sinon.stub.create();
      clock.setTimeout(stub);
      clock.reset();
      clock.tick(0);

      assertFalse(stub.called);
    }
  });

  testCase("SetIntervalTest", {
    tearDown: function () {
      sinon.clock.reset();
    },

    "should be function": function () {
      assertFunction(clock.setInterval);
    },

    "should throw if no arguments": function () {
      assertException(function () {
        clock.setInterval();
      });
    },

    "should return numeric id": function () {
      var result = clock.setInterval("");

      assertNumber(result);
    },

    "should return unique id": function () {
      var id1 = clock.setInterval("");
      var id2 = clock.setInterval("");

      assertNotEquals(id1, id2);
    },

    "should schedule recurring timeout": function () {
      var stub = sinon.stub.create();
      clock.setInterval(stub, 10);
      clock.tick(99);

      assertEquals(9, stub.callCount);
    },

    "should not schedule recurring timeout when cleared": function () {
      var id;
      var stub = sinon.spy.create(function () {
        if (stub.callCount == 3) {
          clock.clearInterval(id);
        }
      });

      id = clock.setInterval(stub, 10);
      clock.tick(100);

      assertEquals(3, stub.callCount);
    }
  });
}(this));
