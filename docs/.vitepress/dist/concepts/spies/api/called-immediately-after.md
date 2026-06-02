---
url: /concepts/spies/api/called-immediately-after.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called after another, and no
  [`calls`](/concepts/spy-call/) occurred between them.
---

# `spy.calledImmediatelyAfter`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, and no [`calls`](/concepts/spy-call/) occurred between them.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.calledImmediatelyAfter", (t) => {
  const fake = sinon.fake();
  const spy = sinon.spy();
  const stub = sinon.stub();

  t.notOk(fake.calledImmediatelyAfter(spy), "returns false before any calls");

  fake();
  spy();
  stub();

  t.notOk(
    fake.calledImmediatelyAfter(spy),
    "fake was not called immediately after spy"
  );

  t.ok(
    spy.calledImmediatelyAfter(fake),
    "spy was called immediately after fake"
  );

  t.notOk(
    stub.calledImmediatelyAfter(fake),
    "stub was not called immediately after fake"
  );

  t.end();
});

```

## Resetting `calledImmediatelyAfter` to default

You can reset `calledImmediatelyAfter` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
