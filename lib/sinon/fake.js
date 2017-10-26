"use strict";

var spy = require("./spy");

function getError(value) {
    return value instanceof Error ? value : new Error(value);
}

function fake(f) {
    if (typeof func !== "undefined" && typeof func !== "function") {
        throw new TypeError("Expected func argument to be a Function");
    }

    return spy(f);
}

fake.returns = function returns(value) {
    function f() {
        return value;
    }

    return spy(f);
};

fake.throws = function throws(value) {
    function f() {
        throw getError(value);
    }

    return spy(f);
};

fake.resolves = function resolves(value) {
    function f() {
        return Promise.resolve(value);
    }

    return spy(f);
};

fake.rejects = function rejects(value) {
    function f() {
        return Promise.reject(getError(value));
    }

    return spy(f);
};

module.exports = fake;
