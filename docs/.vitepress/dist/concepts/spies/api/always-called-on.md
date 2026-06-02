---
url: /concepts/spies/api/always-called-on.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was always called with `object` as `this`.
---

# `spy.alwaysCalledOn`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with `object` as `this`.

`alwaysCalledOn` also accepts a matcher `spyCall.alwaysCalledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.alwaysCalledOn checks if always called with this", (t) => {
  const spy = sinon.spy();
  const object = {};
  const aDifferentObject = {};

  // False before any calls
  t.notOk(spy.alwaysCalledOn(object), "should be false before calls");

  // True after first call with object as this
  spy.call(object);
  t.ok(spy.alwaysCalledOn(object), "should be true after one matching call");

  // Still true after second call with same this
  spy.call(object);
  t.ok(spy.alwaysCalledOn(object), "should stay true with consistent this");

  // False after call with different this
  spy.call(aDifferentObject);
  t.notOk(
    spy.alwaysCalledOn(object),
    "should be false after inconsistent call"
  );

  t.end();
});

```

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `alwaysCalledOn` to default

You can reset `alwaysCalledOn` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
