---
url: /concepts/spies/api/third-call.md
description: >-
  The third [`call`](/concepts/spy-call/) object of the
  [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.thirdCall`

The third [`call`](/concepts/spy-call/) object of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.thirdCall returns the third call object", (t) => {
  const f = sinon.fake();

  // Initially null
  t.equal(f.thirdCall, null, "should be null before any calls");

  // Still null after first call
  f("apple pie");
  t.equal(f.thirdCall, null, "should be null after one call");

  // Still null after second call
  f("blueberry pie");
  t.equal(f.thirdCall, null, "should be null after two calls");

  // Returns third call object after third call
  f("cherry pie");
  t.ok(f.thirdCall, "should have thirdCall after third call");
  t.same(
    f.thirdCall.args,
    ["cherry pie"],
    "thirdCall should have correct args"
  );
  t.equal(
    f.thirdCall.firstArg,
    "cherry pie",
    "firstArg should be 'cherry pie'"
  );

  t.end();
});

```

## Resetting `thirdCall` to default

You can reset `thirdCall` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
