import { prototypes } from "@sinonjs/commons";
import mockExpectation from "./mock-expectation.js";
import createProxyCall from "./proxy-call.js";
import extend from "./util/core/extend.js";
import { deepEqual } from "@sinonjs/samsam";
import wrapMethod from "./util/core/wrap-method.js";

const { concat, filter, forEach, every, join, push, slice, unshift } = prototypes.array;

/**
 * Creates a mock for an object.
 *
 * @param {object|string} object The object to mock, or a name for an anonymous mock
 * @returns {object} The mock object
 */
export default function mock(object) {
    if (!object || typeof object === "string") {
        return mockExpectation.create(object ? object : "Anonymous mock");
    }

    return mock.create(object);
}

function each(collection, callback) {
    const col = collection || [];

    forEach(col, callback);
}

function arrayEquals(arr1, arr2, compareLength) {
    if (compareLength && arr1.length !== arr2.length) {
        return false;
    }

    return every(arr1, function (element, i) {
        return deepEqual(arr2[i], element);
    });
}

extend(mock, {
    create: function create(object) {
        if (!object) {
            throw new TypeError("object is null");
        }

        const mockObject = extend.nonEnum({}, mock, { object: object });
        delete mockObject.create;

        return mockObject;
    },

    expects: function expects(method) {
        if (!method) {
            throw new TypeError("method is falsy");
        }

        if (!this.expectations) {
            this.expectations = {};
            this.proxies = [];
            this.failures = [];
        }

        if (!this.expectations[method]) {
            this.expectations[method] = [];
            const mockObject = this;

            wrapMethod(this.object, method, function () {
                return mockObject.invokeMethod(method, this, arguments);
            });

            push(this.proxies, method);
        }

        const expectation = mockExpectation.create(method);
        expectation.wrappedMethod = this.object[method].wrappedMethod;
        push(this.expectations[method], expectation);

        return expectation;
    },

    restore: function restore() {
        const object = this.object;

        each(this.proxies, function (proxy) {
            if (typeof object[proxy].restore === "function") {
                object[proxy].restore();
            }
        });
    },

    verify: function verify() {
        const expectations = this.expectations || {};
        const messages = this.failures ? slice(this.failures) : [];
        const met = [];

        each(this.proxies, function (proxy) {
            each(expectations[proxy], function (expectation) {
                if (!expectation.met()) {
                    push(messages, String(expectation));
                } else {
                    push(met, String(expectation));
                }
            });
        });

        this.restore();

        if (messages.length > 0) {
            mockExpectation.fail(join(concat(messages, met), "\n"));
        } else if (met.length > 0) {
            mockExpectation.pass(join(concat(messages, met), "\n"));
        }

        return true;
    },

    invokeMethod: function invokeMethod(method, thisValue, args) {
        /* if we cannot find any matching files we will explicitly call mockExpection#fail with error messages */
        /* eslint consistent-return: "off" */
        const expectations =
            this.expectations && this.expectations[method]
                ? this.expectations[method]
                : [];
        const currentArgs = args || [];
        let available;

        const expectationsWithMatchingArgs = filter(
            expectations,
            function (expectation) {
                const expectedArgs = expectation.expectedArguments || [];

                return arrayEquals(
                    expectedArgs,
                    currentArgs,
                    expectation.expectsExactArgCount,
                );
            },
        );

        const expectationsToApply = filter(
            expectationsWithMatchingArgs,
            function (expectation) {
                return (
                    !expectation.met() &&
                    expectation.allowsCall(thisValue, args)
                );
            },
        );

        if (expectationsToApply.length > 0) {
            return expectationsToApply[0].apply(thisValue, args);
        }

        const messages = [];
        let exhausted = 0;

        forEach(expectationsWithMatchingArgs, function (expectation) {
            if (expectation.allowsCall(thisValue, args)) {
                available = available || expectation;
            } else {
                exhausted += 1;
            }
        });

        if (available && exhausted === 0) {
            return available.apply(thisValue, args);
        }

        forEach(expectations, function (expectation) {
            push(messages, `    ${String(expectation)}`);
        });

        unshift(
            messages,
            `Unexpected call: ${createProxyCall.toString.call({
                proxy: method,
                args: args,
            })}`,
        );

        const err = new Error();
        if (!err.stack) {
            // PhantomJS does not serialize the stack trace until the error has been thrown
            try {
                throw err;
            } catch (e) {
                /* empty */
            }
        }
        push(
            this.failures,
            `Unexpected call: ${createProxyCall.toString.call({
                proxy: method,
                args: args,
                stack: err.stack,
            })}`,
        );

        mockExpectation.fail(join(messages, "\n"));
    },
});
