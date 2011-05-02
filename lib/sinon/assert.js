/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var slice = Array.prototype.slice;
    var assert;

    if (!sinon && commonJSModule) {
        sinon = require("sinon");
    }

    if (!sinon) {
        return;
    }

    function times(count) {
        return count == 1 && "once" ||
            count == 2 && "twice" ||
            count == 3 && "thrice" ||
            (count || 0) + " times";
    }

    function verifyIsStub(method) {
        if (!method) {
            assert.fail("fake is not a spy");
        }

        if (typeof method != "function") {
            assert.fail(method + " is not a function");
        }

        if (typeof method.getCall != "function") {
            assert.fail(method + " is not stubbed");
        }
    }

    function failAssertion(object, msg) {
        var failMethod = object.fail || assert.fail;
        failMethod.call(object, msg);
    }

    function mirrorAssertion(method, message) {
        assert[method] = function (fake) {
            verifyIsStub(fake);

            var failed = typeof fake[method] == "function" ?
                !fake[method].apply(fake, slice.call(arguments, 1)) : !fake[method];

            if (failed) {
                var msg = message.replace("%c", times(fake.callCount));
                msg = msg.replace("%n", fake + "");

                msg = msg.replace("%C", function (m) {
                    return formatSpyCalls(fake);
                });

                msg = msg.replace("%t", function (m) {
                    return formatThisValues(fake);
                });

                msg = msg.replace("%*", [].slice.call(arguments, 1).join(", "));

                for (var i = 0, l = arguments.length; i < l; i++) {
                    msg = msg.replace("%" + i, arguments[i]);
                }

                failAssertion(this, msg);
            } else {
                assert.pass(method);
            }
        };
    }

    function formatSpyCalls(spy) {
        var calls = [];

        for (var i = 0, l = spy.callCount; i < l; ++i) {
            calls.push("    " + spy.getCall(i).toString());
        }

        return calls.length > 0 ? "\n" + calls.join("\n") : "";
    }

    function formatThisValues(spy) {
        var objects = [];

        for (var i = 0, l = spy.callCount; i < l; ++i) {
            objects.push(sinon.format(spy.thisValues[i]));
        }

        return objects.join(", ");
    }

    assert = {
        failException: "AssertError",

        fail: function fail(message) {
            var error = new Error(message);
            error.name = this.failException || assert.failException;

            throw error;
        },

        pass: function pass(assertion) {},

        called: function assertCalled(method) {
            verifyIsStub(method);

            if (!method.called) {
                failAssertion(this, "expected " + method +
                              " to have been called at least once but was never called");
            } else {
                assert.pass("called");
            }
        },

        notCalled: function assertNotCalled(method) {
            verifyIsStub(method);

            if (method.called) {
                failAssertion(
                    this, "expected " + method + " to not have been called but was " +
                        "called " + times(method.callCount) + formatSpyCalls(method));
            } else {
                assert.pass("notCalled");
            }
        },

        callOrder: function assertCallOrder() {
            verifyIsStub(arguments[0]);
            var expected = [];
            var actual = [];
            var failed = false;
            expected.push(arguments[0]);

            for (var i = 1, l = arguments.length; i < l; i++) {
                verifyIsStub(arguments[i]);
                expected.push(arguments[i]);

                if (!arguments[i - 1].calledBefore(arguments[i])) {
                    failed = true;
                }
            }

            if (failed) {
                actual = [].concat(expected).sort(function (a, b) {
                    var aId = a.getCall(0).callId;
                    var bId = b.getCall(0).callId;

                    // uuid, won't ever be equal
                    return aId < bId ? -1 : 1;
                });

                var expectedStr, actualStr;

                try {
                    expectedStr = expected.join(", ");
                    actualStr = actual.join(", ");
                } catch (e) {}

                failAssertion(this, "expected " + (expectedStr || "") + " to be " +
                              "called in order but were called as " + actualStr);
            } else {
                assert.pass("callOrder");
            }
        },

        callCount: function assertCallCount(method, count) {
            verifyIsStub(method);

            if (method.callCount != count) {
                failAssertion(this, "expected " + method + " to be called " +
                              times(count) + " but was called " +
                              times(method.callCount) + formatSpyCalls(method));
            } else {
                assert.pass("callCount");
            }
        },

        expose: function expose(target, options) {
            if (!target) {
                throw new TypeError("target is null or undefined");
            }

            options = options || {};
            var prefix = typeof options.prefix == "undefined" && "assert" || options.prefix;

            var name = function (prop) {
                if (!prefix) {
                    return prop;
                }

                return prefix + prop.substring(0, 1).toUpperCase() + prop.substring(1);
            };

            for (var assertion in this) {
                if (!/^(fail|expose)/.test(assertion)) {
                    target[name(assertion)] = this[assertion];
                }
            }

            if (typeof options.includeFail == "undefined" || !!options.includeFail) {
                target.fail = this.fail;
                target.failException = this.failException;
            }

            return target;
        }
    };

    mirrorAssertion("calledOnce", "expected %n to be called once but was called %c%C");
    mirrorAssertion("calledTwice", "expected %n to be called twice but was called %c%C");
    mirrorAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");
    mirrorAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");
    mirrorAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
    mirrorAssertion("calledWith", "expected %n to be called with arguments %*%C");
    mirrorAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");
    mirrorAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");
    mirrorAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C");
    mirrorAssertion("threw", "%n did not throw exception%C");
    mirrorAssertion("alwaysThrew", "%n did not always throw exception%C");

    if (commonJSModule) {
        module.exports = assert;
    } else {
        sinon.assert = assert;
    }
}(typeof sinon == "object" && sinon || null));
