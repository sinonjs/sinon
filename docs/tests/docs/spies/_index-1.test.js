import t from "tap";
import sinon from "sinon";

t.test("anonymous spy records calls and can be asserted", (t) => {
  const spy = sinon.spy();

  // Verify that sinon.assert throws when spy hasn't been called
  t.throws(
    () => sinon.assert.calledOnce(spy),
    /expected spy to be called once but was called 0 times/i,
    "should throw when spy not called"
  );

  // Call the spy
  spy();

  // Now the assertion passes
  t.doesNotThrow(
    () => sinon.assert.calledOnce(spy),
    "should not throw when spy called once"
  );

  t.end();
});
