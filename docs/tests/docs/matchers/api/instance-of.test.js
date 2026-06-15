import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.instanceOf", (t) => {
  const fake = sinon.fake();

  fake(new Date());
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.instanceOf(Date));
  }, "should accept Date instance");

  class Person {
    constructor(name) {
      this.name = name;
    }
  }
  fake(new Person("Alice"));
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.instanceOf(Person));
  }, "should accept custom class instance");

  fake.resetHistory();
  fake(new Date());
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.instanceOf(RegExp)),
    /expected fake to be called with match/,
    "should reject different type"
  );

  fake.resetHistory();
  fake("hello");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.instanceOf(String)),
    /expected fake to be called with match/,
    "should reject primitive string"
  );

  t.end();
});
