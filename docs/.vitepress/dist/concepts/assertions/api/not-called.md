---
url: /concepts/assertions/api/not-called.md
description: >-
  Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has not been
  called.
---

# `assert.notCalled(spy);`

Passes, when the [`fake`][fake], [`spy`][spy] or [`stub`][stub] has not been called.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

// No exception!
sinon.assert.notCalled(spy);

spy();
sinon.assert.notCalled(spy);
// => Uncaught Error [AssertError]: expected spy to not have been called but was called once
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.notCalled - passes when spy was not called", (t) => {
  const spy = sinon.spy();

  t.doesNotThrow(() => {
    sinon.assert.notCalled(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.notCalled - fails when spy was called", (t) => {
  const spy = sinon.spy();
  spy();

  t.throws(
    () => sinon.assert.notCalled(spy),
    /expected spy to not have been called but was called once/,
    "assertion should fail with descriptive message"
  );

  t.end();
});

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
