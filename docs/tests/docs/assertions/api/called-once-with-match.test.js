import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOnceWithMatch - passes when called once with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice", age: 30 });

    t.doesNotThrow(() => {
      sinon.assert.calledOnceWithMatch(fake, { name: "Alice" });
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOnceWithMatch - fails when called twice", (t) => {
  const fake = sinon.fake();
  fake({ name: "Alice" });
  fake({ name: "Alice" });

  t.throws(
    () => sinon.assert.calledOnceWithMatch(fake, { name: "Alice" }),
    /expected fake to be called once/,
    "assertion should fail when called more than once"
  );

  t.end();
});

tap.test(
  "assert.calledOnceWithMatch - fails with non-matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Bob" });

    t.throws(
      () => sinon.assert.calledOnceWithMatch(fake, { name: "Alice" }),
      /expected fake to be called once/,
      "assertion should fail with non-matching arguments"
    );

    t.end();
  }
);
