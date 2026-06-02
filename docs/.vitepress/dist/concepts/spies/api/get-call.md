---
url: /concepts/spies/api/get-call.md
description: >-
  Returns the _nth_ (zero-indexed) [call](/concepts/spy-call/) recorded by the
  [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.getCall`

Returns the *nth* (zero-indexed) [call](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If *n* is negative, the *nth* call from the end is returned. For example, `spy.getCall(-1)` returns the last call, and `spy.getCall(-2)` returns the second to last call.

Accessing individual calls helps with more detailed behavior verification when the spy is called more than once.

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.getCall returns the nth call", (t) => {
  const f = sinon.fake();

  f("a");
  f("b");
  f("c");

  // Get second call (index 1)
  const call = f.getCall(1);
  t.ok(call, "should return a call object");
  t.same(call.args, ["b"], "should have args from second call");
  t.equal(call.firstArg, "b", "firstArg should be 'b'");

  // Reset and verify null
  sinon.reset();
  t.equal(f.getCall(1), null, "should return null after reset");

  t.end();
});

```

## Resetting `getCall` to default

You can reset the call history in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
