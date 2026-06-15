import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.neverCalledWith - passes when not called with arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");

    t.doesNotThrow(() => {
      sinon.assert.neverCalledWith(fake, "banana");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.neverCalledWith - fails when called with arguments", (t) => {
  const fake = sinon.fake();
  fake("apple");

  t.throws(
    () => sinon.assert.neverCalledWith(fake, "apple"),
    /expected fake to never be called with arguments/,
    "assertion should fail when called with specified arguments"
  );

  t.end();
});
