---
title: spy.exceptions
description: Array of exception objects thrown, `spy.exceptions[0]` is the exception thrown by the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.exceptions`

Array of exception objects thrown, `spy.exceptions[0]` is the exception thrown by the first [call](/concepts/spy-call/) of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If the call did not throw an error, the value at the call's location in `.exceptions` will be `undefined`.

<<< ../../../.vitepress/tests/docs/spies/api/exceptions.test.js

## Resetting `exceptions` to default

You can reset `exceptions` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
