import commons from "@sinonjs/commons";
import samsam from "@sinonjs/samsam";
import { inspect } from "util";

const { prototypes, functionName, valueToString } = commons;
const { createMatcher: match, deepEqual } = samsam;
const { filter, join, map, reduce, slice } = prototypes.array;

/**
 * @callback SinonFunction
 * @param {...unknown} args
 * @returns {unknown}
 */

/**
 * @param proxy
 * @param text
 * @param args
 */
function throwYieldError(proxy, text, args) {
    let msg = functionName(proxy) + text;
    if (args.length) {
        msg += ` Received [${join(slice(args), ", ")}]`;
    }
    throw new Error(msg);
}

const callProto = {
    calledOn: function calledOn(thisValue) {
        if (match.isMatcher(thisValue)) {
            return thisValue.test(this.thisValue);
        }
        return this.thisValue === thisValue;
    },

    calledWith: function calledWith(...calledWithArgs) {
        const self = this;

        if (calledWithArgs.length > self.args.length) {
            return false;
        }

        return reduce(
            calledWithArgs,
            (prev, arg, i) => prev && deepEqual(self.args[i], arg),
            true,
        );
    },

    calledWithMatch: function calledWithMatch(...calledWithMatchArgs) {
        const self = this;

        if (calledWithMatchArgs.length > self.args.length) {
            return false;
        }

        return reduce(
            calledWithMatchArgs,
            (prev, expectation, i) => {
                const actual = self.args[i];

                return prev && match(expectation).test(actual);
            },
            true,
        );
    },

    calledWithExactly: function calledWithExactly(...args) {
        return args.length === this.args.length && this.calledWith(...args);
    },

    notCalledWith: function notCalledWith(...args) {
        return !this.calledWith(...args);
    },

    notCalledWithMatch: function notCalledWithMatch(...args) {
        return !this.calledWithMatch(...args);
    },

    returned: function returned(value) {
        return deepEqual(this.returnValue, value);
    },

    threw: function threw(error) {
        if (typeof error === "undefined" || !this.exception) {
            return Boolean(this.exception);
        }

        return this.exception === error || this.exception.name === error;
    },

    calledWithNew: function calledWithNew() {
        return this.proxy.prototype && this.thisValue instanceof this.proxy;
    },

    calledBefore(other) {
        return this.callId < other.callId;
    },

    calledAfter(other) {
        return this.callId > other.callId;
    },

    calledImmediatelyBefore(other) {
        return this.callId === other.callId - 1;
    },

    calledImmediatelyAfter(other) {
        return this.callId === other.callId + 1;
    },

    callArg(pos) {
        this.ensureArgIsAFunction(pos);
        return this.args[pos]();
    },

    callArgOn(pos, thisValue) {
        this.ensureArgIsAFunction(pos);
        return this.args[pos].apply(thisValue);
    },

    callArgWith(pos, ...args) {
        return this.callArgOnWith(pos, null, ...args);
    },

    callArgOnWith(pos, thisValue, ...args) {
        this.ensureArgIsAFunction(pos);
        return this.args[pos].apply(thisValue, args);
    },

    throwArg(pos) {
        if (pos >= this.args.length) {
            throw new TypeError(
                `Not enough arguments: ${pos} required but only ${this.args.length} present`,
            );
        }

        throw this.args[pos];
    },

    yield(...yieldArgs) {
        return this.yieldOn(null, ...yieldArgs);
    },

    yieldOn(thisValue, ...yieldArgs) {
        const args = slice(this.args);
        const yieldFn = filter(args, (arg) => typeof arg === "function")[0];

        if (!yieldFn) {
            throwYieldError(
                this.proxy,
                " cannot yield since no callback was passed.",
                args,
            );
        }

        return yieldFn.apply(thisValue, yieldArgs);
    },

    yieldTo(prop, ...yieldArgs) {
        return this.yieldToOn(prop, null, ...yieldArgs);
    },

    yieldToOn(prop, thisValue, ...yieldArgs) {
        const args = slice(this.args);
        const yieldArg = filter(
            args,
            (arg) => arg && typeof arg[prop] === "function",
        )[0];
        const yieldFn = yieldArg && yieldArg[prop];

        if (!yieldFn) {
            throwYieldError(
                this.proxy,
                ` cannot yield to '${valueToString(
                    prop,
                )}' since no callback was passed.`,
                args,
            );
        }

        return yieldFn.apply(thisValue, yieldArgs);
    },

    toString() {
        if (!this.args) {
            return ":(";
        }

        let callStr = this.proxy ? `${String(this.proxy)}(` : "";
        const formattedArgs = map(this.args, (arg) => inspect(arg));

        callStr = `${callStr + join(formattedArgs, ", ")})`;

        if (typeof this.returnValue !== "undefined") {
            callStr += ` => ${inspect(this.returnValue)}`;
        }

        if (this.exception) {
            callStr += ` !${this.exception.name}`;

            if (this.exception.message) {
                callStr += `(${this.exception.message})`;
            }
        }
        if (this.stack) {
            // If we have a stack, add the first frame that's in end-user code
            // Skip the first two frames because they will refer to Sinon code
            callStr += (this.stack.split("\n")[3] || "unknown").replace(
                /^\s*(?:at\s+|@)?/,
                " at ",
            );
        }

        return callStr;
    },

    ensureArgIsAFunction(pos) {
        if (typeof this.args[pos] !== "function") {
            throw new TypeError(
                `Expected argument at position ${pos} to be a Function, but was ${typeof this
                    .args[pos]}`,
            );
        }
    },
};
Object.defineProperty(callProto, "stack", {
    enumerable: true,
    configurable: true,
    get() {
        return (this.errorWithCallStack && this.errorWithCallStack.stack) || "";
    },
});

callProto.invokeCallback = callProto.yield;

/**
 * Creates a proxy call object.
 *
 * @param {(...args: unknown[]) => unknown} proxy The proxy function
 * @param {unknown} thisValue The `this` context for the call
 * @param {Array} args The arguments for the call
 * @param {unknown} returnValue The return value of the call
 * @param {unknown} exception The exception thrown by the call
 * @param {number} id The call id
 * @param {Error} errorWithCallStack Error object used for stack trace
 * @returns {object} proxyCall
 */
export default function createProxyCall(
    proxy,
    thisValue,
    args,
    returnValue,
    exception,
    id,
    errorWithCallStack,
) {
    if (typeof id !== "number") {
        throw new TypeError("Call id is not a number");
    }

    let firstArg, lastArg;

    if (args.length > 0) {
        firstArg = args[0];
        lastArg = args.at(-1);
    }

    const proxyCall = Object.create(callProto);
    const callback =
        lastArg && typeof lastArg === "function" ? lastArg : undefined;

    proxyCall.proxy = proxy;
    proxyCall.thisValue = thisValue;
    proxyCall.args = args;
    proxyCall.firstArg = firstArg;
    proxyCall.lastArg = lastArg;
    proxyCall.callback = callback;
    proxyCall.returnValue = returnValue;
    proxyCall.exception = exception;
    proxyCall.callId = id;
    proxyCall.errorWithCallStack = errorWithCallStack;

    return proxyCall;
}
createProxyCall.toString = callProto.toString; // used by mocks
