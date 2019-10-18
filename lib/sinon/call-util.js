"use strict";

var push = require("@sinonjs/commons").prototypes.array.push;

exports.incrementCallCount = function incrementCallCount(fake) {
    fake.called = true;
    fake.callCount += 1;
    fake.notCalled = false;
    fake.calledOnce = fake.callCount === 1;
    fake.calledTwice = fake.callCount === 2;
    fake.calledThrice = fake.callCount === 3;
};

exports.createCallProperties = function createCallProperties(fake) {
    fake.firstCall = fake.getCall(0);
    fake.secondCall = fake.getCall(1);
    fake.thirdCall = fake.getCall(2);
    fake.lastCall = fake.getCall(fake.callCount - 1);
};

exports.delegateToCalls = function delegateToCalls(
    fake,
    method,
    matchAny,
    actual,
    returnsValues,
    notCalled,
    totalCallCount
) {
    fake[method] = function() {
        if (!this.called) {
            if (notCalled) {
                return notCalled.apply(this, arguments);
            }
            return false;
        }

        if (totalCallCount !== undefined && this.callCount !== totalCallCount) {
            return false;
        }

        var currentCall;
        var matches = 0;
        var returnValues = [];

        for (var i = 0, l = this.callCount; i < l; i += 1) {
            currentCall = this.getCall(i);
            var returnValue = currentCall[actual || method].apply(currentCall, arguments);
            push(returnValues, returnValue);
            if (returnValue) {
                matches += 1;

                if (matchAny) {
                    return true;
                }
            }
        }

        if (returnsValues) {
            return returnValues;
        }
        return matches === this.callCount;
    };
};
