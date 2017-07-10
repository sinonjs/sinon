"use strict";

var match = require("./sinon/match");
var deepEqual = require("./sinon/util/core/deep-equal");
var deprecated = require("./sinon/util/core/deprecated");

function exposeCoreUtils(target, utils) {
    var keys = Object.keys(utils);

    keys.forEach(function (key) {
        var value = utils[key];

        // allow deepEqual to check equality of matchers through dependency injection. Otherwise we get a circular
        // dependency
        if (key === "deepEqual") {
            value = deepEqual.use(match);
        }
        if (typeof value === "function") {
            value = deprecated.wrap(value, deprecated.defaultMsg(key));
        }
        target[key] = value;
    });
}

// Expose internal utilities on `sinon` global for backwards compatibility.
exposeCoreUtils(exports, require("./sinon/util/core/index"));

exports.assert = require("./sinon/assert");
exports.collection = require("./sinon/collection");
exports.match = match;
exports.spy = require("./sinon/spy");
exports.spyCall = require("./sinon/call");
exports.stub = require("./sinon/stub");
exports.mock = require("./sinon/mock");
exports.sandbox = require("./sinon/sandbox");
exports.expectation = require("./sinon/mock-expectation");
exports.createStubInstance = require("./sinon/stub").createStubInstance;

var fakeTimers = require("./sinon/util/fake_timers");
exports.useFakeTimers = fakeTimers.useFakeTimers;
exports.clock = fakeTimers.clock;
exports.timers = fakeTimers.timers;

var nise = require("nise");
exports.xhr = nise.fakeXhr.xhr;
exports.FakeXMLHttpRequest = nise.fakeXhr.FakeXMLHttpRequest;
exports.useFakeXMLHttpRequest = nise.fakeXhr.useFakeXMLHttpRequest;

exports.fakeServer = nise.fakeServer;
exports.fakeServerWithClock = nise.fakeServerWithClock;

var behavior = require("./sinon/behavior");

exports.addBehavior = function (name, fn) {
    behavior.addBehavior(exports.stub, name, fn);
};
