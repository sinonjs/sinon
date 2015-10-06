"use strict";

var sinon = require("./util/core");

function timesInWords(count) {
    switch (count) {
        case 1:
            return "once";
        case 2:
            return "twice";
        case 3:
            return "thrice";
        default:
            return (count || 0) + " times";
    }
}

sinon.timesInWords = timesInWords;
