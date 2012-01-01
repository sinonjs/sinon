/*jslint onevar: false, eqeqeq: false*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Christian Johansen
 */
if (typeof print != "function") {
    var print = console.log;
}

if (typeof require == "function") {
    require("./Asserts");
}

var testCase = (function () {
    var silent = typeof process == "object" && process.env.SILENT || false;

    function green(str) {
        return "\033[1m\033[32m" + str + "\033[0m";
    }

    function red(str) {
        return "\033[1m\033[31m" + str + "\033[0m";
    }

    function printError(testCase, test, error) {
        print(red(testCase + " " + test));
        print(red(error.stack));
    }

    return function testCase(name, tests) {
        var setUp = tests.setUp;
        var tearDown = tests.tearDown;
        var error, errorCount = 0;
        var namePrinted = false;

        for (var prop in tests) {
            if (tests.hasOwnProperty(prop)) {
                if (prop == "setUp" || prop == "tearDown") {
                    continue;
                }

                error = null;

                try {
                    if (typeof setUp == "function") {
                        setUp.call(tests);
                    }

                    tests[prop]();
                } catch (e) {
                    error = e;
                }

                if (typeof tearDown == "function") {
                    try {
                        tearDown.call(tests);
                    } catch (err) {
                        error = err;
                    }
                }

                if (error) {
                    errorCount += 1;
                    printError(name, prop, error);
                }
            }
        }

        if (errorCount == 0 && !silent) {
            print(green("OK: " + name));
        }
    }
}());

if (typeof module == "object") {
    module.exports = testCase;
}
