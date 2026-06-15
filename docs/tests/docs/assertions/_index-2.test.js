import t from "tap";
import sinon from "sinon";

t.test("with sinon.assert, failures provide detailed error messages", (t) => {
  const msg = "Apple Pie";
  const f = sinon.fake();

  // Verify that sinon.assert throws when expectation is not met
  t.throws(
    () => sinon.assert.calledOnce(f),
    /expected fake to be called once but was called 0 times/i,
    "should throw with detailed message when fake not called"
  );

  // Call the fake
  f(msg);

  // No error should be thrown when assertions pass
  t.doesNotThrow(
    () => sinon.assert.calledOnce(f),
    "should not throw when fake called once"
  );

  t.doesNotThrow(
    () => sinon.assert.calledWith(f, msg),
    "should not throw when fake called with correct argument"
  );

  t.end();
});
