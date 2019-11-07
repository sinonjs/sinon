"use strict";

var extend = require("./core/extend");
var llx = require("lolex");

function createClock(config) {
    var clock = llx.install(config);
    clock.restore = clock.uninstall;
    return clock;
}

function addIfDefined(obj, globalPropName) {
    var globalProp = global[globalPropName];
    if (typeof globalProp !== "undefined") {
        obj[globalPropName] = globalProp;
    }
}

/**
 * @param {number|Date|Object} dateOrConfig The lolex config or a unix epoch value to install with (default 0)
 * @returns {Object} Returns a lolex clock instance
 */
exports.useFakeTimers = function(dateOrConfig) {
    var hasArguments = typeof dateOrConfig !== "undefined";
    var argumentIsDateLike =
        (typeof dateOrConfig === "number" || dateOrConfig instanceof Date) && arguments.length === 1;
    var argumentIsObject = dateOrConfig !== null && typeof dateOrConfig === "object" && arguments.length === 1;

    if (!hasArguments) {
        return createClock({
            now: 0
        });
    }

    if (argumentIsDateLike) {
        return createClock({
            now: dateOrConfig
        });
    }

    if (argumentIsObject) {
        var config = extend.nonEnum({}, dateOrConfig);
        if (typeof config.target === "undefined") {
            config.target = config.global;
        }
        delete config.global;
        return createClock(config);
    }

    throw new TypeError(
        "useFakeTimers expected a config object similar to lolex.install(). See https://github.com/sinonjs/lolex#var-clock--lolexinstallconfig"
    );
};

exports.clock = {
    create: function(now) {
        return llx.createClock(now);
    }
};

var timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};
addIfDefined(timers, "setImmediate");
addIfDefined(timers, "clearImmediate");

exports.timers = timers;
