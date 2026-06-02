---
url: /concepts/spies/api/called-after.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called after another, otherwise returns
  `false`.
---

# `spy.calledAfter`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, otherwise returns `false`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledAfter", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledAfter(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.notOk(fake.calledAfter(spy), "fake was not called after spy");

  t.notOk(spy.calledAfter(stub), "spy was not called after stub");

  t.ok(stub.calledAfter(fake), "stub was called after fake");

  t.end();
});

```

## Resetting `calledAfter` to default

You can reset `calledAfter` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
