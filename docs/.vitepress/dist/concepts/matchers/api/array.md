---
url: /concepts/matchers/api/array.md
description: Requires the value to be an `Array`.
---

# `sinon.match.array`

Requires the value to be an `Array`.

## `sinon.match.array.deepEquals(arr)`

Requires an `Array` to be deep equal another one.

## `sinon.match.array.startsWith(arr)`

Requires an `Array` to start with the same values as another one.

## `sinon.match.array.endsWith(arr)`

Requires an `Array` to end with the same values as another one.

## `sinon.match.array.contains(arr)`

Requires an `Array` to contain each one of the values the given array has.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.array", (t) => {
  const fake = sinon.fake();

  fake([1, 2, 3]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.array);
  }, "should accept array");

  fake([]);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.array);
  }, "should accept empty array");

  fake.resetHistory();
  fake({ length: 3 });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.array),
    /expected fake to be called with match/,
    "should reject object"
  );

  fake.resetHistory();
  fake("array");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.array),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});

```
