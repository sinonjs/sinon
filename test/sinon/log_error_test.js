/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

if (typeof require === "function" && typeof module === "object") {
    var buster = require("../runner");
    var sinon = require("../../lib/sinon");
}

buster.testCase("sinon.log", {
    "is a function": function () {
        assert.isFunction(sinon.log);
    }
});

buster.testCase("sinon.logError", {
    setUp: function () {
        this.sandbox = sinon.sandbox.create();
    },

    tearDown: function () {
        this.sandbox.restore();
    },

    "is a function": function () {
        assert.isFunction(sinon.logError);
    },

    "calls sinon.log with a String": function () {
        var clock = this.sandbox.useFakeTimers(),
            spy = this.sandbox.spy(sinon, "log"),
            name = "Quisque consequat, elit id suscipit.",
            message = "Pellentesque gravida orci in tellus tristique, ac commodo nibh congue.",
            error = new Error();

        error.name = name;
        error.message = message;

        assert.exception(function () {
            sinon.logError("a label", error);
            clock.tick(1);

            assert(spy.called);
            assert(spy.calledWithMatch(name));
            assert(spy.calledWithMatch(message));
        });
    },

    "calls sinon.log with a stack": function () {
        var clock = this.sandbox.useFakeTimers(),
            spy = this.sandbox.spy(sinon, "log"),
            stack = "Integer rutrum dictum elit, posuere accumsan nisi pretium vel. Phasellus adipiscing.",
            error = new Error();

        error.stack = stack;

        assert.exception(function () {
            sinon.logError("another label", error);
            clock.tick(1);

            assert(spy.called);
            assert(spy.calledWithMatch(stack));
        });
    },

    "should throw error asynchronously": function () {
        var clock = this.sandbox.useFakeTimers();

        assert.exception(function () {
            var error = new Error();

            sinon.logError("some label", error);
            clock.tick(1);
        });
    }
});
