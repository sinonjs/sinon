---
url: /concepts/spies/api/called-twice.md
description: 'True when the fake, spy, or stub has been called exactly twice.'
---

# `spy.calledTwice`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly twice.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.calledTwice is true only when called exactly twice", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.calledTwice, false, "should be false before any calls");

  // False after first call
  f();
  t.equal(f.calledTwice, false, "should be false after one call");

  // True after second call
  f();
  t.equal(f.calledTwice, true, "should be true after two calls");

  // False after third call
  f();
  t.equal(f.calledTwice, false, "should be false after three calls");

  t.end();
});

```

## Resetting `calledTwice` to default

You can reset `calledTwice` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
