import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match", (t) => {
  const fake = sinon.fake();

  // match(number)
  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match(42));
  }, "should accept equal number");

  fake.resetHistory();
  fake(42);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match(43)),
    /expected fake to be called with match/,
    "should reject different number"
  );

  // match(string) - substring
  fake.resetHistory();
  fake("hello world");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match("world"));
  }, "should accept string containing substring");

  fake.resetHistory();
  fake("hello world");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match("goodbye")),
    /expected fake to be called with match/,
    "should reject string without substring"
  );

  // match(regexp)
  fake.resetHistory();
  fake("test123");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match(/test\d+/));
  }, "should accept string matching regex");

  fake.resetHistory();
  fake("hello");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match(/\d+/)),
    /expected fake to be called with match/,
    "should reject string not matching regex"
  );

  // match(object) - partial match
  fake.resetHistory();
  fake({ name: "Alice", age: 30, city: "NYC" });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match({ name: "Alice" }));
  }, "should accept object with matching properties");

  // match(object) - nested matchers
  fake.resetHistory();
  fake({ user: { name: "Alice", age: 30 } });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(
      fake,
      sinon.match({ user: sinon.match({ name: "Alice" }) })
    );
  }, "should support nested matchers");

  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match({ name: "Bob" })),
    /expected fake to be called with match/,
    "should reject object with different property values"
  );

  // match(function) - custom matcher
  fake.resetHistory();
  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(
      fake,
      sinon.match((value) => value > 40)
    );
  }, "should use custom function");

  fake.resetHistory();
  fake(42);
  t.throws(
    () =>
      sinon.assert.calledWithMatch(
        fake,
        sinon.match((value) => value > 50)
      ),
    /expected fake to be called with match/,
    "should reject when custom function returns false"
  );

  t.end();
});
