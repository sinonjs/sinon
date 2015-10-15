/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

module.exports = function typeOf(value) {
    if (value === null) {
        return "null";
    } else if (value === undefined) {
        return "undefined";
    }
    var string = Object.prototype.toString.call(value);
    return string.substring(8, string.length - 1).toLowerCase();
};
