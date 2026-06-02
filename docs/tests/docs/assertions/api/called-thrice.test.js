import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledThrice - passes when spy was called thrice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledThrice(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledThrice - fails when spy was called twice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();

  t.throws(
    () => sinon.assert.calledThrice(spy),
    /expected spy to be called thrice but was called twice/,
    "assertion should fail with descriptive message"
  );

  t.end();
});
