---
url: /concepts/spies/api/called-once-with-exactly.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called exactly once in total and that one call
  was using the exact provided arguments and no others.
---

# `spy.calledOnceWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once in total and that one call was using the exact provided arguments and no others.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledOnceWithExactly", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when spy has not been called"
  );

  spy("apple pie");
  t.ok(
    spy.calledOnceWithExactly("apple pie"),
    "returns true when spy was called exactly once with exact arguments"
  );

  spy("apple pie");
  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when spy was called more than once"
  );

  // reset the history of everything
  sinon.resetHistory();

  spy("apple pie", "blueberry pie");
  t.notOk(
    spy.calledOnceWithExactly("apple pie"),
    "returns false when arguments don't match exactly"
  );

  t.end();
});

```

## Resetting `calledOnceWithExactly` to default

You can reset `calledOnceWithExactly` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
