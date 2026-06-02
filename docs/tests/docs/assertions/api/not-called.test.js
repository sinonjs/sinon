import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.notCalled - passes when spy was not called", (t) => {
  const spy = sinon.spy();

  t.doesNotThrow(() => {
    sinon.assert.notCalled(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.notCalled - fails when spy was called", (t) => {
  const spy = sinon.spy();
  spy();

  t.throws(
    () => sinon.assert.notCalled(spy),
    /expected spy to not have been called but was called once/,
    "assertion should fail with descriptive message"
  );

  t.end();
});
