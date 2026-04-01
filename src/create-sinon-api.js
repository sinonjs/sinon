// Temporary ESM wrapper for legacy CJS components
import behavior from "../lib/sinon/behavior.js";
import createSandbox from "../lib/sinon/create-sandbox.js";
import extend from "../lib/sinon/util/core/extend.js";
import fakeTimers from "../lib/sinon/util/fake-timers.js";
import Sandbox from "../lib/sinon/sandbox.js";
import stub from "../lib/sinon/stub.js";
import promise from "../lib/sinon/promise.js";
import samsam from "@sinonjs/samsam";
import restoreObject from "../lib/sinon/restore-object.js";
import expectation from "../lib/sinon/mock-expectation.js";

/**
 * @returns {object} a configured sandbox
 */
export default function createApi() {
    const apiMethods = {
        createSandbox: createSandbox,
        match: samsam.createMatcher,
        restoreObject: restoreObject,

        expectation: expectation,

        // fake timers
        timers: fakeTimers.timers,

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        // fake promise
        promise: promise,
    };

    const sandbox = new Sandbox();
    return extend(sandbox, apiMethods);
}
