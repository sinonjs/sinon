---
url: /concepts/assertions/api/called-twice.md
description: >-
  Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  exactly twice.
---

# `assert.calledTwice(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly twice.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledTwice(spy);
// => Uncaught Error [AssertError]: expected spy to be called twice but was called 0 times

spy();
spy();
// Generates no exception
sinon.assert.calledTwice(spy);

spy();
sinon.assert.calledTwice(spy);
// => Uncaught Error [AssertError]: expected spy to be called twice but was called thrice
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledTwice - passes when spy was called twice", (t) => {
  const spy = sinon.spy();
  spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledTwice(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledTwice - fails when spy was called once", (t) => {
  const spy = sinon.spy();
  spy();

  t.throws(
    () => sinon.assert.calledTwice(spy),
    /expected spy to be called twice but was called once/,
    "assertion should fail with descriptive message"
  );

  t.end();
});

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
