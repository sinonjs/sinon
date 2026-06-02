---
url: /concepts/spies/api/always-returned.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) always returned the provided value.
---

# `spy.alwaysReturned`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) always returned the provided value.

Uses deep comparison for objects and arrays. Use `spy.alwaysReturned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysReturned checks if spy always returned value", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call twice
  f();
  f();

  // Verify alwaysReturned checks
  t.ok(f.alwaysReturned("apple pie"), "should return true for 'apple pie'");
  t.notOk(
    f.alwaysReturned("raspberry pie"),
    "should return false for 'raspberry pie'"
  );

  // Reset and verify
  sinon.reset();
  t.notOk(f.alwaysReturned("apple pie"), "should return false after reset");

  t.end();
});

```

## Resetting `alwaysReturned` to default

You can reset `alwaysReturned` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
