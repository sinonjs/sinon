import behavior from "./sinon/behavior.js";
import createConfiguredSandbox from "./sinon/create-sandbox.js";
import createStubInstanceImpl from "./sinon/create-stub-instance.js";
import collectOwnMethods from "./sinon/collect-own-methods.js";
import extend from "./sinon/util/core/extend.js";
import * as fakeTimers from "./sinon/util/fake-timers.js";
import Sandbox from "./sinon/sandbox.js";
import stub from "./sinon/stub.js";
import promise from "./sinon/promise.js";
import samsam from "@sinonjs/samsam";
import restoreObject from "./sinon/restore-object.js";
import expectation from "./sinon/mock-expectation.js";

/**
 * Creates the Sinon API.
 *
 * @returns {object} The Sinon API object
 */
export default function createApi() {
    const sandbox = new Sandbox();

    const apiMethods = {
        createSandbox: function createSandbox(config) {
            const s = createConfiguredSandbox(config);
            sandbox.getFakes().push(s);
            return s;
        },
        match: samsam.createMatcher,
        restoreObject: restoreObject,
        expectation: expectation,
        timers: fakeTimers.timers,
        createStubInstance: function createStubInstance() {
            const stubbed = createStubInstanceImpl.apply(null, arguments);

            for (const method of collectOwnMethods(stubbed)) {
                sandbox.getFakes().push(method);
            }

            return stubbed;
        },

        addBehavior: function (name, fn) {
            behavior.addBehavior(stub, name, fn);
        },

        promise: promise,
    };

    Object.defineProperty(apiMethods.createSandbox, "name", {
        value: "createSandbox",
        configurable: true,
    });
    Object.defineProperty(apiMethods.createSandbox, "length", {
        value: 1,
        configurable: true,
    });

    Object.defineProperty(apiMethods.createStubInstance, "name", {
        value: "createStubInstance",
        configurable: true,
    });
    Object.defineProperty(apiMethods.createStubInstance, "length", {
        value: 1,
        configurable: true,
    });

    return extend(sandbox, apiMethods);
}
