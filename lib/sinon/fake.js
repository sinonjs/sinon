"use strict";

var spy = require("./spy");
var nextTick = require("./util/core/next-tick");

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

function wrapFunc(f) {
    return cleanProxy(spy(f));
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

function yieldInternal(async, callback, values) {
    function f() {
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
    var callback = Array.prototype.slice.call(arguments, 0, 1)[0];
    var values = Array.prototype.slice.call(arguments, 1);

    if (typeof callback !== "function") {
        throw new TypeError("Expected callback to be a Function");
    }

    return yieldInternal(false, callback, values);
};

fake.yieldsAsync = function yieldsAsync() {
    var callback = Array.prototype.slice.call(arguments, 0, 1)[0];
    var values = Array.prototype.slice.call(arguments, 1);

    if (typeof callback !== "function") {
        throw new TypeError("Expected callback to be a Function");
    }

    return yieldInternal(true, callback, values);
};

module.exports = fake;
