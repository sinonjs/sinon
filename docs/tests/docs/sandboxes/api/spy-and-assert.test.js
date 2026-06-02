import tap from "tap";
import * as sinon from "sinon";

tap.test("sandbox.spy and sandbox.assert - basic usage", (t) => {
  // The sinon root object is a default sandbox
  const spy = sinon.spy();

  t.throws(
    () => sinon.assert.calledOnce(spy),
    /expected spy to be called once but was called 0 times/,
    "assert throws when spy not called"
  );

  spy();

  t.doesNotThrow(
    () => sinon.assert.calledOnce(spy),
    "assert does not throw after spy called once"
  );

  t.end();
});
