import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.neverCalledWithMatch - passes when not called with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Bob" });

    t.doesNotThrow(() => {
      sinon.assert.neverCalledWithMatch(fake, { name: "Alice" });
    }, "assertion should pass");

    t.end();
  }
);

tap.test(
  "assert.neverCalledWithMatch - passes with matcher that doesn't match",
  (t) => {
    const fake = sinon.fake();
    fake(123);

    t.doesNotThrow(() => {
      sinon.assert.neverCalledWithMatch(fake, sinon.match.string);
    }, "assertion should pass when matcher doesn't match");

    t.end();
  }
);

tap.test(
  "assert.neverCalledWithMatch - fails when called with matching arguments",
  (t) => {
    const fake = sinon.fake();
    fake({ name: "Alice", age: 30 });

    t.throws(
      () => sinon.assert.neverCalledWithMatch(fake, { name: "Alice" }),
      /expected fake to never be called with match/,
      "assertion should fail when called with matching arguments"
    );

    t.end();
  }
);
