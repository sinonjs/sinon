"use strict";
var fn = require("./functions");
var match = require("./match");
var deepEqual = require("./deep-equal");
var format = require("./format");

var slice = Array.prototype.slice;

function throwYieldError(proxy, text, args) {
    var msg = fn.getName(proxy) + text;
    if (args.length) {
        msg += " Received [" + slice.call(args).join(", ") + "]";
    }
    throw new Error(msg);
}

var callProto = {
    calledOn: function calledOn(thisValue) {
        if (match.isMatcher(thisValue)) {
            return thisValue.test(this.thisValue);
        }
        return this.thisValue === thisValue;
    },

    calledWith: function calledWith() {
        for (var i = 0, l = arguments.length; i < l; i += 1) {
            if (!deepEqual(arguments[i], this.args[i])) {
                return false;
            }
        }

        return true;
    },

    calledWithMatch: function calledWithMatch() {
        for (var i = 0, l = arguments.length; i < l; i += 1) {
            var actual = this.args[i];
            var expectation = arguments[i];
            if (!match(expectation).test(actual)) {
                return false;
            }
        }
        return true;
    },

    calledWithExactly: function calledWithExactly() {
        return arguments.length == this.args.length &&
            this.calledWith.apply(this, arguments);
    },

    notCalledWith: function notCalledWith() {
        return !this.calledWith.apply(this, arguments);
    },

    notCalledWithMatch: function notCalledWithMatch() {
        return !this.calledWithMatch.apply(this, arguments);
    },

    returned: function returned(value) {
        return deepEqual(value, this.returnValue);
    },

    threw: function threw(error) {
        if (typeof error === "undefined" || !this.exception) {
            return !!this.exception;
        }

        return this.exception === error || this.exception.name === error;
    },

    calledWithNew: function calledWithNew() {
        return this.proxy.prototype && this.thisValue instanceof this.proxy;
    },

    calledBefore: function (other) {
        return this.callId < other.callId;
    },

    calledAfter: function (other) {
        return this.callId > other.callId;
    },

    callArg: function (pos) {
        this.args[pos]();
    },

    callArgOn: function (pos, thisValue) {
        this.args[pos].apply(thisValue);
    },

    callArgWith: function (pos) {
        this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));
    },

    callArgOnWith: function (pos, thisValue) {
        var args = slice.call(arguments, 2);
        this.args[pos].apply(thisValue, args);
    },

    yield: function () {
        this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));
    },

    yieldOn: function (thisValue) {
        var args = this.args;
        for (var i = 0, l = args.length; i < l; ++i) {
            if (typeof args[i] === "function") {
                args[i].apply(thisValue, slice.call(arguments, 1));
                return;
            }
        }
        throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);
    },

    yieldTo: function (prop) {
        this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));
    },

    yieldToOn: function (prop, thisValue) {
        var args = this.args;
        for (var i = 0, l = args.length; i < l; ++i) {
            if (args[i] && typeof args[i][prop] === "function") {
                args[i][prop].apply(thisValue, slice.call(arguments, 2));
                return;
            }
        }
        throwYieldError(this.proxy, " cannot yield to '" + prop +
                        "' since no callback was passed.", args);
    },

    toString: function () {
        var callStr = this.proxy.toString() + "(";
        var args = [];

        for (var i = 0, l = this.args.length; i < l; ++i) {
            args.push(format(this.args[i]));
        }

        callStr = callStr + args.join(", ") + ")";

        if (typeof this.returnValue != "undefined") {
            callStr += " => " + format(this.returnValue);
        }

        if (this.exception) {
            callStr += " !" + this.exception.name;

            if (this.exception.message) {
                callStr += "(" + this.exception.message + ")";
            }
        }

        return callStr;
    }
};

callProto.invokeCallback = callProto.yield;

function createSpyCall(spy, thisValue, args, returnValue, exception, id) {
    if (typeof id !== "number") {
        throw new TypeError("Call id is not a number");
    }
    var proxyCall = fn.create(callProto);
    proxyCall.proxy = spy;
    proxyCall.thisValue = thisValue;
    proxyCall.args = args;
    proxyCall.returnValue = returnValue;
    proxyCall.exception = exception;
    proxyCall.callId = id;

    return proxyCall;
}
createSpyCall.toString = callProto.toString; // used by mocks

module.exports = createSpyCall;
