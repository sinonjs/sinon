---
url: /concepts/spies/api/called-on.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was called at least once with `object` as `this`.
---

# `spy.calledOn`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with `object` as `this`.

`calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.calledOn checks if called at least once with this", (t) => {
  const spy = sinon.spy();
  const object = {};

  // False before any calls
  t.notOk(spy.calledOn(object), "should be false before calls");

  // True after calling with object as this
  spy.call(object);
  t.ok(
    spy.calledOn(object),
    "should be true after calling with object as this"
  );

  t.end();
});

```

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `calledOn` to default

You can reset `calledOn` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
