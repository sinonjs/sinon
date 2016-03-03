"use strict";

var config = module.exports;

// The sole purpose of this test setup is to
// ensure that Sinon could be run inside of
// a WebWorker
config.webworkerSupport = {
    environment: "browser",
    rootPath: "../",
    sources: [
        "pkg/sinon.js",
        "test/webworker/webworker-script.js"
    ],
    testHelpers: [
        "test/test-helper.js"
    ],
    tests: [
        "test/webworker/webworker-support-assessment.js"
    ]
};
