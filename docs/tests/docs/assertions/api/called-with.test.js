import tap from "tap";
import * as sinon from "sinon";

tap.test(
  "assert.calledWith - passes when spy was called with arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple pie");

    t.doesNotThrow(() => {
      sinon.assert.calledWith(fake, "apple pie");
    }, "assertion should pass");

    t.end();
  }
);

tap.test("assert.calledWith - fails when spy was not called", (t) => {
  const fake = sinon.fake();

  t.throws(
    () => sinon.assert.calledWith(fake, "apple pie"),
    /expected fake to be called with arguments/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledWith - fails when spy was called with different arguments",
  (t) => {
    const fake = sinon.fake();
    fake("apple pie");

    t.throws(
      () => sinon.assert.calledWith(fake, "lemon meringue pie"),
      /expected fake to be called with arguments/,
      "assertion should fail with wrong arguments"
    );

    t.end();
  }
);

tap.test("assert.calledWith - works with spyCall", (t) => {
  const fake = sinon.fake();
  fake("apple pie");

  const call = fake.firstCall;

  t.doesNotThrow(() => {
    sinon.assert.calledWith(call, "apple pie");
  }, "assertion should work on spyCall");

  t.end();
});
