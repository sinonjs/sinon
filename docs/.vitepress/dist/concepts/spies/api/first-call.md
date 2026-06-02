---
url: /concepts/spies/api/first-call.md
description: >-
  The first [`call`](/concepts/spy-call/) object of the
  [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.firstCall`

The first [`call`](/concepts/spy-call/) object of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.firstCall returns the first call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.firstCall, null, "should be null before any calls");

  // Returns first call object
  f("apple pie");
  t.ok(f.firstCall, "should have firstCall after first call");
  t.same(f.firstCall.args, ["apple pie"], "firstCall should have correct args");
  t.equal(f.firstCall.firstArg, "apple pie", "firstArg should be 'apple pie'");

  // Still returns first call even after second call
  f("blueberry pie");
  t.same(
    f.firstCall.args,
    ["apple pie"],
    "firstCall should still be first call"
  );
  t.equal(
    f.firstCall.firstArg,
    "apple pie",
    "firstArg should still be 'apple pie'"
  );

  t.end();
});

```

## Resetting `firstCall` to default

You can reset `firstCall` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
