/**
 * Logs errors
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

var sinon = require("./util/core");

// cache a reference to setTimeout, so that our reference won't be stubbed out
// when using fake timers and errors will still get logged
// https://github.com/cjohansen/Sinon.JS/issues/381
var realSetTimeout = setTimeout;

function logError(label, err) {
    var msg = label + " threw exception: ";

    function throwLoggedError() {
        err.message = msg + err.message;
        throw err;
    }

    sinon.log(msg + "[" + err.name + "] " + err.message);

    if (err.stack) {
        sinon.log(err.stack);
    }

    if (logError.useImmediateExceptions) {
        throwLoggedError();
    } else {
        logError.setTimeout(throwLoggedError, 0);
    }
}

// When set to true, any errors logged will be thrown immediately;
// If set to false, the errors will be thrown in separate execution frame.
logError.useImmediateExceptions = true;

// wrap realSetTimeout with something we can stub in tests
logError.setTimeout = function (func, timeout) {
    realSetTimeout(func, timeout);
};

module.exports = logError;
