---
url: /concepts/matchers/api/defined.md
description: Requires the value to be defined.
---

# `sinon.match.defined`

Requires the value to be defined.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("sinon.match.defined", (t) => {
  const fake = sinon.fake();

  fake("hello");
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.defined);
  }, "should accept string");

  fake(0);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.defined);
  }, "should accept zero");

  fake(false);
  t.doesNotThrow(() => {
    sinon.assert.calledWithMatch(fake, sinon.match.defined);
  }, "should accept false");

  fake.resetHistory();

  fake(null);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.defined),
    /expected fake to be called with match/,
    "should reject null"
  );

  fake.resetHistory();
  fake(undefined);
  t.throws(
    () => sinon.assert.calledWithMatch(fake, sinon.match.defined),
    /expected fake to be called with match/,
    "should reject undefined"
  );

  t.end();
});

```
