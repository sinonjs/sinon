---
url: /concepts/spies/api/call-count.md
description: >-
  The number of recorded [calls](/concepts/spy-call/) recorded by the
  [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.callCount`

The number of recorded [calls](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.callCount tracks number of calls", (t) => {
  const f = sinon.fake();

  // Initially 0
  t.equal(f.callCount, 0, "should be 0 before any calls");

  // Increments with each call
  f();
  t.equal(f.callCount, 1, "should be 1 after first call");

  f();
  t.equal(f.callCount, 2, "should be 2 after second call");

  f();
  t.equal(f.callCount, 3, "should be 3 after third call");

  t.end();
});

```

## Resetting `callCount` to default

You can reset `callCount` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
