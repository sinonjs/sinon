"use strict";
// cache a reference to setTimeout, so that our reference won't be stubbed out
// when using fake timers and errors will still get logged
// https://github.com/cjohansen/Sinon.JS/issues/381
var realSetTimeout = setTimeout;

function log() {}

function logError(label, err) {
    var msg = label + " threw exception: ";

    log(msg + "[" + err.name + "] " + err.message);

    if (err.stack) {
        log(err.stack);
    }

    logError.setTimeout(function () {
        err.message = msg + err.message;
        throw err;
    }, 0);
}

// wrap realSetTimeout with something we can stub in tests
logError.setTimeout = function (func, timeout) {
    realSetTimeout(func, timeout);
};

exports.log = log;
exports.logError = logError;
