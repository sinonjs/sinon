/*eslint-env worker*/
/*global sinon*/
"use strict";

// Abort if we are not running in a WebWorker
if (typeof importScripts !== "undefined") {
    importScripts("/pkg/sinon.js");

    var mySpy = sinon.spy(function(msg) {
        return "worker received:" + msg;
    });

    onmessage = function(e) {
        postMessage(mySpy(e.data));
    };
}
