"use strict";

var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
var hasSetImmediate = typeof setImmediate === "function";

function nextTick(callback) {
    setTimeout(callback, 0);
}

if (hasNextTick) {
    module.exports = process.nextTick;
}

if (!hasNextTick && hasSetImmediate) {
    module.exports = setImmediate;
}

if (!hasNextTick && !hasSetImmediate) {
    module.exports = nextTick;
}
