var config = module.exports;

config.packaged = {
    environment: "browser",
    rootPath: "../",
    libs: [
        "node_modules/samsam/lib/samsam.js"
    ],
    sources: [
        "pkg/sinon.js"
    ],
    testHelpers: [
        "test/test-helper.js"
    ],
    tests: [
        "test/**/*-test.js"
    ]
};

// The sole purpose of this test setup is to
// ensure that Sinon could be run inside of
// a WebWorker
config.webworkerSupport = {
    environment: "browser",
    rootPath: "../",
    sources: [
        "pkg/sinon.js",
        "test/webworker-script.js"
    ],
    tests: [
        "test/webworker-support-assessment.js"
    ]
};
