---
url: /concepts/matchers/api/set.md
description: Requires the value to be a `Set`.
---

# `sinon.match.set`

Requires the value to be a `Set`.

## `sinon.match.set.deepEquals(set)`

Requires a `Set` to be deep equal another one.

## `sinon.match.set.contains(set)`

Requires a `Set` to contain each one of the items the given set has.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.set", (t) => {
  const fake = sinon.fake();

  const set = new Set([1, 2, 3]);
  fake(set);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.set);
  }, "should accept Set");

  fake(new Set());
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.set);
  }, "should accept empty Set");

  fake.resetHistory();

  fake([1, 2, 3]);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.set),
    /expected fake to be called with match/,
    "should reject array"
  );

  fake.resetHistory();
  fake({ values: [1, 2, 3] });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.set),
    /expected fake to be called with match/,
    "should reject object"
  );

  t.end();
});

```
