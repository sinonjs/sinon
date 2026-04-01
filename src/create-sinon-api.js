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
import createStubInstance from "./sinon/create-stub-instance.js";

/**
 * Creates the Sinon API.
 *
 * @returns {object} The Sinon API object
 */
export default function createApi() {
    const sandbox = new Sandbox();

    const apiMethods = {
        createSandbox: function (config) {
            const s = createSandbox.apply(null, arguments);
            const fakes = sandbox.getFakes();
            // eslint-disable-next-line no-console
            console.log("ADDING NESTED SANDBOX TO COLLECTION. SIZE BEFORE:", fakes.length);
            fakes.push(s);
            // eslint-disable-next-line no-console
            console.log("SIZE AFTER:", fakes.length);
            return s;
        },
        match: samsam.createMatcher,
        restoreObject: restoreObject,
        expectation: expectation,
        timers: fakeTimers.timers,
        createStubInstance: createStubInstance,

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        promise: promise,
    };

    return extend(sandbox, apiMethods);
}
