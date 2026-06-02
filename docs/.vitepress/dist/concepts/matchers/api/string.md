---
url: /concepts/matchers/api/string.md
description: Requires the value to be a `String`.
---

# `sinon.match.string`

Requires the value to be a `String`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.string", (t) => {
  const fake = sinon.fake();

  // Matches string values
  fake("hello");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.string);
  }, "should accept string");

  // Matches empty string
  fake("");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.string);
  }, "should accept empty string");

  // Rejects number
  fake.resetHistory();
  fake(42);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.string),
    /expected fake to be called with match/,
    "should reject number"
  );

  // Rejects object
  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.string),
    /expected fake to be called with match/,
    "should reject object"
  );

  t.end();
});

```
