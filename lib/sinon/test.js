"use strict";
var sinonConfig = require("./config");
var createSandbox = require("./sandbox").create;

function test(callback) {
    var type = typeof callback;

    if (type !== "function") {
        throw new TypeError("sinon.test needs to wrap a test function, got " + type);
    }

    function sinonSandboxedTest() {
        // TODO: Fix this atrocity
        var config = sinonConfig.getConfig(sinonConfig.config); // Was: sinon.config
        config.injectInto = config.injectIntoThis && this || config.injectInto;
        var sandbox = createSandbox(config);
        var exception, result;
        var doneIsWrapped = false;
        var argumentsCopy = Array.prototype.slice.call(arguments);
        if (argumentsCopy.length > 0 && typeof argumentsCopy[arguments.length - 1] === "function") {
            var oldDone = argumentsCopy[arguments.length - 1];
            argumentsCopy[arguments.length - 1] = function done(result) {
                if (result) {
                    sandbox.restore();
                    throw exception;
                }
                sandbox.verifyAndRestore();
                oldDone(result);
            }
            doneIsWrapped = true;
        }

        var args = argumentsCopy.concat(sandbox.args);

        try {
            result = callback.apply(this, args);
        } catch (e) {
            exception = e;
        }

        if (!doneIsWrapped) {
            if (typeof exception !== "undefined") {
                sandbox.restore();
                throw exception;
            } else {
                sandbox.verifyAndRestore();
            }
        }

        return result;
    };

    if (callback.length) {
        return function sinonAsyncSandboxedTest(callback) {
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

module.exports = test;
