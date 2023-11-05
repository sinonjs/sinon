"use strict";

const arrayProto = require("@sinonjs/commons").prototypes.array;
const createProxy = require("./proxy");
const nextTick = require("./util/core/next-tick");

const slice = arrayProto.slice;
let promiseLib = Promise;

module.exports = fake;

/**
 * Returns a `fake` that records all calls, arguments and return values.
 *
 * When an `f` argument is supplied, this implementation will be used.
 *
 * @example
 * // create an empty fake
 * var f1 = sinon.fake();
 *
 * f1();
 *
 * f1.calledOnce()
 * // true
 *
 * @example
 * function greet(greeting) {
 *   console.log(`Hello ${greeting}`);
 * }
 *
 * // create a fake with implementation
 * var f2 = sinon.fake(greet);
 *
 * // Hello world
 * f2("world");
 *
 * f2.calledWith("world");
 * // true
 *
 * @param {Function|undefined} f
 * @returns {Function}
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
 * @example
 * var f1 = sinon.fake.returns(42);
 *
 * f1();
 * // 42
 *
 * @memberof fake
 * @param {*} value
 * @returns {Function}
 */
fake.returns = function returns(value) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function f() {
        return value;
    }

    return wrapFunc(f);
};

/**
 * Creates a `fake` that throws an Error.
 *
 * @example
 * var f1 = sinon.fake.throws("hello");
 *
 * try { f1(); } catch (err} { console.log(typeof err, err); }
 * // string hello
 * @example
 * var f2 = sinon.fake.throws(new TypeError("Invalid argument"));
 *
 * try { f2(); } catch (err} { console.log(typeof err, err); }
 * // Uncaught TypeError: Invalid argument
 *
 * @memberof fake
 * @param {*} err
 * @returns {Function}
 */
fake.throws = function throws(err) {
    return wrapFunc(() => {
        throw err;
    });
};

/**
 * Creates a `fake` that returns a promise that resolves to the passed `value`
 * argument.
 *
 * @example
 * var f1 = sinon.fake.resolves("apple pie");
 *
 * await f1();
 * // "apple pie"
 *
 * @memberof fake
 * @param {*} value
 * @returns {Function}
 */
fake.resolves = function resolves(value) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function f() {
        return promiseLib.resolve(value);
    }

    return wrapFunc(f);
};

/**
 * Creates a `fake` that returns a promise that rejects to the passed `value`
 * argument.
 *
 * @example
 * var f1 = sinon.fake.rejects(":(");
 *
 * try {
 *   await ft();
 * } catch (error) {
 *   console.log(typeof error, error);
 *   // "string :("
 * }
 *
 * @memberof fake
 * @param {*} reason
 * @returns {Function}
 */
fake.rejects = function rejects(reason) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function f() {
        return promiseLib.reject(reason);
    }

    return wrapFunc(f);
};

/**
 * Causes `fake` to use a custom Promise implementation, instead of the native
 * Promise implementation.
 *
 * @example
 * const bluebird = require("bluebird");
 * sinon.fake.usingPromise(bluebird);
 *
 * @memberof fake
 * @param {*} promiseLibrary
 * @returns {Function}
 */
fake.usingPromise = function usingPromise(promiseLibrary) {
    promiseLib = promiseLibrary;
    return fake;
};

/**
 * Returns a `fake` that calls the callback with the defined arguments.
 *
 * @example
 * function callback() {
 *   console.log(arguments.join("*"));
 * }
 *
 * const f1 = sinon.fake.yields("apple", "pie");
 *
 * f1(callback);
 * // "apple*pie"
 *
 * @memberof fake
 * @returns {Function}
 */
fake.yields = function yields() {
    const values = slice(arguments);

    // eslint-disable-next-line jsdoc/require-jsdoc
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
 * @example
 * function callback() {
 *   console.log(arguments.join("*"));
 * }
 *
 * const f1 = sinon.fake.yields("apple", "pie");
 *
 * f1(callback);
 *
 * setTimeout(() => {
 *   // "apple*pie"
 * });
 *
 * @memberof fake
 * @returns {Function}
 */
fake.yieldsAsync = function yieldsAsync() {
    const values = slice(arguments);

    // eslint-disable-next-line jsdoc/require-jsdoc
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
 * @param  {Function} f
 * @returns {Function}
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

    proxy.displayName = "fake";
    proxy.id = `fake#${uuid++}`;

    return proxy;
}
