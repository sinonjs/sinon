---
url: /concepts/matchers/api/map.md
description: Requires the value to be a `Map`.
---

# `sinon.match.map`

Requires the value to be a `Map`.

## `sinon.match.map.deepEquals(map)`

Requires a `Map` to be deep equal another one.

## `sinon.match.map.contains(map)`

Requires a `Map` to contain each one of the items the given map has.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.map", (t) => {
  const fake = sinon.fake();

  const map = new Map([["key", "value"]]);
  fake(map);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.map);
  }, "should accept Map");

  fake(new Map());
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.map);
  }, "should accept empty Map");

  fake.resetHistory();

  fake({ key: "value" });
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.map),
    /expected fake to be called with match/,
    "should reject object"
  );

  fake.resetHistory();
  fake([["key", "value"]]);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.map),
    /expected fake to be called with match/,
    "should reject array"
  );

  t.end();
});

```
