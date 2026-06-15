import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox - using a custom sandbox", (t) => {
  const sandbox = sinon.createSandbox();
  const myObject = {
    hello: "world"
  };

  // using the stub method on the sandbox
  sandbox.stub(myObject, "hello").value("Banana");

  t.equal(myObject.hello, "Banana", "property stubbed to Banana");

  sandbox.restore();
  t.equal(myObject.hello, "world", "property restored to world");

  t.end();
});
