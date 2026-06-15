import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOn - passes when spy was called with correct this context",
  (t) => {
    const obj = { name: "test object" };
    const fake = sinon.fake();

    fake.call(obj);

    t.doesNotThrow(() => {
      sinon.assert.calledOn(fake, obj);
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOn - fails when spy was not called", (t) => {
  const obj = { name: "test object" };
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledOn(fake, obj),
    /expected fake to be called with/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledOn - fails when spy was called with different this context",
  (t) => {
    const obj1 = { name: "obj1" };
    const obj2 = { name: "obj2" };
    const fake = sinon.fake();

    fake.call(obj1);

    t.throws(
      () => sinon.assert.calledOn(fake, obj2),
      /expected fake to be called with/,
      "assertion should fail with wrong this context"
    );

    t.end();
  }
);
