---
url: /concepts/spies/api/always-called-with-exactly.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was always called with the exact provided
  arguments.
---

# `spy.alwaysCalledWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the exact provided arguments.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.alwaysCalledWithExactly", (t) => {
  const spy = sinon.spy();

  t.notOk(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns false when spy has not been called"
  );

  spy("apple pie");
  t.ok(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns true after first call with exact arguments"
  );

  spy("apple pie");
  t.ok(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns true after second call with same exact arguments"
  );

  spy("raspberry pie");
  t.notOk(
    spy.alwaysCalledWithExactly("apple pie"),
    "returns false after a call with different arguments"
  );

  t.end();
});

```

## Resetting `alwaysCalledWithExactly` to default

You can reset `alwaysCalledWithExactly` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
