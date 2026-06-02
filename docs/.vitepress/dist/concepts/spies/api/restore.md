---
url: /concepts/spies/api/restore.md
description: >-
  Replaces the [`spy`](../) or [`stub`](/concepts/stubs/) with the original
  method. Only available if the [`spy`](../) or [`stub`](/concepts/stubs/)
  replaced an existing method.
---

# `spy.restore`

Replaces the [`spy`](../) or [`stub`](/concepts/stubs/) with the original method. Only available if the [`spy`](../) or [`stub`](/concepts/stubs/) replaced an existing method.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.restore", (t) => {
  const obj = {
    hello: () => {
      return "world";
    }
  };

  const s = sinon.stub(obj, "hello").callsFake(() => {
    return "sailor";
  });

  t.equal(obj.hello(), "sailor", "stub returns stubbed value");

  s.restore();

  t.equal(obj.hello(), "world", "original method restored");

  t.end();
});

```

## Other ways of restoring

You can also reset the whole sandbox, by using [`sinon.restore`](/concepts/sandboxes/api/restore) or [`sinon.reset`](/concepts/sandboxes/api/reset).
