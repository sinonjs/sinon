---
url: /concepts/spies/api/return-values.md
description: >-
  Array of return values, `spy.returnValues[0]` is the return value of the first
  [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/).
---

# `spy.returnValues`

Array of return values, `spy.returnValues[0]` is the return value of the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If the call did not explicitly return a value, the value at the call's location in `.returnValues` will be `undefined`.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.returnValues contains all return values", (t) => {
  const f = sinon.fake.returns("apple pie");

  // Call twice
  const result1 = f();
  t.equal(result1, "apple pie", "first call should return 'apple pie'");

  const result2 = f();
  t.equal(result2, "apple pie", "second call should return 'apple pie'");

  // Verify returnValues array
  t.same(
    f.returnValues,
    ["apple pie", "apple pie"],
    "returnValues should contain both returns"
  );
  t.equal(
    f.returnValues[0],
    "apple pie",
    "returnValues[0] should be 'apple pie'"
  );

  t.end();
});

```

## Resetting `returnValues` to default

You can reset `returnValues` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
