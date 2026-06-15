import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledOnce - passes when spy was called once", (t) => {
  const spy = sinon.spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledOnce(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledOnce - fails when spy was not called", (t) => {
  const spy = sinon.spy();

  t.throws(
    () => sinon.assert.calledOnce(spy),
    /expected spy to be called once but was called 0 times/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledOnce - fails when spy was called multiple times",
  (t) => {
    const spy = sinon.spy();
    spy();
    spy();

    t.throws(
      () => sinon.assert.calledOnce(spy),
      /expected spy to be called once but was called twice/,
      "assertion should fail when called twice"
    );

    t.end();
  }
);
