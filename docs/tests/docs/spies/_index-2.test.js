import t from "tap";
import sinon from "sinon";

t.test("spying on all object methods", (t) => {
  // External library example
  const myExternalLibrary = {
    getJSON(url) {
      return this._doNetworkCall({ url: url, dataType: "json" });
    },
    _doNetworkCall(httpParams) {
      return { result: 42 };
    }
  };

  const sandbox = sinon.createSandbox();
  sandbox.spy(myExternalLibrary);

  // Call the method
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  myExternalLibrary.getJSON(url);

  // Verify both methods were spied on and called
  t.ok(myExternalLibrary.getJSON.calledOnce, "getJSON should be called once");
  t.ok(
    myExternalLibrary._doNetworkCall.calledOnce,
    "_doNetworkCall should be called once"
  );
  t.equal(
    myExternalLibrary._doNetworkCall.getCall(0).args[0].url,
    url,
    "url should match"
  );
  t.equal(
    myExternalLibrary._doNetworkCall.getCall(0).args[0].dataType,
    "json",
    "dataType should be json"
  );

  sandbox.restore();
  t.end();
});
