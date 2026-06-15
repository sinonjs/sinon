import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.resetBehavior", (t) => {
  const stub = sinon.stub();

  stub.returns(54);

  t.equal(stub(), 54, "stub returns 54");

  stub.resetBehavior();

  t.equal(typeof stub(), "undefined", "stub returns undefined after reset");

  t.end();
});
