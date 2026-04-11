import commons from "@sinonjs/commons";
import createProxy from "./proxy.js";
import nextTick from "./util/core/next-tick.js";

const { prototypes } = commons;
const { slice } = prototypes.array;

/**
 * @callback SinonFunction
 * @param {...unknown} args
 * @returns {unknown}
 */

/**
 * Returns a `fake` that records all calls, arguments and return values.
 *
 * When an `f` argument is supplied, this implementation will be used.
 *
 * @param {SinonFunction|undefined} [f]
 * @returns {SinonFunction}
 * @namespace
 */
function fake(f) {
    if (arguments.length > 0 && typeof f !== "function") {
        throw new TypeError("Expected f argument to be a Function");
    }

    return wrapFunc(f);
}

/**
 * Creates a `fake` that returns the provided `value`, as well as recording all
 * calls, arguments and return values.
 *
 * @memberof fake
 * @param {unknown} value
 * @returns {SinonFunction}
 */
fake.returns = function returns(value) {
    function f() {
        return value;
    }

    return wrapFunc(f);
};

/**
 * Creates a `fake` that throws an Error.
 *
 * @memberof fake
 * @param {unknown|Error} value
 * @returns {SinonFunction}
 */
fake.throws = function throws(value) {
    function f() {
        throw getError(value);
    }

    return wrapFunc(f);
};

/**
 * Creates a `fake` that returns a promise that resolves to the passed `value`
 *
 * @memberof fake
 * @param {unknown} value
 * @returns {SinonFunction}
 */
fake.resolves = function resolves(value) {
    function f() {
        return Promise.resolve(value);
    }

    return wrapFunc(f);
};

/**
 * Creates a `fake` that returns a promise that rejects to the passed `value`
 *
 * @memberof fake
 * @param {unknown} value
 * @returns {SinonFunction}
 */
fake.rejects = function rejects(value) {
    function f() {
        return Promise.reject(getError(value));
    }

    return wrapFunc(f);
};

/**
 * Returns a `fake` that calls the callback with the defined arguments.
 *
 * @memberof fake
 * @returns {SinonFunction}
 */
fake.yields = function yields() {
    const values = slice(arguments);

    function f() {
        const callback = arguments[arguments.length - 1];
        if (typeof callback !== "function") {
            throw new TypeError("Expected last argument to be a function");
        }

        callback.apply(null, values);
    }

    return wrapFunc(f);
};

/**
 * Returns a `fake` that calls the callback **asynchronously** with the
 * defined arguments.
 *
 * @memberof fake
 * @returns {SinonFunction}
 */
fake.yieldsAsync = function yieldsAsync() {
    const values = slice(arguments);

    function f() {
        const callback = arguments[arguments.length - 1];
        if (typeof callback !== "function") {
            throw new TypeError("Expected last argument to be a function");
        }
        nextTick(function () {
            callback.apply(null, values);
        });
    }

    return wrapFunc(f);
};

let uuid = 0;
/**
 * Creates a proxy (sinon concept) from the passed function.
 *
 * @private
 * @param  {SinonFunction} f
 * @returns {SinonFunction}
 */
function wrapFunc(f) {
    const fakeInstance = function () {
        let firstArg, lastArg;

        if (arguments.length > 0) {
            firstArg = arguments[0];
            lastArg = arguments[arguments.length - 1];
        }

        const callback =
            lastArg && typeof lastArg === "function" ? lastArg : undefined;

        /* eslint-disable no-use-before-define */
        proxy.firstArg = firstArg;
        proxy.lastArg = lastArg;
        proxy.callback = callback;

        return f && f.apply(this, arguments);
    };
    const proxy = createProxy(fakeInstance, f || fakeInstance);

    Object.defineProperty(proxy, "name", {
        value: "fake",
        configurable: true,
    });

    proxy.displayName = "fake";
    proxy.id = `fake#${uuid++}`;

    return proxy;
}

/**
 * Returns an Error instance from the passed value, if the value is not
 * already an Error instance.
 *
 * @private
 * @param  {unknown} value [description]
 * @returns {Error}       [description]
 */
function getError(value) {
    return value instanceof Error ? value : new Error(value);
}

export default fake;
