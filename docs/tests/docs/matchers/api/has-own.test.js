import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.hasOwn", (t) => {
  const fake = sinon.fake();

  fake({ name: "Alice" });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.hasOwn("name"));
  }, "should accept object with own property");

  fake({ name: "Alice", age: 30 });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.hasOwn("name", "Alice"));
  }, "should accept matching own property value");

  const obj = Object.create({ inherited: true });
  fake(obj);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.hasOwn("inherited")),
    /expected fake to be called with match/,
    "should reject inherited property"
  );

  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.hasOwn("age")),
    /expected fake to be called with match/,
    "should reject missing property"
  );

  t.end();
});
