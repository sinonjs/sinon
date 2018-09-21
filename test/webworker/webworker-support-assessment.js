"use strict";

var referee = require("@sinonjs/referee");
var assert = referee.assert;

if (typeof Worker !== "undefined") {
    describe("WebWorker support", function () {
        var sentMessage = "whatever";
        it("should not crash", function (done) {
            var worker = new Worker("/test/webworker/webworker-script.js");

            worker.onmessage = function (msg) {
                try { // eslint-disable-line no-restricted-syntax
                    assert.same(msg.data, "worker received:" + sentMessage);
                    done();
                } catch (err) {
                    done(err);
                }
            };

            /*
             * @param ev {ErrorEvent} an event containing information on the error happening in the worker
             * @see https://html.spec.whatwg.org/multipage/webappapis.html#errorevent
             */
            function onError(ev) {
                var error = ev.error;

                if (!error) {
                    var msg =
                        "An error happened at line " +
                        [ev.lineno, ev.colno].join(":") +
                        " in file " +
                        ev.filename +
                        ":  " +
                        ev.message;
                    error = new Error(msg);
                }
                done(error);
            }

            /* Will be triggered if a message cannot be serialized */
            function onMessageError(ev) {
                done(new TypeError("A messageerror happened: " + ev.data));
            }

            worker.addEventListener("error", onError, false);
            worker.addEventListener("messageerror", onMessageError, false);

            worker.postMessage(sentMessage);
        });
    });
}
