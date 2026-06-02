---
url: /concepts/matchers/api/in.md
description: Requires the value to be in the `array`.
---

# `sinon.match.in(array)`

Requires the value to be in the `array`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.in", (t) => {
  const fake = sinon.fake();

  fake("apple");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(
      fake,
      sinon.match.in(["apple", "banana", "cherry"])
    );
  }, "should accept value in array");

  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.in([1, 42, 100]));
  }, "should use strict equality");

  fake.resetHistory();
  fake("orange");
  t.throws(
    () =>
      sinon.assert.calledWithMatch(
        fake,
        sinon.match.in(["apple", "banana", "cherry"])
      ),
    /expected fake to be called with match/,
    "should reject value not in array"
  );

  fake.resetHistory();
  fake("42");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.in([1, 42, 100])),
    /expected fake to be called with match/,
    "should reject with loose equality"
  );

  t.end();
});

```
