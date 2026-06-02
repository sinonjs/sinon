import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledTwice - passes when spy was called twice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledTwice(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledTwice - fails when spy was called once", (t) => {
  const spy = sinon.spy();
  spy();

  t.throws(
    () => sinon.assert.calledTwice(spy),
    /expected spy to be called twice but was called once/,
    "assertion should fail with descriptive message"
  );

  t.end();
});
