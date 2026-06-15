import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.returns", (t) => {
  const stub = sinon.stub();

  t.equal(stub(), undefined, "stub returns undefined by default");

  stub.returns("Apple pie");

  t.equal(stub(), "Apple pie", "stub returns the provided value");

  t.end();
});
