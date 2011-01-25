/*jslint onevar: false, browser: false, regexp: false, browser: true*/
/*globals testCase
          sinon
          assert
          assertSame
          assertNotSame
          assertEquals
          assertTrue
          assertFalse
          assertNull
          assertException
          assertNoException
          assertUndefined
          assertObject
          assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

testCase("ServerWithClockTest", {
    setUp: function () {
        this.server = sinon.fakeServerWithClock.create();
    },

    tearDown: function () {
        this.server.restore();

        if (this.clock) {
            this.clock.restore();
        }
    },

    "should call 'super' when adding requests": sinon.test(function () {
        var addRequest = this.stub(sinon.fakeServer, "addRequest");
        var xhr = {};
        this.server.addRequest(xhr);

        assert(addRequest.calledWith(xhr));
        assert(addRequest.calledOn(this.server));
    }),

    "should set reference to clock when adding async request": function () {
        this.server.addRequest({ async: true });

        assertObject(this.server.clock);
        assertFunction(this.server.clock.tick);
    },

    "should set longest timeout from setTimeout": function () {
        this.server.addRequest({ async: true });

        setTimeout(function () {}, 12);
        setTimeout(function () {}, 29);
        setInterval(function () {}, 12);
        setTimeout(function () {}, 27);

        assertEquals(29, this.server.longestTimeout);
    },

    "should set longest timeout from setInterval": function () {
        this.server.addRequest({ async: true });

        setTimeout(function () {}, 12);
        setTimeout(function () {}, 29);
        setInterval(function () {}, 132);
        setTimeout(function () {}, 27);

        assertEquals(132, this.server.longestTimeout);
    },

    "should reset clock": function () {
        this.server.addRequest({ async: true });

        this.server.respond("");

        assertSame(sinon.timers.setTimeout, setTimeout);
    },

    "should not reset clock second time": function () {
        this.server.addRequest({ async: true });
        this.server.respond("");
        this.clock = sinon.useFakeTimers();
        this.server.addRequest({ async: true });
        this.server.respond("");

        assertNotSame(sinon.timers.setTimeout, setTimeout);
    }
});

testCase("ServerWithClockExistingClockTest", {
    setUp: function () {
        this.clock = sinon.useFakeTimers();
        this.server = sinon.fakeServerWithClock.create();
    },

    tearDown: function () {
        this.clock.restore();
        this.server.restore();
    },

    "should use existing clock": function () {
        this.server.addRequest({ async: true });

        assertSame(this.clock, this.server.clock);
    },

    "should record longest timeout using setTimeout and existing clock": function () {
        this.server.addRequest({ async: true });

        setInterval(function () {}, 42);
        setTimeout(function () {}, 23);
        setTimeout(function () {}, 53);
        setInterval(function () {}, 12);

        assertSame(53, this.server.longestTimeout);
    },

    "should record longest timeout using setInterval and existing clock": function () {
        this.server.addRequest({ async: true });

        setInterval(function () {}, 92);
        setTimeout(function () {}, 73);
        setTimeout(function () {}, 53);
        setInterval(function () {}, 12);

        assertSame(92, this.server.longestTimeout);
    },

    "should not reset clock": function () {
        this.server.respond("");

        assertSame(this.clock, setTimeout.clock);
    }
});

testCase("ServerWithClockRespondTest", {
    setUp: function () {
        this.server = sinon.fakeServerWithClock.create();
        this.server.addRequest({ async: true });
    },

    tearDown: function () {
        this.server.restore();
    },

    "should tick the clock to fire the longest timeout": function () {
        this.server.longestTimeout = 96;

        this.server.respond();

        assertEquals(96, this.server.clock.now);
    },

    "should tick the clock to fire the longest timeout when multiple responds": function () {
        setInterval(function () {}, 13);
        this.server.respond();
        var xhr = new sinon.FakeXMLHttpRequest();
        setInterval(function () {}, 17);
        this.server.respond();

        assertEquals(17, this.server.clock.now);
    },

    "should reset longest timeout": function () {
        this.server.longestTimeout = 96;

        this.server.respond();

        assertEquals(0, this.server.longestTimeout);
    },

    "should call original respond": sinon.test(function () {
        var obj = {};
        var respond = this.stub(sinon.fakeServer, "respond").returns(obj);

        var result = this.server.respond("GET", "/", "");

        assertEquals(obj, result);
        assert(respond.calledWith("GET", "/", ""));
        assert(respond.calledOn(this.server));
    })
});

testCase("ServerJQueryCompatMode", {
    setUp: function () {
        this.server = sinon.fakeServerWithClock.create();

        this.request = new sinon.FakeXMLHttpRequest();
        this.request.open("get", "/", true);
        this.request.send();
        sinon.spy(this.request, "respond");
    },

    tearDown: function () {
        this.server.restore();
    },

    "should handle clock automatically": function () {
        this.server.respondWith("OK");
        var spy = sinon.spy();

        setTimeout(spy, 13);
        this.server.respond();
        this.server.restore();

        assert(spy.called);
        assertSame(sinon.timers.setTimeout, setTimeout);
    },

    "should finish xhr from setInterval like jQuery 1.3.x does": function () {
        this.server.respondWith("Hello World");
        var xhr = new sinon.FakeXMLHttpRequest();
        xhr.open("GET", "/");
        xhr.send();

        var spy = sinon.spy();

        setInterval(function () {
            spy(xhr.responseText, xhr.statusText, xhr);
        }, 13);

        this.server.respond();

        assertEquals("Hello World", spy.args[0][0]);
        assertEquals("OK", spy.args[0][1]);
        assertEquals(200, spy.args[0][2].status);
    }
});
