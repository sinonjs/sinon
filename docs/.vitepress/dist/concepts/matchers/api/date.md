---
url: /concepts/matchers/api/date.md
description: Requires the value to be a `Date` object.
---

# `sinon.match.date`

Requires the value to be a `Date` object.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.date", (t) => {
  const fake = sinon.fake();

  fake(new Date());
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.date);
  }, "should accept Date");

  fake(new Date("invalid"));
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.date);
  }, "should accept invalid Date");

  fake.resetHistory();

  fake(Date.now());
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.date),
    /expected fake to be called with match/,
    "should reject number"
  );

  fake.resetHistory();
  fake("2026-02-12");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.date),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});

```
