import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.falsy", (t) => {
  const fake = sinon.fake();

  fake(false);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.falsy);
  }, "should accept false");

  fake(0);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.falsy);
  }, "should accept zero");

  fake("");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.falsy);
  }, "should accept empty string");

  fake(null);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.falsy);
  }, "should accept null");

  fake.resetHistory();

  fake(true);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.falsy),
    /expected fake to be called with match/,
    "should reject true"
  );

  fake.resetHistory();
  fake("hello");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.falsy),
    /expected fake to be called with match/,
    "should reject non-empty string"
  );

  t.end();
});
