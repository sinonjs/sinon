---
url: /concepts/spies/api/called-once-with.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called exactly once and that one call was made
  using the provided arguments.
---

# `spy.calledOnceWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once and that one call was made using the provided arguments.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledOnceWith", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns false when spy has not been called"
  );

  spy("apple pie", "coffee");
  t.ok(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns true when spy was called exactly once with arguments"
  );

  spy("apple pie", "coffee");
  t.notOk(
    spy.calledOnceWith("apple pie", "coffee"),
    "returns false when spy was called more than once"
  );

  t.end();
});

```

## Resetting `calledOnceWith` to default

You can reset `calledOnceWith` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
