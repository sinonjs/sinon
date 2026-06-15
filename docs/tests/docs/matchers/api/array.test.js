import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.array", (t) => {
  const fake = sinon.fake();

  fake([1, 2, 3]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.array);
  }, "should accept array");

  fake([]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.array);
  }, "should accept empty array");

  fake.resetHistory();
  fake({ length: 3 });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.array),
    /expected fake to be called with match/,
    "should reject object"
  );

  fake.resetHistory();
  fake("array");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.array),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});
