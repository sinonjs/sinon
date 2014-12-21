(function(global){
    "use strict";

    /**
     * Helps IE run the fake XDomainRequest. By defining global functions, IE allows
     * them to be overwritten at a later point. If these are not defined like
     * this, overwriting them will result in anything from an exception to browser
     * crash.
     *
     * If you don't require fake XDR to work in IE, don't include this file.
     */
    global.XDomainRequest = global.XDomainRequest;

})(typeof window != "undefined" ? window : (typeof self != "undefined") ? self : global);
