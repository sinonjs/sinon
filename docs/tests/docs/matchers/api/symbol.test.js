import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.symbol", (t) => {
  const fake = sinon.fake();

  fake(Symbol("test"));
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.symbol);
  }, "should accept Symbol");

  fake(Symbol.iterator);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.symbol);
  }, "should accept well-known Symbol");

  fake.resetHistory();

  fake("Symbol(test)");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.symbol),
    /expected fake to be called with match/,
    "should reject string"
  );

  fake.resetHistory();
  fake({ type: "symbol" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.symbol),
    /expected fake to be called with match/,
    "should reject object"
  );

  t.end();
});
