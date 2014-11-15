/**
 * More or less copy-pasted from the 'buster' package. The buster
 * "all inclusive" package includes Sinon, which is why we avoid it.
 */
(function (global, buster, referee, formatio, stackFilter) {
    if (typeof require == "function" && typeof module == "object") {
        buster = require("buster-test");
        formatio = require("formatio");
        referee = require("referee");
        stackFilter = require("stack-filter");
        buster.assertions = referee;
        module.exports = buster;
    }

    var logFormatter = formatio.configure({quoteStrings: false});
    var asciiFormat = logFormatter.ascii.bind(logFormatter);

    referee.format = asciiFormat;
    global.assert = referee.assert;
    global.refute = referee.refute;

    buster.testRunner.onCreate(function (runner) {
        referee.bind(runner, { failure: "assertionFailure" });

        referee.on("pass", function () {
            runner.assertionPass();
        });

        runner.on("test:async", function () {
            referee.throwOnFailure = false;
        });

        runner.on("test:setUp", function () {
            referee.throwOnFailure = true;
        });
    });

    var runner = buster.autoRun({
        cwd: typeof process != "undefined" ? process.cwd() : null,
        stackFilter: stackFilter.configure({
            filters: ["buster-test", "referee"],
            cwd: typeof process !== "undefined" && process.cwd()
        })
    });

    buster.testContext.on("create", runner);

    referee.add("spy", {
        assert: function (obj) {
            return obj !== null && typeof obj.calledWith === "function" && !obj.returns;
        },
        assertMessage: "Expected object ${0} to be a spy function"
    });

    referee.add("stub", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.calledWith === "function" &&
                typeof obj.returns === "function";
        },
        assertMessage: "Expected object ${0} to be a stub function"
    });

    referee.add("mock", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.verify === "function" &&
                typeof obj.expects === "function";
        },
        assertMessage: "Expected object ${0} to be a mock"
    });

    referee.add("fakeServer", {
        assert: function (obj) {
            return obj !== null &&
                Object.prototype.toString.call(obj.requests) == "[object Array]" &&
                typeof obj.respondWith === "function";
        },
        assertMessage: "Expected object ${0} to be a fake server"
    });

    referee.add("clock", {
        assert: function (obj) {
            return obj !== null &&
                typeof obj.tick === "function" &&
                typeof obj.setTimeout === "function";
        },
        assertMessage: "Expected object ${0} to be a clock"
    });
}(typeof global !== "undefined" ? global : this,
  typeof buster !== "undefined" ? buster : null,
  typeof referee !== "undefined" ? referee : null,
  typeof formatio !== "undefined" ? formatio : null,
  typeof stackFilter !== "undefined" ? stackFilter : null));
