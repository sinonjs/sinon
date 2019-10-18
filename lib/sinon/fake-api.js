"use strict";

var arrayProto = require("@sinonjs/commons").prototypes.array;
var fakeCall = require("./call");
var callUtil = require("./call-util");

var push = arrayProto.push;
var forEach = arrayProto.forEach;
var concat = arrayProto.concat;
var ErrorConstructor = Error.prototype.constructor;
var bind = Function.prototype.bind;
var filter = Array.prototype.filter;

var callId = 0;

// Public API
var fakeApi = {
    invoke: function invoke(func, thisValue, args) {
        var matchings = this.matchingFakes(args);
        var currentCallId = callId++;
        var exception, returnValue;

        callUtil.incrementCallCount(this);
        push(this.thisValues, thisValue);
        push(this.args, args);
        push(this.callIds, currentCallId);
        forEach(matchings, function(matching) {
            callUtil.incrementCallCount(matching);
            push(matching.thisValues, thisValue);
            push(matching.args, args);
            push(matching.callIds, currentCallId);
        });

        // Make call properties available from within the spied function:
        callUtil.createCallProperties(this);
        forEach(matchings, callUtil.createCallProperties);

        try {
            this.invoking = true;

            var thisCall = this.getCall(this.callCount - 1);

            if (thisCall.calledWithNew()) {
                // Call through with `new`
                returnValue = new (bind.apply(this.func || func, concat([thisValue], args)))();

                if (typeof returnValue !== "object") {
                    returnValue = thisValue;
                }
            } else {
                returnValue = (this.func || func).apply(thisValue, args);
            }
        } catch (e) {
            exception = e;
        } finally {
            delete this.invoking;
        }

        push(this.exceptions, exception);
        push(this.returnValues, returnValue);
        forEach(matchings, function(matching) {
            push(matching.exceptions, exception);
            push(matching.returnValues, returnValue);
        });

        var err = new ErrorConstructor();
        // 1. Please do not get stack at this point. It may be so very slow, and not actually used
        // 2. PhantomJS does not serialize the stack trace until the error has been thrown:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
        try {
            throw err;
        } catch (e) {
            /* empty */
        }
        push(this.errorsWithCallStack, err);
        forEach(matchings, function(matching) {
            push(matching.errorsWithCallStack, err);
        });

        // Make return value and exception available in the calls:
        callUtil.createCallProperties(this);
        forEach(matchings, callUtil.createCallProperties);

        if (exception !== undefined) {
            throw exception;
        }

        return returnValue;
    },

    matchingFakes: function(args, strict) {
        return filter.call(this.fakes, function(fake) {
            return fake.matches(args, strict);
        });
    },

    getCall: function getCall(i) {
        if (i < 0 || i >= this.callCount) {
            return null;
        }

        return fakeCall(
            this,
            this.thisValues[i],
            this.args[i],
            this.returnValues[i],
            this.exceptions[i],
            this.callIds[i],
            this.errorsWithCallStack[i]
        );
    },

    getCalls: function() {
        var calls = [];
        var i;

        for (i = 0; i < this.callCount; i++) {
            push(calls, this.getCall(i));
        }

        return calls;
    },

    resetHistory: function() {
        if (this.invoking) {
            var err = new Error(
                "Cannot reset Sinon function while invoking it. " +
                    "Move the call to .resetHistory outside of the callback."
            );
            err.name = "InvalidResetException";
            throw err;
        }

        this.called = false;
        this.notCalled = true;
        this.calledOnce = false;
        this.calledTwice = false;
        this.calledThrice = false;
        this.callCount = 0;
        this.firstCall = null;
        this.secondCall = null;
        this.thirdCall = null;
        this.lastCall = null;
        this.args = [];
        this.lastArg = null;
        this.returnValues = [];
        this.thisValues = [];
        this.exceptions = [];
        this.callIds = [];
        this.errorsWithCallStack = [];

        forEach(this.fakes, function(fake) {
            fake.resetHistory();
        });

        return this;
    }
};

var delegateToCalls = callUtil.delegateToCalls;
delegateToCalls(fakeApi, "calledOn", true);
delegateToCalls(fakeApi, "alwaysCalledOn", false, "calledOn");
delegateToCalls(fakeApi, "calledWith", true);
delegateToCalls(fakeApi, "calledOnceWith", true, "calledWith", false, undefined, 1);
delegateToCalls(fakeApi, "calledWithMatch", true);
delegateToCalls(fakeApi, "alwaysCalledWith", false, "calledWith");
delegateToCalls(fakeApi, "alwaysCalledWithMatch", false, "calledWithMatch");
delegateToCalls(fakeApi, "calledWithExactly", true);
delegateToCalls(fakeApi, "calledOnceWithExactly", true, "calledWithExactly", false, undefined, 1);
delegateToCalls(fakeApi, "alwaysCalledWithExactly", false, "calledWithExactly");
delegateToCalls(fakeApi, "neverCalledWith", false, "notCalledWith", false, function() {
    return true;
});
delegateToCalls(fakeApi, "neverCalledWithMatch", false, "notCalledWithMatch", false, function() {
    return true;
});
delegateToCalls(fakeApi, "threw", true);
delegateToCalls(fakeApi, "alwaysThrew", false, "threw");
delegateToCalls(fakeApi, "returned", true);
delegateToCalls(fakeApi, "alwaysReturned", false, "returned");
delegateToCalls(fakeApi, "calledWithNew", true);
delegateToCalls(fakeApi, "alwaysCalledWithNew", false, "calledWithNew");

module.exports = fakeApi;
