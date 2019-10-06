"use strict";

var slice = require("@sinonjs/commons").prototypes.array.slice;
var extend = require("./util/core/extend");
var functionToString = require("./util/core/function-to-string");

function createProxy(func, arity) {
    var length = arity || func.length;
    var proxy = wrapFunction(func, length);

    // Inherit function properties:
    extend(proxy, func);

    proxy.prototype = func.prototype;

    extend.nonEnum(proxy, {
        toString: functionToString
    });

    return proxy;
}

function wrapFunction(func, proxyLength) {
    // Retain the function length:
    var p;
    if (proxyLength) {
        // Do not change this to use an eval. Projects that depend on sinon block the use of eval.
        // ref: https://github.com/sinonjs/sinon/issues/710
        switch (proxyLength) {
            /*eslint-disable no-unused-vars, max-len*/
            case 1:
                p = function proxy(a) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 2:
                p = function proxy(a, b) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 3:
                p = function proxy(a, b, c) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 4:
                p = function proxy(a, b, c, d) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 5:
                p = function proxy(a, b, c, d, e) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 6:
                p = function proxy(a, b, c, d, e, f) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 7:
                p = function proxy(a, b, c, d, e, f, g) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 8:
                p = function proxy(a, b, c, d, e, f, g, h) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 9:
                p = function proxy(a, b, c, d, e, f, g, h, i) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 10:
                p = function proxy(a, b, c, d, e, f, g, h, i, j) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 11:
                p = function proxy(a, b, c, d, e, f, g, h, i, j, k) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            case 12:
                p = function proxy(a, b, c, d, e, f, g, h, i, j, k, l) {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            default:
                p = function proxy() {
                    return p.invoke(func, this, slice(arguments));
                };
                break;
            /*eslint-enable*/
        }
    } else {
        p = function proxy() {
            return p.invoke(func, this, slice(arguments));
        };
    }
    var nameDescriptor = Object.getOwnPropertyDescriptor(func, "name");
    if (nameDescriptor && nameDescriptor.configurable) {
        // IE 11 functions don't have a name.
        // Safari 9 has names that are not configurable.
        Object.defineProperty(p, "name", nameDescriptor);
    }
    extend.nonEnum(p, {
        isSinonProxy: true,

        called: false,
        notCalled: true,
        calledOnce: false,
        calledTwice: false,
        calledThrice: false,
        callCount: 0,
        firstCall: null,
        secondCall: null,
        thirdCall: null,
        lastCall: null,
        lastArg: null,
        args: [],
        returnValues: [],
        thisValues: [],
        exceptions: [],
        callIds: [],
        errorsWithCallStack: []
    });
    return p;
}

module.exports = createProxy;
