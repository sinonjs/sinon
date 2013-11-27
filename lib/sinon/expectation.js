/*jslint eqeqeq: false, onevar: false, forin: true*/
/*global module, require*/
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = require("./sinon");
var spy = require("./spy");
var stub = require("./stub");
var assert = require("./assert");
var match = require("./match");

var slice = Array.prototype.slice;
var _invoke = spy.invoke;
var times = sinon.timesInWords;

function callCountInWords(callCount) {
    if (callCount == 0) {
        return "never called";
    } else {
        return "called " + times(callCount);
    }
}

function expectedCallCountInWords(expectation) {
    var min = expectation.minCalls;
    var max = expectation.maxCalls;

    if (typeof min == "number" && typeof max == "number") {
        var str = times(min);

        if (min != max) {
            str = "at least " + str + " and at most " + times(max);
        }

        return str;
    }

    if (typeof min == "number") {
        return "at least " + times(min);
    }

    return "at most " + times(max);
}

function receivedMinCalls(expectation) {
    var hasMinLimit = typeof expectation.minCalls == "number";
    return !hasMinLimit || expectation.callCount >= expectation.minCalls;
}

function receivedMaxCalls(expectation) {
    if (typeof expectation.maxCalls != "number") {
        return false;
    }

    return expectation.callCount == expectation.maxCalls;
}

function verifyMatcher(possibleMatcher, arg){
    if (match.isMatcher(possibleMatcher)) {
        return possibleMatcher.test(arg);
    } else {
        return true;
    }
}

module.exports = function () {
    var proto = {

        minCalls: 1,
        maxCalls: 1,

        create: function create(methodName) {
            var expectation = sinon.extend(stub.create(), proto);
            delete expectation.create;
            expectation.method = methodName;

            return expectation;
        },

        invoke: function invoke(func, thisValue, args) {
            this.verifyCallAllowed(thisValue, args);

            return _invoke.apply(this, arguments);
        },

        atLeast: function atLeast(num) {
            if (typeof num != "number") {
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
            if (typeof num != "number") {
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
            if (typeof num != "number") {
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
                this.fail(this.method + " already called " + times(this.maxCalls));
            }

            if ("expectedThis" in this && this.expectedThis !== thisValue) {
                this.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                    this.expectedThis);
            }

            if (!("expectedArguments" in this)) {
                return;
            }

            if (!args) {
                this.fail(this.method + " received no arguments, expected " +
                    sinon.format(this.expectedArguments));
            }

            if (args.length < this.expectedArguments.length) {
                this.fail(this.method + " received too few arguments (" + sinon.format(args) +
                    "), expected " + sinon.format(this.expectedArguments));
            }

            if (this.expectsExactArgCount &&
                args.length != this.expectedArguments.length) {
                this.fail(this.method + " received too many arguments (" + sinon.format(args) +
                    "), expected " + sinon.format(this.expectedArguments));
            }

            for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {

                if (!verifyMatcher(this.expectedArguments[i],args[i])) {
                    this.fail(this.method + " received wrong arguments " + sinon.format(args) +
                        ", didn't match " + this.expectedArguments.toString());
                }

                if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                    this.fail(this.method + " received wrong arguments " + sinon.format(args) +
                        ", expected " + sinon.format(this.expectedArguments));
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
                if (!verifyMatcher(this.expectedArguments[i],args[i])) {
                    return false;
                }

                if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
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
                args.push("[...]");
            }

            var callStr = spy.spyCall.toString.call({
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
                this.fail(this.toString());
            } else {
                this.pass(this.toString());
            }

            return true;
        },

        pass: function(message) {
          assert.pass(message);
        },
        fail: function (message) {
            var exception = new Error(message);
            exception.name = "ExpectationError";

            throw exception;
        }
    };
    return proto;
};
