---
url: /concepts/spies/api/never-called-with-match.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was never called with matching arguments.
---

# `spy.neverCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with matching arguments.

This behaves the same as `spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.neverCalledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  t.ok(
    spy.neverCalledWithMatch({ b: 2 }),
    "returns true when spy has not been called"
  );

  spy(object);
  t.notOk(
    spy.neverCalledWithMatch({ b: 2 }),
    "returns false when spy was called with matching partial object"
  );

  spy("apple pie");
  t.ok(
    spy.neverCalledWithMatch("blueberry pie"),
    "returns true when spy was not called with matching arguments"
  );

  t.end();
});

```

## Resetting `neverCalledWithMatch` to default

You can reset `neverCalledWithMatch` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)

## weight: 100

# `spy.neverCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with matching arguments (and possibly others).

This behaves the same as `spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

```js
import * as sinon from "sinon";
const spy = sinon.spy();
const object = {
  a: 1,
  b: 2,
  c: 3
};

spy(object);
spy.neverCalledWithMatch({ b: 2 });
// => true

spy(object);
spy.neverCalledWithMatch({ b: 2 });
// => true

spy("apple pie");
spy.neverCalledWithMatch({ b: 2 });
// => false
```

## Resetting `neverCalledWithMatch` to default

You can reset `neverCalledWithMatch` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
