"use strict";
var mockExpectation = require("./expectation");
var extend = require("./extend");
var wrapMethod = require("./wrap-method");
var spyCall = require("./call");
var push = Array.prototype.push;

function mock(object) {
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

module.exports = extend(mock, {
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
            if (typeof object[proxy].restore == "function") {
                object[proxy].restore();
            }
        });
    },

    verify: function verify() {
        var expectations = this.expectations || {};
        var messages = [], met = [];

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
        var expectations = this.expectations && this.expectations[method];
        var length = expectations && expectations.length || 0, i;

        for (i = 0; i < length; i += 1) {
            if (!expectations[i].met() &&
                expectations[i].allowsCall(thisValue, args)) {
                return expectations[i].apply(thisValue, args);
            }
        }

        var messages = [], available, exhausted = 0;

        for (i = 0; i < length; i += 1) {
            if (expectations[i].allowsCall(thisValue, args)) {
                available = available || expectations[i];
            } else {
                exhausted += 1;
            }
            push.call(messages, "    " + expectations[i].toString());
        }

        if (exhausted === 0) {
            return available.apply(thisValue, args);
        }

        messages.unshift("Unexpected call: " + spyCall.toString.call({
            proxy: method,
            args: args
        }));

        mockExpectation.fail(messages.join("\n"));
    }
});
