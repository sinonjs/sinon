---
url: /concepts/matchers/api/some.md
description: >-
  Requires **any** element of an `Array`, `Set` or `Map`, or alternatively
  **any** value of an `Object` to match the given `matcher`.
---

# `sinon.match.some(matcher)`

Requires **any** element of an `Array`, `Set` or `Map`, or alternatively **any** value of an `Object` to match the given `matcher`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.some", (t) => {
  const fake = sinon.fake();

  fake([1, "two", 3, "four"]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.some(sinon.match.string));
  }, "should accept array with at least one string");

  fake(new Set([1, 2, "three"]));
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.some(sinon.match.string));
  }, "should accept Set with at least one string");

  fake({ a: 1, b: "two", c: 3 });
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.some(sinon.match.string));
  }, "should accept object with at least one string value");

  fake.resetHistory();
  fake([1, 2, 3, 4]);
  t.throws(
    () =>
      sinon.assert.calledWithMatch(fake, sinon.match.some(sinon.match.string)),
    /expected fake to be called with match/,
    "should reject array with no strings"
  );

  fake.resetHistory();
  fake([]);
  t.throws(
    () =>
      sinon.assert.calledWithMatch(fake, sinon.match.some(sinon.match.string)),
    /expected fake to be called with match/,
    "should reject empty array"
  );

  t.end();
});

```
