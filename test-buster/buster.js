var config = module.exports;

// IMPORTANT: In this configuration we do not load the source files with the "sources" directive,
// as we need the AMD loader to load them, so we can verify that works
// They will be made available to RequireJS via the resources directive
config["AMD compatibility - source version"] = {
    environment: "browser",

    rootPath: "../",

    libs: [
        "node_modules/requirejs/require.js"
    ],

    resources: [
        "lib/**/*.js"
    ],

    tests: [
        "test-buster/**/*-test.js"
    ],

    extensions: [
        require("buster-amd")
    ]
};
