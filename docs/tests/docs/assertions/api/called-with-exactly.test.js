import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledWithExactly - passes with exact arguments", (t) => {
  const fake = sinon.fake();
  fake("apple", "pie");

  t.doesNotThrow(() => {
    sinon.assert.calledWithExactly(fake, "apple", "pie");
  }, "assertion should pass with exact arguments");

  t.end();
});

tap.test("assert.calledWithExactly - fails with extra arguments", (t) => {
  const fake = sinon.fake();
  fake("apple", "pie", "ice cream");

  t.throws(
    () => sinon.assert.calledWithExactly(fake, "apple", "pie"),
    /expected fake to be called with exact arguments/,
    "assertion should fail when extra arguments present"
  );

  t.end();
});

tap.test("assert.calledWithExactly - fails with missing arguments", (t) => {
  const fake = sinon.fake();
  fake("apple");

  t.throws(
    () => sinon.assert.calledWithExactly(fake, "apple", "pie"),
    /expected fake to be called with exact arguments/,
    "assertion should fail when arguments missing"
  );

  t.end();
});
