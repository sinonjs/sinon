---
url: /concepts/spies/api/returned.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) returned the provided value at least once.
---

# `spy.returned`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) returned the provided value at least once.

Uses deep comparison for objects and arrays. Use `spy.returned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.returned checks if spy returned a value", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call the fake
  const result = f();
  t.equal(result, "apple pie", "should return 'apple pie'");

  // Verify returned checks
  t.ok(f.returned("apple pie"), "should return true for 'apple pie'");
  t.notOk(
    f.returned("raspberry pie"),
    "should return false for 'raspberry pie'"
  );

  // Reset and verify
  sinon.reset();
  t.notOk(f.returned("apple pie"), "should return false after reset");

  t.end();
});

```

## Resetting `returned` to default

You can reset `returned` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
