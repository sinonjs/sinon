---
title: spy.getCall
description: Returns the _nth_ (zero-indexed) [call](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.getCall`

Returns the _nth_ (zero-indexed) [call](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

If _n_ is negative, the _nth_ call from the end is returned. For example, `spy.getCall(-1)` returns the last call, and `spy.getCall(-2)` returns the second to last call.

Accessing individual calls helps with more detailed behavior verification when the spy is called more than once.

<<< ../../../.vitepress/tests/docs/spies/api/get-call.test.js

## Resetting `getCall` to default

You can reset the call history in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
