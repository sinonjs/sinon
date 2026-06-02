---
url: /concepts/assertions/api/called-once.md
description: >-
  Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called
  exactly once.
---

# `assert.calledOnce(spy);`

Passes if the [`fake`][fake], [`spy`][spy] or [`stub`][stub] was called exactly once.

```js
import * as sinon from "sinon";
const spy = sinon.spy();

sinon.assert.calledOnce(spy);
// => Error [AssertError]: expected spy to be called once but was called 0 times

spy();
// Generates no exception
sinon.assert.calledOnce(spy);

spy();
sinon.assert.calledOnce(spy);
// => Error [AssertError]: expected spy to be called once but was called twice
```

## Example using test framework

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("assert.calledOnce - passes when spy was called once", (t) => {
  const spy = sinon.spy();
  spy();

  t.doesNotThrow(() => {
    sinon.assert.calledOnce(spy);
  }, "assertion should pass");

  t.end();
});

tap.test("assert.calledOnce - fails when spy was not called", (t) => {
  const spy = sinon.spy();

  t.throws(
    () => sinon.assert.calledOnce(spy),
    /expected spy to be called once but was called 0 times/,
    "assertion should fail when not called"
  );

  t.end();
});

tap.test(
  "assert.calledOnce - fails when spy was called multiple times",
  (t) => {
    const spy = sinon.spy();
    spy();
    spy();

    t.throws(
      () => sinon.assert.calledOnce(spy),
      /expected spy to be called once but was called twice/,
      "assertion should fail when called twice"
    );

    t.end();
  }
);

```

[fake]: /concepts/fakes/

[spy]: /concepts/spies/

[stub]: /concepts/stubs/
