---
title: spy.callCount
description: The number of recorded [calls](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.callCount`

The number of recorded [calls](/concepts/spy-call/) recorded by the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

<<< ../../../.vitepress/tests/docs/spies/api/call-count.test.js

## Resetting `callCount` to default

You can reset `callCount` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
