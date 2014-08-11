/**
 * Format functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2014 Christian Johansen
 */
"use strict";

function valueFormatter(value) {
    return String(value);
}

function getFormatioFormatter() {
    var formatter = formatio.configure({
            quoteStrings: false,
            limitChildrenCount: 250
        });

    function format() {
        return formatter.ascii.apply(formatter, arguments);
    };

    return format;
}

function getNodeFormatter(value) {
    function format(value) {
        return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
    };

    try {
        var util = require("util");
    } catch (e) {
        /* Node, but no util module - would be very old, but better safe than sorry */
    }

    return util ? format : valueFormatter;
}

var isNode = typeof module !== "undefined" && module.exports && typeof require == "function",
    formatter;

try {
    var formatio = require("formatio");
} catch (e) {}

if (formatio) {
    formatter = getFormatioFormatter()
} else if (isNode) {
    formatter = getNodeFormatter();
} else {
    formatter = valueFormatter;
}

module.exports = formatter;
