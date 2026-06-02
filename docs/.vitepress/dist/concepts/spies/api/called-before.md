---
url: /concepts/spies/api/called-before.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called before another, otherwise returns
  `false`.
---

# `spy.calledBefore`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, otherwise returns `false`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledBefore", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledBefore(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.ok(fake.calledBefore(spy), "fake was called before spy");

  t.ok(spy.calledBefore(stub), "spy was called before stub");

  t.notOk(stub.calledBefore(fake), "stub was not called before fake");

  t.end();
});

```

## Resetting `calledBefore` to default

You can reset `calledBefore` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
