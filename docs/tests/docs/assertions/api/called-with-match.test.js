import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledWithMatch - passes when spy was called with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice", age: 30 });

    t.doesNotThrow(() => {
      sinon.assert.calledWithMatch(fake, { name: "Alice" });
    }, "assertion should pass with partial match");

    t.end();
  }
);

tap.test("assert.calledWithMatch - passes with matcher", (t) => {
  const fake = sinon.fake();
  fake("apple pie");

  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.string);
  }, "assertion should pass with matcher");

  t.end();
});

tap.test("assert.calledWithMatch - fails when spy was not called", (t) => {
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.string),
    /expected fake to be called with match/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test("assert.calledWithMatch - fails when arguments don't match", (t) => {
  const fake = sinon.fake();
  fake({ name: "Bob" });

  t.throws(
    () => sinon.assert.calledWithMatch(fake, { name: "Alice" }),
    /expected fake to be called with match/,
    "assertion should fail with non-matching arguments"
  );

  t.end();
});
