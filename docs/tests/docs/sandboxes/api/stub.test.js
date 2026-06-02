import t from "tap";
import sinon from "sinon";

t.test("sandbox.stub can stub non-function properties", (t) => {
  const sandbox = sinon.createSandbox();

  const myObject = {
    hello: "world"
  };

  // Stub the property
  sandbox.stub(myObject, "hello").value("Sinon");

  // Verify the stub works
  t.equal(myObject.hello, "Sinon", "property should be stubbed to 'Sinon'");

  // Restore via sandbox
  sandbox.restore();

  // Verify restoration
  t.equal(myObject.hello, "world", "property should be restored to 'world'");

  t.end();
});
