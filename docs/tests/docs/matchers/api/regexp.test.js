import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.regexp", (t) => {
  const fake = sinon.fake();

  fake(/test/);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.regexp);
  }, "should accept RegExp");

  fake(/test/gi);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.regexp);
  }, "should accept RegExp with flags");

  fake.resetHistory();

  fake("/test/");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.regexp),
    /expected fake to be called with match/,
    "should reject string"
  );

  fake.resetHistory();
  fake({ pattern: "test" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.regexp),
    /expected fake to be called with match/,
    "should reject object"
  );

  t.end();
});
