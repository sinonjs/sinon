/**
 * @depend ../sinon.js
 * @depend spy.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("sinon");
    }

    if (!sinon) {
        return;
    }

    function stub(object, property, func) {
        if (!!func && typeof func != "function") {
            throw new TypeError("Custom stub should be function");
        }

        var wrapper;

        if (func) {
            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
        } else {
            wrapper = stub.create();
        }

        if (!object && !property) {
            return sinon.stub.create();
        }

        if (!property && !!object && typeof object == "object") {
            for (var prop in object) {
                if (object.hasOwnProperty(prop) && typeof object[prop] == "function") {
                    stub(object, prop);
                }
            }

            return object;
        }

        return sinon.wrapMethod(object, property, wrapper);
    }

    sinon.extend(stub, (function () {
        var slice = Array.prototype.slice;

        return {
            create: function create() {
                var functionStub = function () {
                    if (functionStub.exception) {
                        throw functionStub.exception;
                    }

                    if (typeof functionStub.callArgAt == "number") {
                        var func = arguments[functionStub.callArgAt];

                        if (typeof func != "function") {
                            throw new TypeError("argument at index " + functionStub.callArgAt +
                                                " is not a function: " + func);
                        }

                        func.apply(null, functionStub.callbackArguments);
                    }

                    return functionStub.returnValue;
                };

                if (sinon.spy) {
                    functionStub = sinon.spy.create(functionStub);
                }

                sinon.extend(functionStub, stub);
                functionStub.displayName = "stub";
                functionStub.toString = sinon.functionToString;

                return functionStub;
            },

            returns: function returns(value) {
                this.returnValue = value;

                return this;
            },

            throws: function throws(error, message) {
                if (typeof error == "string") {
                    this.exception = new Error(message);
                    this.exception.name = error;
                } else if (!error) {
                    this.exception = new Error("Error");
                } else {
                    this.exception = error;
                }

                return this;
            },

            callsArg: function callsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = [];
            },

            callsArgWith: function callsArgWith(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = slice.call(arguments, 1);
            }
        };
    }()));

    if (commonJSModule) {
        module.exports = stub;
    } else {
        sinon.stub = stub;
    }
}(typeof sinon == "object" && sinon || null));
