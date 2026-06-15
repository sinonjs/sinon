---
title: spy.neverCalledWithMatch
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with matching arguments.
---

# `spy.neverCalledWithMatch`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with matching arguments.

This behaves the same as `spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

<<< ../../../.vitepress/tests/docs/spies/api/never-called-with-match.test.js

## Resetting `neverCalledWithMatch` to default

You can reset `neverCalledWithMatch` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)

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

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
