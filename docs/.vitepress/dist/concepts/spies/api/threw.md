---
url: /concepts/spies/api/threw.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) threw an exception at least once.
---

# `spy.threw`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) threw an exception at least once.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.threw - general", (t) => {
  const f = sinon.fake.throws(new Error("oh dear"));

  try {
    f();
  } catch (e) {
    // Expected to throw
  }

  t.ok(f.threw(), "returns true when fake threw an exception");

  sinon.reset();

  t.notOk(f.threw(), "returns false after reset");

  t.end();
});

```

## `spy.threw("TypeError")`

Returns `true` , when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) threw an exception of the provided type at least once.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.threw(type) - specific type", (t) => {
  const f = sinon.fake.throws(new TypeError("a specific error"));

  try {
    f();
  } catch (e) {
    // Expected to throw
  }

  t.ok(f.threw("TypeError"), "returns true when fake threw TypeError");

  t.notOk(
    f.threw("ArgumentError"),
    "returns false when fake did not throw ArgumentError"
  );

  sinon.reset();

  t.notOk(f.threw("TypeError"), "returns false after reset");

  t.end();
});

```

## Resetting `threw` to default

You can reset `threw` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
