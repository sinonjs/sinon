/* @depend ../sinon.js */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Match functions
 *
 * @author Maximilian Antoni (mail@maxantoni.de)
 * @license BSD
 *
 * Copyright (c) 2012 Maximilian Antoni
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function assertType(value, type, name) {
        var actual = sinon.typeOf(value);
        if (actual !== type) {
            throw new TypeError("Expected type of " + name + " to be " +
                type + ", but was " + actual);
        }
    }

    var matcher = {
        toString: function () {
            return this.message;
        }
    };

    var match = function (test, message) {
        assertType(test, "function", "test");
        assertType(message, "string", "message");
        var m = sinon.create(matcher);
        m.test = test;
        m.message = message;
        return m;
    };

    match.isMatcher = function (object) {
        return matcher.isPrototypeOf(object);
    };

    match.any = function () {
        return match(function () {
            return true;
        }, "any()");
    };

    match.same = function (expectation) {
        return match(function (actual) {
            return expectation === actual;
        }, "same(" + expectation + ")");
    };

    match.typeOf = function (type) {
        assertType(type, "string", "type");
        return match(function (actual) {
            return sinon.typeOf(actual) === type;
        }, "typeOf(\"" + type + "\")");
    };

    match.instanceOf = function (type) {
        assertType(type, "function", "type");
        return match(function (actual) {
            return actual instanceof type;
        }, "instanceOf(\"" + sinon.functionName(type) + "\")");
    };

    match.re = function (exp) {
        assertType(exp, "regexp", "expression");
        return match(function (actual) {
            if (typeof actual !== "string") {
              return false;
            }
            return exp.test(actual);
        }, "re(" + exp+ ")");
    };

    function like(expectation, actual) {
        if (sinon.typeOf(actual) !== "object") {
          return false;
        }
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                var exp = expectation[key];
                var act = actual[key];
                if (match.isMatcher(exp)) {
                    if (!exp.test(act)) {
                        return false;
                    }
                } else if (sinon.typeOf(exp) === "object") {
                    if (!like(exp, act)) {
                        return false;
                    }
                } else if (exp !== act) {
                    return false;
                }
            }
        }
        return true;
    }

    match.like = function (expectation) {
        assertType(expectation, "object", "expectation");
        var str = [];
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                str.push(key + ": " + expectation[key]);
            }
        }
        return match(function (actual) {
            return like(expectation, actual);
        }, "like(" + str.join(", ") + ")");
    };

    if (commonJSModule) {
        module.exports = match;
    } else {
        sinon.match = match;
    }
}(typeof sinon == "object" && sinon || null));
