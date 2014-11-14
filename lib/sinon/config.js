"use strict";
var hasOwn = Object.prototype.hasOwnProperty;

exports.defaultConfig = {
    injectIntoThis: true,
    injectInto: null,
    properties: ["spy", "stub", "mock", "clock", "server", "requests"],
    useFakeTimers: true,
    useFakeServer: true
};

exports.getConfig = function (custom) {
    var config = {};
    custom = custom || {};
    var defaults = exports.defaultConfig;

    for (var prop in defaults) {
        if (hasOwn.call(defaults, prop)) {
            config[prop] = hasOwn.call(custom, prop) ? custom[prop] : defaults[prop];
        }
    }

    return config;
};
