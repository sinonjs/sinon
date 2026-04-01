// Temporary ESM wrapper for legacy CJS components
import behavior from "./sinon/behavior.js";
import createSandbox from "./sinon/create-sandbox.js";
import extend from "./sinon/util/core/extend.js";
import * as fakeTimers from "./sinon/util/fake-timers.js";
import Sandbox from "./sinon/sandbox.js";
import stub from "./sinon/stub.js";
import promise from "./sinon/promise.js";
import samsam from "@sinonjs/samsam";
import restoreObject from "./sinon/restore-object.js";
import expectation from "./sinon/mock-expectation.js";

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
