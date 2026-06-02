---
url: /concepts/spies/api/called.md
description: >-
  `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called one or more times.
---

# `spy.called`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called one or more times.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.called is false initially, true after any call", (t) => {
  const f = sinon.fake();

  // Initially false
  t.equal(f.called, false, "should be false before any calls");

  // True after first call
  f();
  t.equal(f.called, true, "should be true after first call");

  // Still true after second call
  f();
  t.equal(f.called, true, "should remain true after multiple calls");

  t.end();
});

```

## Resetting `called` to default

You can reset `called` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
