---
url: /concepts/spies/api/second-call.md
description: >-
  The second [`call`](/concepts/spy-call/) object of the
  [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.secondCall`

The second [`call`](/concepts/spy-call/) object of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.secondCall returns the second call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.secondCall, null, "should be null before any calls");

  // Still null after first call
  f("apple pie");
  t.equal(f.secondCall, null, "should be null after only one call");

  // Returns second call object after second call
  f("blueberry pie");
  t.ok(f.secondCall, "should have secondCall after second call");
  t.same(
    f.secondCall.args,
    ["blueberry pie"],
    "secondCall should have correct args"
  );
  t.equal(
    f.secondCall.firstArg,
    "blueberry pie",
    "firstArg should be 'blueberry pie'"
  );

  t.end();
});

```

## Resetting `secondCall` to default

You can reset `secondCall` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
