var config = module.exports;

config["My tests"] = {
    environment: "node",  // or "node"
    rootPath: "../",
    sources: [
        "pkg/simon.js",      // Paths are relative to config file
        "lib/**/*.js",        // Glob patterns supported
        "!lib/**/*_ie.js"
    ],
    tests: [
        "test-buster/**/*-test.js"
    ]
};
