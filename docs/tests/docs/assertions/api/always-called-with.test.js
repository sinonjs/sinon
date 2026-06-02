import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledWith - passes when all calls have arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");
    fake("apple", "pie");
    fake("apple", "pie", "ice cream");

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledWith(fake, "apple");
    }, "assertion should pass when all calls include argument");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledWith - fails when one call lacks arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple");
    fake("banana");

    t.throws(
      () => sinon.assert.alwaysCalledWith(fake, "apple"),
      /expected fake to always be called with arguments/,
      "assertion should fail when not all calls include argument"
    );

    t.end();
  }
);
