"use strict";

var extend = require("./core/extend");
var llx = require("lolex");

function createClock(config) {
    var clock = llx.install(config);
    clock.restore = clock.uninstall;
    return clock;
}

/**
 * @param {number|Date|Object} args The unix epoch value to install with (default 0)
 * @returns {Object} Returns a lolex clock instance
 */
exports.useFakeTimers = function(args) {
    var hasArguments = typeof args !== "undefined";
    var argumentIsDateLike = (typeof args === "number" || args instanceof Date) && arguments.length === 1;
    var argumentIsObject = args !== null && typeof args === "object" && arguments.length === 1;

    if (!hasArguments) {
        return createClock({
            now: 0
        });
    }

    if (argumentIsDateLike) {
        return createClock({
            now: args
        });
    }

    if (argumentIsObject) {
        return createClock(extend({}, args));
    }

    throw new TypeError("useFakeTimers expected epoch or config object. See https://github.com/sinonjs/sinon");
};

exports.clock = {
    create: function(now) {
        return llx.createClock(now);
    }
};

exports.timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setImmediate: typeof setImmediate !== "undefined" ? setImmediate : undefined,
    clearImmediate: typeof clearImmediate !== "undefined" ? clearImmediate : undefined,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};
