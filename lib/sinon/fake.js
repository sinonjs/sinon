"use strict";

var spy = require("./spy");

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

module.exports = fake;
