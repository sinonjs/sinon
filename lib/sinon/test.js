/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

require("./sandbox");
var sinon = require("./util/core");

var slice = Array.prototype.slice;

function test(callback) {
    var type = typeof callback;

    if (type !== "function") {
        throw new TypeError("sinon.test needs to wrap a test function, got " + type);
    }

    function sinonSandboxedTest() {
        var config = sinon.getConfig(sinon.config);
        config.injectInto = config.injectIntoThis && this || config.injectInto;
        var sandbox = sinon.sandbox.create(config);
        var args = slice.call(arguments);
        var oldDone = args.length && args[args.length - 1];
        var exception, result;

        if (typeof oldDone === "function") {
            args[args.length - 1] = function sinonDone(res) {
                if (res) {
                    sandbox.restore();
                } else {
                    sandbox.verifyAndRestore();
                }
                oldDone(res);
            };
        }

        try {
            result = callback.apply(this, args.concat(sandbox.args));
        } catch (e) {
            exception = e;
        }

        if (typeof oldDone !== "function") {
            if (typeof exception !== "undefined") {
                sandbox.restore();
                throw exception;
            } else {
                sandbox.verifyAndRestore();
            }
        }

        return result;
    }

    if (callback.length) {
        return function sinonAsyncSandboxedTest(done) { // eslint-disable-line no-unused-vars
            return sinonSandboxedTest.apply(this, arguments);
        };
    }

    return sinonSandboxedTest;
}

test.config = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
};

sinon.test = test;
