"use strict";
var lolex = require("lolex");

module.exports = function () {
    var now, methods = Array.prototype.slice.call(arguments);

    if (typeof methods[0] === "string") {
        now = 0;
    } else {
        now = methods.shift();
    }

    var clock = lolex.install(now || 0, methods);
    clock.restore = clock.uninstall;
    return clock;
};
