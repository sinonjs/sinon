---
url: /concepts/spies/api/this-values.md
description: >-
  Array of `this` objects, `spy.thisValues[0]` is the
  [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
  object for the first [call](/concepts/spy-call/).
---

# `spy.thisValues`

Array of `this` objects, `spy.thisValues[0]` is the [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) object for the first [call](/concepts/spy-call/).

```js
import t from "tap";
import sinon from "sinon";

t.test("spy.thisValues contains this objects from all calls", (t) => {
  const spy = sinon.spy();
  const object = { apple: "pie" };

  // Call with specific this value
  spy.call(object, "hello");

  // Verify thisValues array
  t.same(spy.thisValues, [object], "thisValues should contain the object");
  t.equal(
    spy.thisValues[0],
    object,
    "thisValues[0] should be the exact same object"
  );

  t.end();
});

```

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `thisValues` to default

You can reset `thisValues` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
