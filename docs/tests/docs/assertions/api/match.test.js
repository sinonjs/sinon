import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.match - passes when value matches", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.match("apple pie", "apple pie");
  }, "assertion should pass with exact match");

  t.end();
});

tap.test("assert.match - passes with partial object match", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.match({ name: "Alice", age: 30 }, { name: "Alice" });
  }, "assertion should pass with partial match");

  t.end();
});

tap.test("assert.match - passes with matcher", (t) => {
  t.doesNotThrow(() => {
    sinon.assert.match("apple pie", sinon.match.string);
  }, "assertion should pass with matcher");

  t.end();
});

tap.test("assert.match - fails when value doesn't match", (t) => {
  t.throws(
    () => sinon.assert.match("apple", "banana"),
    /expected value to match/,
    "assertion should fail with non-matching value"
  );

  t.end();
});

tap.test("assert.match - fails with non-matching object", (t) => {
  t.throws(
    () => sinon.assert.match({ name: "Alice" }, { name: "Bob" }),
    /expected value to match/,
    "assertion should fail with non-matching object"
  );

  t.end();
});
