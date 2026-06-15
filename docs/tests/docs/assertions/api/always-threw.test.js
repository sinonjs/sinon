import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.alwaysThrew - passes when all calls threw", (t) => {
  const fake = sinon.fake.throws(new Error("boom"));

  try {
    fake();
  } catch (e) {}
  try {
    fake();
  } catch (e) {}

  t.doesNotThrow(() => {
    sinon.assert.alwaysThrew(fake);
  }, "assertion should pass when all calls threw");

  t.end();
});

tap.test("assert.alwaysThrew - fails when one call didn't throw", (t) => {
  const fake = sinon.fake();

  fake();

  t.throws(
    () => sinon.assert.alwaysThrew(fake),
    /fake did not always throw exception/,
    "assertion should fail when not all calls threw"
  );

  t.end();
});
