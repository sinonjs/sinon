"use strict";

var sort = require("@sinonjs/commons").prototypes.array.sort;

module.exports = function orderByFirstCall(spies) {
    return sort(spies, function (a, b) {
        // uuid, won't ever be equal
        var aCall = a.getCall(0);
        var bCall = b.getCall(0);
        var aId = aCall && aCall.callId || -1;
        var bId = bCall && bCall.callId || -1;

        return aId < bId ? -1 : 1;
    });
};
