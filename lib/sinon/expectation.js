"use strict";
var extend = require("./extend");
var stub = require("./stub");
var spy = require("./spy");
var format = require("./format");
var deepEqual = require("./deep-equal");
var spyCall = require("./call");
var match = require("./match");
var times = require("./times_in_words");

var push = Array.prototype.push;
var slice = Array.prototype.slice;

function receivedMinCalls(expectation) {
    var hasMinLimit = typeof expectation.minCalls === "number";
    return !hasMinLimit || expectation.callCount >= expectation.minCalls;
}

function receivedMaxCalls(expectation) {
    if (typeof expectation.maxCalls !== "number") {
        return false;
    }

    return expectation.callCount === expectation.maxCalls;
}

function verifyMatcher(possibleMatcher, arg) {
    if (match && match.isMatcher(possibleMatcher)) {
        return possibleMatcher.test(arg);
    }
    return true;
}

function callCountInWords(callCount) {
    if (callCount == 0) {
        return "never called";
    }
    return "called " + times(callCount);
}

function expectedCallCountInWords(expectation) {
    var min = expectation.minCalls;
    var max = expectation.maxCalls;

    if (typeof min === "number" && typeof max === "number") {
        var str = times(min);

        if (min !== max) {
            str = "at least " + str + " and at most " + times(max);
        }

        return str;
    }

    if (typeof min === "number") {
        return "at least " + times(min);
    }

    return "at most " + times(max);
}

module.exports = {
    minCalls: 1,
    maxCalls: 1,

    create: function create(methodName) {
        var expectation = extend(stub(), module.exports);
        delete expectation.create;
        expectation.method = methodName;

        return expectation;
    },

    invoke: function invoke(func, thisValue, args) {
        this.verifyCallAllowed(thisValue, args);

        return spy.invoke.apply(this, arguments);
    },

    atLeast: function atLeast(num) {
        if (typeof num !== "number") {
            throw new TypeError("'" + num + "' is not number");
        }

        if (!this.limitsSet) {
            this.maxCalls = null;
            this.limitsSet = true;
        }

        this.minCalls = num;

        return this;
    },

    atMost: function atMost(num) {
        if (typeof num !== "number") {
            throw new TypeError("'" + num + "' is not number");
        }

        if (!this.limitsSet) {
            this.minCalls = null;
            this.limitsSet = true;
        }

        this.maxCalls = num;

        return this;
    },

    never: function never() {
        return this.exactly(0);
    },

    once: function once() {
        return this.exactly(1);
    },

    twice: function twice() {
        return this.exactly(2);
    },

    thrice: function thrice() {
        return this.exactly(3);
    },

    exactly: function exactly(num) {
        if (typeof num !== "number") {
            throw new TypeError("'" + num + "' is not a number");
        }

        this.atLeast(num);
        return this.atMost(num);
    },

    met: function met() {
        return !this.failed && receivedMinCalls(this);
    },

    verifyCallAllowed: function verifyCallAllowed(thisValue, args) {
        if (receivedMaxCalls(this)) {
            this.failed = true;
            module.exports.fail(this.method + " already called " + times(this.maxCalls));
        }

        if ("expectedThis" in this && this.expectedThis !== thisValue) {
            module.exports.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                                   this.expectedThis);
        }

        if (!("expectedArguments" in this)) {
            return;
        }

        if (!args) {
            module.exports.fail(this.method + " received no arguments, expected " +
                                   format(this.expectedArguments));
        }

        if (args.length < this.expectedArguments.length) {
            module.exports.fail(this.method + " received too few arguments (" + format(args) +
                                   "), expected " + format(this.expectedArguments));
        }

        if (this.expectsExactArgCount &&
                args.length !== this.expectedArguments.length) {
            module.exports.fail(this.method + " received too many arguments (" + format(args) +
                                   "), expected " + format(this.expectedArguments));
        }

        for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {

            if (!verifyMatcher(this.expectedArguments[i], args[i])) {
                module.exports.fail(this.method + " received wrong arguments " + format(args) +
                                       ", didn't match " + this.expectedArguments.toString());
            }

            if (!deepEqual(this.expectedArguments[i], args[i])) {
                module.exports.fail(this.method + " received wrong arguments " + format(args) +
                                       ", expected " + format(this.expectedArguments));
            }
        }
    },

    allowsCall: function allowsCall(thisValue, args) {
        if (this.met() && receivedMaxCalls(this)) {
            return false;
        }

        if ("expectedThis" in this && this.expectedThis !== thisValue) {
            return false;
        }

        if (!("expectedArguments" in this)) {
            return true;
        }

        args = args || [];

        if (args.length < this.expectedArguments.length) {
            return false;
        }

        if (this.expectsExactArgCount &&
            args.length != this.expectedArguments.length) {
            return false;
        }

        for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
            if (!verifyMatcher(this.expectedArguments[i], args[i])) {
                return false;
            }

            if (!deepEqual(this.expectedArguments[i], args[i])) {
                return false;
            }
        }

        return true;
    },

    withArgs: function withArgs() {
        this.expectedArguments = slice.call(arguments);
        return this;
    },

    withExactArgs: function withExactArgs() {
        this.withArgs.apply(this, arguments);
        this.expectsExactArgCount = true;
        return this;
    },

    on: function on(thisValue) {
        this.expectedThis = thisValue;
        return this;
    },

    toString: function () {
        var args = (this.expectedArguments || []).slice();

        if (!this.expectsExactArgCount) {
            push.call(args, "[...]");
        }

        var callStr = spyCall.toString.call({
            proxy: this.method || "anonymous mock expectation",
            args: args
        });

        var message = callStr.replace(", [...", "[, ...") + " " +
                expectedCallCountInWords(this);

        if (this.met()) {
            return "Expectation met: " + message;
        }

        return "Expected " + message + " (" +
            callCountInWords(this.callCount) + ")";
    },

    verify: function verify() {
        if (!this.met()) {
            module.exports.fail(this.toString());
        } else {
            module.exports.pass(this.toString());
        }

        return true;
    },

    pass: function pass(message) {
        // TODO
        // assert.pass(message);
    },

    fail: function fail(message) {
        var exception = new Error(message);
        exception.name = "ExpectationError";

        throw exception;
    }
};
