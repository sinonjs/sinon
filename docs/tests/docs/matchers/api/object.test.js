import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.object", (t) => {
  const fake = sinon.fake();

  fake({ name: "Alice" });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.object);
  }, "should accept object");

  fake({});
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.object);
  }, "should accept empty object");

  fake.resetHistory();

  fake(null);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.object),
    /expected fake to be called with match/,
    "should reject null"
  );

  fake.resetHistory();
  fake("hello");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.object),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});
