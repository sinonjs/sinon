/*jslint eqeqeq: false, onevar: false, nomen: false*/
/*global module, require*/
/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = require("./sinon");
var match = require("./match");
var spy = require("./spy");

function each(collection, callback) {
    if (!collection) {
        return;
    }

    for (var i = 0, l = collection.length; i < l; i += 1) {
        callback(collection[i]);
    }
}

module.exports = function (expectation) {

    function mock(object) {
        if (!object) {
            return expectation.create("Anonymous mock");
        }

        return mock.create(object);
    }

    return sinon.extend(mock, {

        create: function create(object) {
            if (!object) {
                throw new TypeError("object is null");
            }

            var mockObject = sinon.extend({}, mock);
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

                sinon.wrapMethod(this.object, method, function () {
                    return mockObject.invokeMethod(method, this, arguments);
                });

                this.proxies.push(method);
            }

            var exp = expectation.create(method);
            this.expectations[method].push(exp);

            return exp;
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
                        messages.push(expectation.toString());
                    } else {
                        met.push(expectation.toString());
                    }
                });
            });

            this.restore();

            if (messages.length > 0) {
                expectation.fail(messages.concat(met).join("\n"));
            } else {
                expectation.pass(messages.concat(met).join("\n"));
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
                messages.push("    " + expectations[i].toString());
            }

            if (exhausted === 0) {
                return available.apply(thisValue, args);
            }

            messages.unshift("Unexpected call: " + spy.spyCall.toString.call({
                proxy: method,
                args: args
            }));

            expectation.fail(messages.join("\n"));
        }

    });

};
