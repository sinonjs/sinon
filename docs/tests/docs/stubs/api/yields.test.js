import tap from "tap";
import * as sinon from "sinon";

tap.test("stub.yields - basic usage without arguments", (t) => {
  let called = false;

  function bake() {
    called = true;
  }

  const bakeStub = sinon.stub().yields();
  bakeStub(bake);

  t.ok(called, "callback was called");

  t.end();
});

tap.test("stub.yields - with arguments", (t) => {
  let filling;

  function assemble(f) {
    filling = f;
  }

  const assembleStub = sinon.stub().yields("raspberry");
  assembleStub(assemble);

  t.equal(filling, "raspberry", "callback called with raspberry");

  t.end();
});
