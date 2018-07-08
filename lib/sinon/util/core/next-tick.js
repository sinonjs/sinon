"use strict";

var root = typeof window !== "undefined" ? window : global;

function nextTick(callback) {
    /* istanbul ignore next */
    setTimeout(callback, 0);
}

function getNextTick(process, setImmediate) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
        return process.nextTick;
    }

    if (typeof setImmediate === "function") {
        return setImmediate;
    }

    return nextTick;
}

module.exports = getNextTick(root.process, root.setImmediate);

// exposed for testing purposes
module.exports.getNextTick = getNextTick;
