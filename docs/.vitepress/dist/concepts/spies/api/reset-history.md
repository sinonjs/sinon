---
url: /concepts/spies/api/reset-history.md
description: >-
  Resets the state of a [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/).
---

# `spy.resetHistory`

Resets the state of a [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.resetHistory", (t) => {
  const s = sinon.spy();

  t.equal(s.callCount, 0, "callCount starts at 0");

  s();
  t.equal(s.callCount, 1, "callCount is 1 after one call");

  s.resetHistory();
  t.equal(s.callCount, 0, "callCount is 0 after resetHistory");

  s();
  t.equal(s.callCount, 1, "callCount is 1 again after another call");

  t.end();
});

```

In the example above, we can see that `callCount` is reset. Resetting history resets **all** recording properties of a [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/), there are too many to list here.

## Other ways of resetting history

You can also reset the history for the whole sandbox, by using [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history) or [`sinon.reset`](/concepts/sandboxes/api/reset).
