"use strict";

var canColor = typeof process !== "undefined";

function colorize(str, color) {
    if (!canColor) {
        return str;
    }

    return "\x1b[" + color + "m" + str + "\x1b[0m";
}

exports.red = function (str) {
    return colorize(str, 31);
};

exports.green = function (str) {
    return colorize(str, 32);
};
