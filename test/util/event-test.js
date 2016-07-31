"use strict";

var referee = require("referee");
var assert = referee.assert;

var sinonEvent = require("../../lib/sinon/util/event");
var sinonExtend = require("../../lib/sinon/extend");
var sinonSpy = require("../../lib/sinon/spy");

describe("sinon.EventTarget", function () {
    beforeEach(function () {
        this.target = sinonExtend({}, sinonEvent.EventTarget);
    });

    it("notifies event listener", function () {
        var listener = sinonSpy();
        this.target.addEventListener("dummy", listener);

        var event = new sinonEvent.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listener.calledOnce);
        assert(listener.calledWith(event));
    });

    it("notifies event listener with target as this", function () {
        var listener = sinonSpy();
        this.target.addEventListener("dummy", listener);

        var event = new sinonEvent.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listener.calledOn(this.target));
    });

    it("notifies all event listeners", function () {
        var listeners = [sinonSpy(), sinonSpy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("dummy", listeners[1]);

        var event = new sinonEvent.Event("dummy");
        this.target.dispatchEvent(event);

        assert(listeners[0].calledOnce);
        assert(listeners[0].calledOnce);
    });

    it("notifies event listener of type listener", function () {
        var listener = { handleEvent: sinonSpy() };
        this.target.addEventListener("dummy", listener);

        this.target.dispatchEvent(new sinonEvent.Event("dummy"));

        assert(listener.handleEvent.calledOnce);
    });

    it("does not notify listeners of other events", function () {
        var listeners = [sinonSpy(), sinonSpy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("other", listeners[1]);

        this.target.dispatchEvent(new sinonEvent.Event("dummy"));

        assert.isFalse(listeners[1].called);
    });

    it("does not notify unregistered listeners", function () {
        var listener = sinonSpy();
        this.target.addEventListener("dummy", listener);
        this.target.removeEventListener("dummy", listener);

        this.target.dispatchEvent(new sinonEvent.Event("dummy"));

        assert.isFalse(listener.called);
    });

    it("notifies existing listeners after removing one", function () {
        var listeners = [sinonSpy(), sinonSpy(), sinonSpy()];
        this.target.addEventListener("dummy", listeners[0]);
        this.target.addEventListener("dummy", listeners[1]);
        this.target.addEventListener("dummy", listeners[2]);
        this.target.removeEventListener("dummy", listeners[1]);

        this.target.dispatchEvent(new sinonEvent.Event("dummy"));

        assert(listeners[0].calledOnce);
        assert(listeners[2].calledOnce);
    });

    it("returns false when event.preventDefault is not called", function () {
        this.target.addEventListener("dummy", sinonSpy());

        var event = new sinonEvent.Event("dummy");
        var result = this.target.dispatchEvent(event);

        assert.isFalse(result);
    });

    it("returns true when event.preventDefault is called", function () {
        this.target.addEventListener("dummy", function (e) {
            e.preventDefault();
        });

        var result = this.target.dispatchEvent(new sinonEvent.Event("dummy"));

        assert.isTrue(result);
    });

    it("notifies ProgressEvent listener with progress data ", function () {
        var listener = sinonSpy();
        this.target.addEventListener("dummyProgress", listener);

        var progressEvent = new sinonEvent.ProgressEvent("dummyProgress", {loaded: 50, total: 120});
        this.target.dispatchEvent(progressEvent);

        assert.isTrue(progressEvent.lengthComputable);
        assert(listener.calledOnce);
        assert(listener.calledWith(progressEvent));
    });

    it("notifies CustomEvent listener with custom data", function () {
        var listener = sinonSpy();
        this.target.addEventListener("dummyCustom", listener);

        var customEvent = new sinonEvent.CustomEvent("dummyCustom", {detail: "hola"});
        this.target.dispatchEvent(customEvent);

        assert(listener.calledOnce);
        assert(listener.calledWith(customEvent));
    });
});
