require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;

// This is just an example of an external library you might require()
const myExternalLibrary = {
    getJSON(url) {
        return this._doNetworkCall({ url: url, dataType: "json" });
    },
    _doNetworkCall(httpParams) {
        console.log("Simulating fetching stuff from the network: ", httpParams);
        return { result: 42 };
    },
};

describe("Wrap all object methods", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        sandbox.spy(myExternalLibrary);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("should inspect the external lib's usage of its internal methods", function () {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        myExternalLibrary.getJSON(url);

        assert(myExternalLibrary.getJSON.calledOnce);
        assert(myExternalLibrary._doNetworkCall.calledOnce);
        assert.equals(
            url,
            myExternalLibrary._doNetworkCall.getCall(0).args[0].url
        );
        assert.equals(
            "json",
            myExternalLibrary._doNetworkCall.getCall(0).args[0].dataType
        );
    });
});
