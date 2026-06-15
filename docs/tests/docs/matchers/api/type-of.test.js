import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.typeOf", (t) => {
  const fake = sinon.fake();

  fake("hello");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.typeOf("string"));
  }, "should accept string type");

  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.typeOf("number"));
  }, "should accept number type");

  fake(true);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.typeOf("boolean"));
  }, "should accept boolean type");

  fake(() => {});
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.typeOf("function"));
  }, "should accept function type");

  fake({});
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.typeOf("object"));
  }, "should accept object type");

  fake.resetHistory();
  fake(42);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.typeOf("string")),
    /expected fake to be called with match/,
    "should reject wrong type"
  );

  t.end();
});
