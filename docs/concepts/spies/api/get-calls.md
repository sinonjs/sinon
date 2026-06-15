---
title: spy.getCalls
description: Returns an `Array` of all [calls](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.getCalls`

Returns an `Array` of all [calls](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

<<< ../../../.vitepress/tests/docs/spies/api/get-calls.test.js

## Resetting `getCalls` to default

You can reset the call history in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
