/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

require("./test");
var sinon = require("./util/core");

function createTest(property, setUp, tearDown) {
    return function () {
        if (setUp) {
            setUp.apply(this, arguments);
        }

        var exception, result;

        try {
            result = property.apply(this, arguments);
        } catch (e) {
            exception = e;
        }

        if (tearDown) {
            tearDown.apply(this, arguments);
        }

        if (exception) {
            throw exception;
        }

        return result;
    };
}

function testCase(tests, prefix) {
    if (!tests || typeof tests !== "object") {
        throw new TypeError("sinon.testCase needs an object with test functions");
    }

    prefix = prefix || "test";
    var rPrefix = new RegExp("^" + prefix);
    var methods = {};
    var setUp = tests.setUp;
    var tearDown = tests.tearDown;
    var testName,
        property,
        method;

    for (testName in tests) {
        if (tests.hasOwnProperty(testName) && !/^(setUp|tearDown)$/.test(testName)) {
            property = tests[testName];

            if (typeof property === "function" && rPrefix.test(testName)) {
                method = property;

                if (setUp || tearDown) {
                    method = createTest(property, setUp, tearDown);
                }

                methods[testName] = sinon.test(method);
            } else {
                methods[testName] = tests[testName];
            }
        }
    }

    return methods;
}

sinon.testCase = testCase;
