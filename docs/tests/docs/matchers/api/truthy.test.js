import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.truthy", (t) => {
  const fake = sinon.fake();

  fake(true);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.truthy);
  }, "should accept true");

  fake("hello");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.truthy);
  }, "should accept non-empty string");

  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.truthy);
  }, "should accept non-zero number");

  fake.resetHistory();

  fake(false);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.truthy),
    /expected fake to be called with match/,
    "should reject false"
  );

  fake.resetHistory();
  fake(0);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.truthy),
    /expected fake to be called with match/,
    "should reject zero"
  );

  fake.resetHistory();
  fake("");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.truthy),
    /expected fake to be called with match/,
    "should reject empty string"
  );

  t.end();
});
