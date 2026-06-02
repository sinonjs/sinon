import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledWithNew - passes when spy was called with new", (t) => {
  const Ctor = sinon.fake();

  new Ctor();

  t.doesNotThrow(() => {
    sinon.assert.calledWithNew(Ctor);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledWithNew - fails when spy was not called", (t) => {
  const Ctor = sinon.fake();

  t.throws(
    () => sinon.assert.calledWithNew(Ctor),
    /expected fake to be called with new/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledWithNew - fails when spy was called without new",
  (t) => {
    const Ctor = sinon.fake();

    Ctor();

    t.throws(
      () => sinon.assert.calledWithNew(Ctor),
      /expected fake to be called with new/,
      "assertion should fail when called without new"
    );

    t.end();
  }
);
