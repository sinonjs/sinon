/* @depend ../sinon.js */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Match functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
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

    function Matcher(test, msg) {
        if (typeof test !== "function") {
            throw new TypeError();
        }
        this.test = test;
        this.msg = msg;
    }
    Matcher.prototype.toString = function () {
        return this.msg;
    };

    var match = function (test) {
        return new Matcher(test);
    };

    match.any = function () {
        return new Matcher(function () {
            return true;
        }, "any()");
    };

    match.same = function (expectation) {
        return new Matcher(function (actual) {
            return expectation === actual;
        }, "same(" + expectation + ")");
    };

    match.typeOf = function (type) {
        if (typeof type !== "string") {
            throw new TypeError("String expected");
        }
        return new Matcher(function (actual) {
            return sinon.typeOf(actual) === type;
        }, "typeOf(\"" + type + "\")");
    };

    match.instanceOf = function (type) {
        if (typeof type !== "function") {
            throw new TypeError("Function expected");
        }
        return new Matcher(function (actual) {
            return actual instanceof type;
        }, "instanceOf(\"" + sinon.functionName(type) + "\")");
    };

    match.re = function (exp) {
        if (sinon.typeOf(exp) !== "regexp") {
          throw new TypeError("Regular expression expected");
        }
        return new Matcher(function (actual) {
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
                if (exp instanceof Matcher) {
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
        if (sinon.typeOf(expectation) !== "object") {
            throw new TypeError("Object expected");
        }
        var str = [];
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                str.push(key + ": " + expectation[key]);
            }
        }
        return new Matcher(function (actual) {
            return like(expectation, actual);
        }, "like(" + str.join(", ") + ")");
    };

    match.Matcher = Matcher;

    if (commonJSModule) {
        module.exports = match;
    } else {
        sinon.match = match;
    }
}(typeof sinon == "object" && sinon || null));
