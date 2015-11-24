(function (root) {
    "use strict";
    var supportsWorkers = typeof root.Worker !== "undefined";
    var buster = root.buster || require("buster");
    var assert = buster.assert;

    buster.testCase("WebWorker support", {

        requiresSupportFor: {
            WebWorker: supportsWorkers
        },

        "should not crash": function (done) {
            var worker = new root.Worker("./test/webworker-script.js");

            worker.onmessage = function (msg) {
                try {
                    assert.same(msg.data, "worker response");
                    done();
                }catch (err) { done(err); }
            };

            function onError(err) {
                done(new Error(err.message));
            }

            worker.addEventListener("error", onError, false);

            worker.postMessage("whatever");
        }
    });

})(this);
