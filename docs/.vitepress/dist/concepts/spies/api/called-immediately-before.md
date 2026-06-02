---
url: /concepts/spies/api/called-immediately-before.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called before another, and no
  [`calls`](/concepts/spy-call/) occurred between them.
---

# `spy.calledImmediatelyBefore`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, and no [`calls`](/concepts/spy-call/) occurred between them.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledImmediatelyBefore", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledImmediatelyBefore(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.ok(
    fake.calledImmediatelyBefore(spy),
    "fake was called immediately before spy"
  );

  t.ok(
    spy.calledImmediatelyBefore(stub),
    "spy was called immediately before stub"
  );

  t.notOk(
    stub.calledImmediatelyBefore(fake),
    "stub was not called immediately before fake"
  );

  t.end();
});

```

## Resetting `calledImmediatelyBefore` to default

You can reset `calledImmediatelyBefore` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
