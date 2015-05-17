var config = module.exports;

config.browser = {
    environment: "browser",
    rootPath: "../",
    libs: [
        "node_modules/lolex/lolex.js",
        "node_modules/samsam/lib/samsam.js",
        "node_modules/formatio/lib/formatio.js"
    ],
    sources: [
        "lib/sinon.js",
        "lib/sinon/util/core.js",
        "lib/sinon/typeOf.js",
        "lib/**/*.js"
    ],
    testHelpers: [
        "test/test-helper.js"
    ],
    tests: [
        "test/**/*-test.js"
    ]
};

config.coverage = {
    extends: "browser",
    "buster-istanbul": {
        outputDirectory: "coverage",
        format: "lcov",
        excludes: ["**/*.json"]
    },
    extensions: [
        require("buster-istanbul")
    ]
};

config.node = {
    environment: "node",
    rootPath: "../",
    sources: [
        "lib/sinon.js",
        "lib/**/*.js"
    ],
    tests: [
        "test/**/*.js"
    ]
};
