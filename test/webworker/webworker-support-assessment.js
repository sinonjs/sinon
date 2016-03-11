"use strict";

var referee = require("referee");
var assert = referee.assert;


if (typeof Worker !== "undefined") {

    describe("WebWorker support", function () {
        it("should not crash", function (done) {
            var worker = new Worker("file://" + __dirname + "/webworker-script.js");

            worker.onmessage = function (msg) {
                try {
                    assert.same(msg.data, "worker response");
                    done();
                } catch (err) {
                    done(err);
                }
            };

            function onError(err) {
                done(new Error(err.message || "unknown error"));
            }

            worker.addEventListener("error", onError, false);

            worker.postMessage("whatever");
        });
    });
}
