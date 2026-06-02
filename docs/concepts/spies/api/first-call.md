---
title: spy.firstCall
description: The first [`call`](/concepts/spy-call/) object of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).
---

# `spy.firstCall`

The first [`call`](/concepts/spy-call/) object of the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/).

<<< ../../../.vitepress/tests/docs/spies/api/first-call.test.js

## Resetting `firstCall` to default

You can reset `firstCall` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
