import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.func", (t) => {
  const fake = sinon.fake();

  fake(function () {});
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.func);
  }, "should accept function");

  fake(() => {});
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.func);
  }, "should accept arrow function");

  fake.resetHistory();

  fake({ call: () => {} });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.func),
    /expected fake to be called with match/,
    "should reject object"
  );

  fake.resetHistory();
  fake("function");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.func),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});
