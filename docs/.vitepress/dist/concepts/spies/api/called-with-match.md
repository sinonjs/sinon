---
url: /concepts/spies/api/called-with-match.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called with matching arguments (and possibly
  others).
---

# `spy.calledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called with matching arguments (and possibly others).

This behaves the same as `spy.calledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  spy(object);
  t.ok(
    spy.calledWithMatch({ b: 2 }),
    "returns true when spy was called with matching partial object"
  );

  t.notOk(
    spy.calledWithMatch({ b: 1 }),
    "returns false when spy was not called with matching arguments"
  );

  t.end();
});

```

## Resetting `calledWithMatch` to default

You can reset `calledWithMatch` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
