import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.every", (t) => {
  const fake = sinon.fake();

  fake([2, 4, 6, 8]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.every(sinon.match.number));
  }, "should accept array where every element is a number");

  fake(new Set(["apple", "banana", "cherry"]));
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.every(sinon.match.string));
  }, "should accept Set where every element is a string");

  fake({ a: 1, b: 2, c: 3 });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.every(sinon.match.number));
  }, "should accept object where every value is a number");

  fake.resetHistory();
  fake([2, 4, "six", 8]);
  t.throws(
    () =>
      sinon.assert.calledWithMatch(fake, sinon.match.every(sinon.match.number)),
    /expected fake to be called with match/,
    "should reject array with non-number element"
  );

  fake.resetHistory();
  fake([]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.every(sinon.match.number));
  }, "should accept empty array (vacuous truth)");

  t.end();
});
