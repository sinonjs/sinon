"use strict";

const behavior = require("./sinon/behavior");
const createSandbox = require("./sinon/create-sandbox");
const extend = require("./sinon/util/core/extend");
const fakeTimers = require("./sinon/util/fake-timers");
const nise = require("nise");
const Sandbox = require("./sinon/sandbox");
const stub = require("./sinon/stub");
const promise = require("./sinon/promise");

/**
 * @param {object} opts injection point to override the default XHR lib in testing
 * @param {object} opts.sinonXhrLib
 * @returns {object} a configured sandbox
 */
function createApi({ sinonXhrLib }) {
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
        xhr: sinonXhrLib.fakeXhr.xhr,
        FakeXMLHttpRequest: sinonXhrLib.fakeXhr.FakeXMLHttpRequest,

        // fake server
        fakeServer: sinonXhrLib.fakeServer,
        fakeServerWithClock: sinonXhrLib.fakeServerWithClock,
        createFakeServer: sinonXhrLib.fakeServer.create.bind(
            sinonXhrLib.fakeServer,
        ),
        createFakeServerWithClock: sinonXhrLib.fakeServerWithClock.create.bind(
            sinonXhrLib.fakeServerWithClock,
        ),

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        // fake promise
        promise: promise,
    };

    const sandbox = new Sandbox();
    return extend(sandbox, apiMethods);
}

const api = createApi({ sinonXhrLib: nise });

module.exports = api;

// solely exposed for easier testing
module.exports.createApi = createApi;
