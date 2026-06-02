import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledOnceWithExactly - passes when called once with exact arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");

    t.doesNotThrow(() => {
      sinon.assert.calledOnceWithExactly(fake, "apple", "pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledOnceWithExactly - fails when called twice", (t) => {
  const fake = sinon.fake();
  fake("apple", "pie");
  fake("apple", "pie");

  t.throws(
    () => sinon.assert.calledOnceWithExactly(fake, "apple", "pie"),
    /expected fake to be called once/,
    "assertion should fail when called more than once"
  );

  t.end();
});

tap.test("assert.calledOnceWithExactly - fails with wrong arguments", (t) => {
  const fake = sinon.fake();
  fake("apple");

  t.throws(
    () => sinon.assert.calledOnceWithExactly(fake, "apple", "pie"),
    /expected fake to be called once/,
    "assertion should fail with wrong arguments"
  );

  t.end();
});
