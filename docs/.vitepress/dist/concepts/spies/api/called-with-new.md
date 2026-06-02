---
url: /concepts/spies/api/called-with-new.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called the `new` operator.
---

# `spy.calledWithNew`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called the `new` operator.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledWithNew", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.calledWithNew("apple pie"),
    "returns false when spy has not been called"
  );

  new spy("apple pie");
  t.ok(
    spy.calledWithNew("apple pie"),
    "returns true when spy was called with new operator"
  );

  t.end();
});

```

## Resetting `calledWithNew` to default

You can reset `calledWithNew` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
