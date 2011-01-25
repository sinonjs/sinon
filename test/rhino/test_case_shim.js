/*jslint onevar: false, eqeqeq: false*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Christian Johansen
 */
"use strict";

function testCase(name, tests) {
    var setUp = tests.setUp;
    var tearDown = tests.tearDown;
    var error;

    print("Running " + name);

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

                if (typeof tearDown == "function") {
                    try {
                        tearDown.call(tests);
                    } catch (err) {
                        error = err;
                    }
                }

                print("Fail: " + prop + " - " + error.message);
            }

            if (!error) {
                print("OK: " + prop);
            }
        }
    }
}
