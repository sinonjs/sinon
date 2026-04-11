// Abort if we are not running in a WebWorker
if (typeof importScripts !== "undefined") {
    importScripts("/pkg/sinon.js");

    const sinon = globalThis.sinon;
    const mySpy = sinon.spy(function (msg) {
        return `worker received:${msg}`;
    });

    self.onmessage = function (e) {
        postMessage(mySpy(e.data));
    };
}
