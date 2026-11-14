// Abort if we are not running in a WebWorker
if (typeof importScripts !== "undefined") {
    importScripts("/pkg/sinon.js");

    const sinon = globalThis.sinon;
    const mySpy = sinon.spy((msg) => `worker received:${msg}`);

    globalThis.onmessage = function (e) {
        postMessage(mySpy(e.data));
    };
}
