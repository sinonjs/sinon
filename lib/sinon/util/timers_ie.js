(function(sinon, global){
    "use strict";

    /**
     * Helps IE run the fake timers. By defining global functions, IE allows
     * them to be overwritten at a later point. If these are not defined like
     * this, overwriting them will result in anything from an exception to browser
     * crash.
     *
     * If you don't require fake timers to work in IE, don't include this file.
     *
     * @author Christian Johansen (christian@cjohansen.no)
     * @license BSD
     *
     * Copyright (c) 2010-2013 Christian Johansen
     */
    global.setTimeout = function setTimeout() {}
    global.clearTimeout = function clearTimeout() {}
    global.setImmediate = function setImmediate() {}
    global.clearImmediate = function clearImmediate() {}
    global.setInterval = function setInterval() {}
    global.clearInterval = function clearInterval() {}
    global.Date = function Date() {}

    // Reassign the original functions. Now their writable attribute
    // should be true. Hackish, I know, but it works.
    global.setTimeout = sinon.timers.setTimeout;
    global.clearTimeout = sinon.timers.clearTimeout;
    global.setImmediate = sinon.timers.setImmediate;
    global.clearImmediate = sinon.timers.clearImmediate;
    global.setInterval = sinon.timers.setInterval;
    global.clearInterval = sinon.timers.clearInterval;
    global.Date = sinon.timers.Date;

}}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global));
