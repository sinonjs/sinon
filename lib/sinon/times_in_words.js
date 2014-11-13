"use strict";
module.exports = function timesInWords(count) {
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
};
