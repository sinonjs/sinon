require("../sinon_test.js");
require("../sinon/extend_test.js");
require("../sinon/spy_test.js");
require("../sinon/call_test.js");
require("../sinon/stub_test.js");
require("../sinon/mock_test.js");
require("../sinon/collection_test.js");
require("../sinon/sandbox_test.js");
require("../sinon/assert_test.js");
require("../sinon/test_test.js");
require("../sinon/test_case_test.js");
require("../sinon/match_test.js");
require("../sinon/format_test.js");
require("../sinon/times_in_words_test.js");
require("../sinon/typeOf_test.js");
require("../sinon/log_error_test.js");
require("../sinon/issues/issues.js");
require("../sinon/util/fake_timers_test.js");

var buster = require("../runner");
var args = process.argv.slice(2);

while (args.length) {
    switch (args.shift()) {
        case "-h":
        case "--help":
            console.log("Usage: node test/node/run.js [-u]");
            console.log("  -u, --unstable  Enable unstable tests");
            console.log("  -h, --help      This cruft");
            process.exit(1);
            break;
        case "-u":
        case "--unstable":
            break;
    }
}

buster.testRunner.onCreate(function (runner) {
    runner.on("suite:end", function (results) {
        // Reporter will be set up after delay, allow
        // it to finish before we exit the process
        process.nextTick(function () {
            process.exit(results.ok ? 0 : 1);
        });
    });
});
