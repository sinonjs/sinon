---
url: /concepts/matchers/api/same.md
description: Requires the value to strictly equal `ref`.
---

# `sinon.match.same(ref)`

Requires the value to strictly equal `ref`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.same", (t) => {
  const fake = sinon.fake();

  const obj = { name: "Alice" };
  fake(obj);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.same(obj));
  }, "should accept same object reference");

  fake(42);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.same(42));
  }, "should accept same primitive value");

  fake.resetHistory();
  fake({ name: "Alice" });
  t.throws(
    () =>
      sinon.assert.calledWithMatch(fake, sinon.match.same({ name: "Alice" })),
    /expected fake to be called with match/,
    "should reject different object"
  );

  fake.resetHistory();
  fake(42);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.same(43)),
    /expected fake to be called with match/,
    "should reject different value"
  );

  t.end();
});

```
