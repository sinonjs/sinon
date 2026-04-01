'use strict';

var behavior = require('./sinon/behavior.js');
var createSandbox = require('./sinon/create-sandbox.js');
var extend = require('./sinon/util/core/extend.js');
var fakeTimers = require('./sinon/util/fake-timers.js');
var sandbox = require('./sinon/sandbox.js');
var stub = require('./sinon/stub.js');
var promise = require('./sinon/promise.js');
var samsam = require('@sinonjs/samsam');
var restoreObject = require('./sinon/restore-object.js');
var mockExpectation = require('./sinon/mock-expectation.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var samsam__default = /*#__PURE__*/_interopDefault(samsam);

// Temporary ESM wrapper for legacy CJS components

/**
 * @returns {object} a configured sandbox
 */
function createApi() {
    const apiMethods = {
        createSandbox: createSandbox,
        match: samsam__default.default.createMatcher,
        restoreObject: restoreObject,

        expectation: mockExpectation,

        // fake timers
        timers: fakeTimers.timers,

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        // fake promise
        promise: promise,
    };

    const sandbox$1 = new sandbox();
    return extend(sandbox$1, apiMethods);
}

module.exports = createApi;
