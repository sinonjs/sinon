---
url: /concepts/spies/api/exceptions.md
description: >-
  Array of exception objects thrown, `spy.exceptions[0]` is the exception thrown
  by the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/),
  [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.exceptions`

Array of exception objects thrown, `spy.exceptions[0]` is the exception thrown by the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If the call did not throw an error, the value at the call's location in `.exceptions` will be `undefined`.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.exceptions contains all thrown exceptions", (t) => {
  const error = new TypeError("apple pie");
  const f = sinon.fake.throws(error);

  // Call twice (catching exceptions)
  try {
    f();
  } catch (e) {
    // Expected
  }
  try {
    f();
  } catch (e) {
    // Expected
  }

  // Verify exceptions array
  t.equal(f.exceptions.length, 2, "should have 2 exceptions");
  t.equal(f.exceptions[0], error, "first exception should be the error");
  t.equal(f.exceptions[1], error, "second exception should be the error");
  t.equal(
    f.exceptions[0].message,
    "apple pie",
    "exception message should match"
  );

  t.end();
});

```

## Resetting `exceptions` to default

You can reset `exceptions` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
