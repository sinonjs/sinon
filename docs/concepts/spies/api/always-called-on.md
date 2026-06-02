---
title: spy.alwaysCalledOn
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with `object` as `this`.
---

# `spy.alwaysCalledOn`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with `object` as `this`.

`alwaysCalledOn` also accepts a matcher `spyCall.alwaysCalledOn(sinon.match(fn))` (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spies/api/always-called-on.test.js

See [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

## Resetting `alwaysCalledOn` to default

You can reset `alwaysCalledOn` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
