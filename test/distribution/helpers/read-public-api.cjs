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
        "[Symbol.dispose]": describeFunction(sinon[Symbol.dispose]),
    },
    hasTimers: Object.hasOwn(sinon, "timers"),
    hasPromise: Object.hasOwn(sinon, "promise"),
    hasMatch: Object.hasOwn(sinon, "match"),
};
