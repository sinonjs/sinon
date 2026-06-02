---
url: /concepts/matchers/api/bool.md
description: Requires the value to be a `Boolean`
---

# `sinon.match.bool`

Requires the value to be a `Boolean`

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.bool", (t) => {
  const fake = sinon.fake();

  fake(true);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.bool);
  }, "should accept true");

  fake(false);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.bool);
  }, "should accept false");

  fake.resetHistory();
  fake(1);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.bool),
    /expected fake to be called with match/,
    "should reject number"
  );

  fake.resetHistory();
  fake("true");
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.bool),
    /expected fake to be called with match/,
    "should reject string"
  );

  t.end();
});

```
