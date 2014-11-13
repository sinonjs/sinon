"use strict";
var test = require("./test");

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
    /*jsl:ignore*/
    if (!tests || typeof tests != "object") {
        throw new TypeError("sinon.testCase needs an object with test functions");
    }
    /*jsl:end*/

    prefix = prefix || "test";
    var rPrefix = new RegExp("^" + prefix);
    var methods = {}, testName, property, method;
    var setUp = tests.setUp;
    var tearDown = tests.tearDown;

    for (testName in tests) {
        if (tests.hasOwnProperty(testName)) {
            property = tests[testName];

            if (/^(setUp|tearDown)$/.test(testName)) {
                continue;
            }

            if (typeof property == "function" && rPrefix.test(testName)) {
                method = property;

                if (setUp || tearDown) {
                    method = createTest(property, setUp, tearDown);
                }

                methods[testName] = test(method);
            } else {
                methods[testName] = tests[testName];
            }
        }
    }

    return methods;
}

module.exports = testCase;
