---
title: spy.calledOn
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with `object` as `this`.
---

# `spy.calledOn`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with `object` as `this`.

`calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spies/api/called-on.test.js

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `calledOn` to default

You can reset `calledOn` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
