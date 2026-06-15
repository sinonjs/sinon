import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.alwaysCalledWithExactly - passes when all calls have exact arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");
    fake("apple", "pie");

    t.doesNotThrow(() => {
      sinon.assert.alwaysCalledWithExactly(fake, "apple", "pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test(
  "assert.alwaysCalledWithExactly - fails when one call has different arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple", "pie");
    fake("apple", "tart");

    t.throws(
      () => sinon.assert.alwaysCalledWithExactly(fake, "apple", "pie"),
      /expected fake to always be called with exact arguments/,
      "assertion should fail with different arguments"
    );

    t.end();
  }
);
