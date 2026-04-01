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
    const sandbox$1 = new sandbox();

    const apiMethods = {
        createSandbox: function (config) {
            const s = createSandbox.apply(null, arguments);
            const fakes = sandbox$1.getFakes();
            // eslint-disable-next-line no-console
            console.log("ADDING NESTED SANDBOX TO COLLECTION. SIZE BEFORE:", fakes.length);
            fakes.push(s);
            // eslint-disable-next-line no-console
            console.log("SIZE AFTER:", fakes.length);
            return s;
        },
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

    return extend(sandbox$1, apiMethods);
}

module.exports = createApi;
