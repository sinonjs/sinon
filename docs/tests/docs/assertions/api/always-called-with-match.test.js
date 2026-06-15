import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.alwaysCalledWithMatch - passes when all calls match", (t) => {
  const fake = sinon.fake();
  fake({ name: "Alice", age: 30 });
  fake({ name: "Bob", age: 40 });

  t.doesNotThrow(() => {
    sinon.assert.alwaysCalledWithMatch(fake, { age: sinon.match.number });
  }, "assertion should pass when all calls match");

  t.end();
});

tap.test(
  "assert.alwaysCalledWithMatch - fails when one call doesn't match",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice" });
    fake({ name: "Bob", age: 40 });

    t.throws(
      () =>
        sinon.assert.alwaysCalledWithMatch(fake, { age: sinon.match.number }),
      /expected fake to always be called with match/,
      "assertion should fail when not all calls match"
    );

    t.end();
  }
);
