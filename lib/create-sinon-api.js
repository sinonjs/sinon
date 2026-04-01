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
var createStubInstance = require('./sinon/create-stub-instance.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var samsam__default = /*#__PURE__*/_interopDefault(samsam);

/**
 * Creates the Sinon API.
 *
 * @returns {object} The Sinon API object
 */
function createApi() {
    const apiMethods = {
        createSandbox: createSandbox,
        match: samsam__default.default.createMatcher,
        restoreObject: restoreObject,
        expectation: mockExpectation,
        timers: fakeTimers.timers,
        createStubInstance: createStubInstance,

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        promise: promise,
    };

    const sandbox$1 = new sandbox();
    return extend(sandbox$1, apiMethods);
}

module.exports = createApi;
