import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.reset", (t) => {
  const stub = sinon.stub();

  t.equal(stub(), undefined, "stub returns undefined initially");

  stub.returns("Apple pie");

  t.equal(stub(), "Apple pie", "stub returns Apple pie after configuration");

  stub.reset();

  t.equal(stub(), undefined, "stub returns undefined after reset");

  t.end();
});
