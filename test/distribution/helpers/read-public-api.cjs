const sinon = require("sinon");

function describeFunction(fn) {
    return {
        type: typeof fn,
        length: fn.length,
        name: fn.name,
    };
}

module.exports = {
    topLevelKeys: Object.keys(sinon).sort(),
    functions: {
        createSandbox: describeFunction(sinon.createSandbox),
        spy: describeFunction(sinon.spy),
        stub: describeFunction(sinon.stub),
        fake: describeFunction(sinon.fake),
        restore: describeFunction(sinon.restore),
    },
    hasTimers: Object.prototype.hasOwnProperty.call(sinon, "timers"),
    hasPromise: Object.prototype.hasOwnProperty.call(sinon, "promise"),
    hasMatch: Object.prototype.hasOwnProperty.call(sinon, "match"),
};
