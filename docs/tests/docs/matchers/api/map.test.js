import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.map", (t) => {
  const fake = sinon.fake();

  const map = new Map([["key", "value"]]);
  fake(map);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.map);
  }, "should accept Map");

  fake(new Map());
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.map);
  }, "should accept empty Map");

  fake.resetHistory();

  fake({ key: "value" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.map),
    /expected fake to be called with match/,
    "should reject object"
  );

  fake.resetHistory();
  fake([["key", "value"]]);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.map),
    /expected fake to be called with match/,
    "should reject array"
  );

  t.end();
});
