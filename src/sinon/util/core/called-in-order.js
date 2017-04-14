"use strict";

module.exports = function calledInOrder(spies) {
    if (arguments.length > 1) {
        spies = arguments;
    }

    for (var i = 1, l = spies.length; i < l; i++) {
        if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
            return false;
        }
    }

    return true;
};
