import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.called - passes when spy was called", (t) => {
  const spy = sinon.spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.called(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.called - fails when spy was not called", (t) => {
  const spy = sinon.spy();

  t.throws(
    () => sinon.assert.called(spy),
    /expected spy to have been called at least once but was never called/,
    "assertion should fail with descriptive message"
  );

  t.end();
});
