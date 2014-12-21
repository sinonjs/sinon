(function(global){
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
    global.setTimeout = global.setTimeout;
    global.clearTimeout = global.clearTimeout;
    global.setImmediate = global.setImmediate;
    global.clearImmediate = global.clearImmediate;
    global.setInterval = global.setInterval;
    global.clearInterval = global.clearInterval;
    global.Date = global.Date;

})(typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global);
