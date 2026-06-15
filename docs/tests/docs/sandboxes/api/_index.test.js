import t from "tap";
import sinon from "sinon";

t.test("default sandbox can stub and restore properties", (t) => {
  const myObject = {
    hello: "world"
  };

  // Stub the property
  sinon.stub(myObject, "hello").value("Sinon");

  // Verify the stub works
  t.equal(myObject.hello, "Sinon", "property should be stubbed to 'Sinon'");

  // Restore
  sinon.restore();

  // Verify restoration
  t.equal(myObject.hello, "world", "property should be restored to 'world'");

  t.end();
});
