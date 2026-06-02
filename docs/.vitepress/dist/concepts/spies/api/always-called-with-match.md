---
url: /concepts/spies/api/always-called-with-match.md
description: >-
  Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or
  [`stub`](/concepts/stubs/) was always called with matching arguments (and
  possibly others).
---

# `spy.alwaysCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with matching arguments (and possibly others).

This behaves the same as `spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

```js
import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.alwaysCalledWithMatch", (t) => {
  const spy = sinon.spy();
  const object = {
    a: 1,
    b: 2,
    c: 3
  };

  spy(object);
  t.ok(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns true after first call with matching partial object"
  );

  spy(object);
  t.ok(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns true after second call with matching partial object"
  );

  spy("apple pie");
  t.notOk(
    spy.alwaysCalledWithMatch({ b: 2 }),
    "returns false after a call with non-matching arguments"
  );

  t.end();
});

```

## Resetting `alwaysCalledWithMatch` to default

You can reset `alwaysCalledWithMatch` in three different ways:

* [`spy.resetHistory`](reset-history)
* [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
* [`sinon.reset`](/concepts/sandboxes/api/reset)
