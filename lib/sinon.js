"use strict";

const behavior = require("./sinon/behavior");
const createSandbox = require("./sinon/create-sandbox");
const extend = require("./sinon/util/core/extend");
const fakeTimers = require("./sinon/util/fake-timers");
const nise = require("nise");
const Sandbox = require("./sinon/sandbox");
const stub = require("./sinon/stub");
const promise = require("./sinon/promise");

const apiMethods = {
    createSandbox: createSandbox,
    assert: require("./sinon/assert"),
    match: require("@sinonjs/samsam").createMatcher,
    restoreObject: require("./sinon/restore-object"),

    expectation: require("./sinon/mock-expectation"),
    defaultConfig: require("./sinon/util/core/default-config"),

    // fake timers
    timers: fakeTimers.timers,

    // fake XHR
    xhr: nise.fakeXhr.xhr,
    FakeXMLHttpRequest: nise.fakeXhr.FakeXMLHttpRequest,

    // fake server
    fakeServer: nise.fakeServer,
    fakeServerWithClock: nise.fakeServerWithClock,
    createFakeServer: nise.fakeServer.create.bind(nise.fakeServer),
    createFakeServerWithClock: nise.fakeServerWithClock.create.bind(
        nise.fakeServerWithClock
    ),

    addBehavior: function (name, fn) {
        behavior.addBehavior(stub, name, fn);
    },

    // fake promise
    promise: promise,
};

const sandbox = new Sandbox();

const api = extend(sandbox, apiMethods);

module.exports = api;
