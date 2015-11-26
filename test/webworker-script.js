/* eslint-env worker */
/* global sinon */
(function () {
    "use strict";

    // Abort if we are not running in a WebWorker
    if ( typeof importScripts === "undefined" ) { return; }

    importScripts("../pkg/sinon.js");

    var stub = sinon.stub().returns("worker response");

    onmessage = function () {
        postMessage( stub() );
    };

})();
