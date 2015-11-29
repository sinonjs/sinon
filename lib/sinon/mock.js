/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var mockExpectation = require("./mock-expectation");
var spyCallToString = require("./call").toString;
var extend = require("./extend");
var match = require("./match");
var deepEqual = require("./util/core/deep-equal").use(match);
var wrapMethod = require("./util/core/wrap-method");

var push = Array.prototype.push;

function mock(object) {
    // if (typeof console !== undefined && console.warn) {
    //     console.warn("mock will be removed from Sinon.JS v2.0");
    // }

    if (!object) {
        return mockExpectation.create("Anonymous mock");
    }

    return mock.create(object);
}

function each(collection, callback) {
    if (!collection) {
        return;
    }

    for (var i = 0, l = collection.length; i < l; i += 1) {
        callback(collection[i]);
    }
}

function arrayEquals(arr1, arr2, compareLength) {
    if (compareLength && (arr1.length !== arr2.length)) {
        return false;
    }

    for (var i = 0, l = arr1.length; i < l; i++) {
        if (!deepEqual(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}

extend(mock, {
    create: function create(object) {
        if (!object) {
            throw new TypeError("object is null");
        }

        var mockObject = extend({}, mock);
        mockObject.object = object;
        delete mockObject.create;

        return mockObject;
    },

    expects: function expects(method) {
        if (!method) {
            throw new TypeError("method is falsy");
        }

        if (!this.expectations) {
            this.expectations = {};
            this.proxies = [];
        }

        if (!this.expectations[method]) {
            this.expectations[method] = [];
            var mockObject = this;

            wrapMethod(this.object, method, function () {
                return mockObject.invokeMethod(method, this, arguments);
            });

            push.call(this.proxies, method);
        }

        var expectation = mockExpectation.create(method);
        push.call(this.expectations[method], expectation);

        return expectation;
    },

    restore: function restore() {
        var object = this.object;

        each(this.proxies, function (proxy) {
            if (typeof object[proxy].restore === "function") {
                object[proxy].restore();
            }
        });
    },

    verify: function verify() {
        var expectations = this.expectations || {};
        var messages = [];
        var met = [];

        each(this.proxies, function (proxy) {
            each(expectations[proxy], function (expectation) {
                if (!expectation.met()) {
                    push.call(messages, expectation.toString());
                } else {
                    push.call(met, expectation.toString());
                }
            });
        });

        this.restore();

        if (messages.length > 0) {
            mockExpectation.fail(messages.concat(met).join("\n"));
        } else if (met.length > 0) {
            mockExpectation.pass(messages.concat(met).join("\n"));
        }

        return true;
    },

    invokeMethod: function invokeMethod(method, thisValue, args) {
        var expectations = this.expectations && this.expectations[method] ? this.expectations[method] : [];
        var expectationsWithMatchingArgs = [];
        var currentArgs = args || [];
        var i, available;

        for (i = 0; i < expectations.length; i += 1) {
            var expectedArgs = expectations[i].expectedArguments || [];
            if (arrayEquals(expectedArgs, currentArgs, expectations[i].expectsExactArgCount)) {
                expectationsWithMatchingArgs.push(expectations[i]);
            }
        }

        for (i = 0; i < expectationsWithMatchingArgs.length; i += 1) {
            if (!expectationsWithMatchingArgs[i].met() &&
                expectationsWithMatchingArgs[i].allowsCall(thisValue, args)) {
                return expectationsWithMatchingArgs[i].apply(thisValue, args);
            }
        }

        var messages = [];
        var exhausted = 0;

        for (i = 0; i < expectationsWithMatchingArgs.length; i += 1) {
            if (expectationsWithMatchingArgs[i].allowsCall(thisValue, args)) {
                available = available || expectationsWithMatchingArgs[i];
            } else {
                exhausted += 1;
            }
        }

        if (available && exhausted === 0) {
            return available.apply(thisValue, args);
        }

        for (i = 0; i < expectations.length; i += 1) {
            push.call(messages, "    " + expectations[i].toString());
        }

        messages.unshift("Unexpected call: " + spyCallToString.call({
            proxy: method,
            args: args
        }));

        mockExpectation.fail(messages.join("\n"));
    }
});

module.exports = mock;
