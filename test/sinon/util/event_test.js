/*jslint onevar: false, eqeqeq: false, browser: true*/
/*globals window
          jstestdriver
          testCase
          sinon
          assert
          assertSame
          assertNotSame
          assertEquals
          assertTrue
          assertFalse
          assertNull
          assertNotNull
          assertException
          assertNoException
          assertUndefined
          assertObject
          assertFunction*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Christian Johansen
 */
"use strict";

testCase("EventTargetTest", {
    setUp: function () {
        this.target = sinon.extend({}, sinon.EventTarget);
    },

    "should notify event listener": function () {
        var listener = sinon.spy();
        this.target.addEventListener("dummy", listener);

        var event = new sinon.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listener.calledOnce);
        assert(listener.calledWith(event));
    },

    "should notify event listener with target as this": function () {
        var listener = sinon.spy();
        this.target.addEventListener("dummy", listener);

        var event = new sinon.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listener.calledOn(this.target));
    },

    "should notify all event listeners": function () {
        var listeners = [sinon.spy(), sinon.spy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("dummy", listeners[1]);

        var event = new sinon.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listeners[0].calledOnce);
        assert(listeners[0].calledOnce);
    },

    "should notify event listener of type listener": function () {
        var listener = { handleEvent: sinon.spy() };
        this.target.addEventListener("dummy", listener);

        this.target.dispatchEvent(new sinon.Event("dummy"));

        assert(listener.handleEvent.calledOnce);
    },

    "should not notify listeners of other events": function () {
        var listeners = [sinon.spy(), sinon.spy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("other", listeners[1]);

        this.target.dispatchEvent(new sinon.Event("dummy"));

        assertFalse(listeners[1].called);
    },

    "should not notify unregistered listeners": function () {
        var listener = sinon.spy();
        this.target.addEventListener("dummy", listener);
        this.target.removeEventListener("dummy", listener);

        this.target.dispatchEvent(new sinon.Event("dummy"));

        assertFalse(listener.called);
    },

    "should notify existing listeners after removing one": function () {
        var listeners = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("dummy", listeners[1]);
        this.target.addEventListener("dummy", listeners[2]);
        this.target.removeEventListener("dummy", listeners[1]);

        this.target.dispatchEvent(new sinon.Event("dummy"));

        assert(listeners[0].calledOnce);
        assert(listeners[2].calledOnce);
    },

    "should return false when event.preventDefault is not called": function () {
        this.target.addEventListener("dummy", sinon.spy());

        var event = new sinon.Event("dummy");
        var result = this.target.dispatchEvent(event);

        assertFalse(result);
    },

    "should return true when event.preventDefault is called": function () {
        this.target.addEventListener("dummy", function (e) {
            e.preventDefault();
        });

        var result = this.target.dispatchEvent(new sinon.Event("dummy"));

        assertTrue(result);
    }
});
