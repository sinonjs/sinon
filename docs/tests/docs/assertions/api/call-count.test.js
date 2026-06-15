import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.callCount - passes when spy was called exact number of times",
  (t) => {
    const spy = sinon.spy();
    spy();

    t.doesNotThrow(() => {
      sinon.assert.callCount(spy, 1);
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.callCount - fails when spy was not called", (t) => {
  const spy = sinon.spy();

  t.throws(
    () => sinon.assert.callCount(spy, 1),
    /expected spy to be called once but was called 0 times/,
    "assertion should fail with descriptive message"
  );

  t.end();
});

tap.test(
  "assert.callCount - fails when spy was called wrong number of times",
  (t) => {
    const spy = sinon.spy();
    spy();
    spy();
    spy();

    t.throws(
      () => sinon.assert.callCount(spy, 5),
      /expected spy to be called 5 times but was called thrice/,
      "assertion should fail with descriptive message"
    );

    t.end();
  }
);
