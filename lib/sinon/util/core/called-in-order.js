"use strict";

var every = Array.prototype.every;

module.exports = function calledInOrder(spies) {
    var callMap = {};
    // eslint-disable-next-line no-underscore-dangle
    var _spies = arguments.length > 1 ? arguments : spies;

    function hasCallsLeft(spy) {
        if (callMap[spy.id] === undefined) {
            callMap[spy.id] = 0;
        }

        return callMap[spy.id] < spy.callCount;
    }

    return every.call(_spies, function checkAdjacentCalls(spy, i) {
        var calledBeforeNext = true;

        if (i !== _spies.length - 1) {
            calledBeforeNext = spy.calledBefore(_spies[i + 1]);
        }

        if (hasCallsLeft(spy) && calledBeforeNext) {
            callMap[spy.id] += 1;
            return true;
        }

        return false;
    });
};
