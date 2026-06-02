import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.number", (t) => {
  const fake = sinon.fake();

  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.number);
  }, "should accept number");

  fake(0);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.number);
  }, "should accept zero");

  fake(-123);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.number);
  }, "should accept negative number");

  fake.resetHistory();

  fake("42");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.number),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});
