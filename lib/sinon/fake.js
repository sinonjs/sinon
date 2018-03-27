"use strict";

var spy = require("./spy");
var nextTick = require("./util/core/next-tick");

var slice = Array.prototype.slice;

function getError(value) {
    return value instanceof Error ? value : new Error(value);
}

function cleanProxy(f) {
    var undesirableProperties = [
        "instantiateFake",
        "callArg",
        "callArgOn",
        "callArgOnWith",
        "callArgWith",
        "invokeCallback",
        "throwArg",
        "withArgs",
        "yield",
        "yieldOn",
        "yieldTo",
        "yieldToOn"
    ];

    undesirableProperties.forEach(function (key) {
        delete f[key];
    });

    return f;
}

var uuid = 0;
function wrapFunc(f) {
    var fakeInstance = function () {
        var lastArg = arguments.length > 0 && arguments[arguments.length - 1] || undefined;
        var callback = lastArg && typeof lastArg === "function" ? lastArg : undefined;

        /* eslint-disable no-use-before-define */
        p.lastArg = lastArg;
        p.callback = callback;
        /* eslint-enable no-use-before-define */

        return f && f.apply(f, arguments);
    };
    var p = cleanProxy(spy(fakeInstance));

    p.displayName = "fake";
    p.id = "fake#" + uuid++;

    return p;
}

function fake(f) {
    if (typeof func !== "undefined" && typeof func !== "function") {
        throw new TypeError("Expected func argument to be a Function");
    }

    return wrapFunc(f);
}

fake.returns = function returns(value) {
    function f() {
        return value;
    }

    return wrapFunc(f);
};

fake.throws = function throws(value) {
    function f() {
        throw getError(value);
    }

    return wrapFunc(f);
};

fake.resolves = function resolves(value) {
    function f() {
        return Promise.resolve(value);
    }

    return wrapFunc(f);
};

fake.rejects = function rejects(value) {
    function f() {
        return Promise.reject(getError(value));
    }

    return wrapFunc(f);
};

function yieldInternal(async, values) {
    function f() {
        var callback = arguments[arguments.length - 1];
        if (typeof callback !== "function") {
            throw new TypeError("Expected last argument to be a function");
        }
        if (async) {
            nextTick(function () {
                callback.apply(null, values);
            });
        } else {
            callback.apply(null, values);
        }
    }

    return wrapFunc(f);
}

fake.yields = function yields() {
    return yieldInternal(false, slice.call(arguments));
};

fake.yieldsAsync = function yieldsAsync() {
    return yieldInternal(true, slice.call(arguments));
};

module.exports = fake;
