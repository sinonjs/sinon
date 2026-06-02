import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.threw - passes when spy threw", (t) => {
  const fake = sinon.fake.throws(new Error("boom"));

  try {
    fake();
  } catch (e) {}

  t.doesNotThrow(() => {
    sinon.assert.threw(fake);
  }, "assertion should pass when spy threw");

  t.end();
});

tap.test("assert.threw - passes when spy threw specific exception", (t) => {
  const error = new TypeError("type error");
  const fake = sinon.fake.throws(error);

  try {
    fake();
  } catch (e) {}

  t.doesNotThrow(() => {
    sinon.assert.threw(fake, "TypeError");
  }, "assertion should pass with exception type");

  t.end();
});

tap.test("assert.threw - fails when spy didn't throw", (t) => {
  const fake = sinon.fake();

  fake();

  t.throws(
    () => sinon.assert.threw(fake),
    /fake did not throw exception/,
    "assertion should fail when spy didn't throw"
  );

  t.end();
});
