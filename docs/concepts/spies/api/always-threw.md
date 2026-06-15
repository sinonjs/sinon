---
title: spy.alwaysThrew
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) always threw an exception.
---

# `spy.alwaysThrew`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) always threw an exception.

<<< ../../../.vitepress/tests/docs/spies/api/always-threw.test.js

## Resetting `alwaysThrew` to default

You can reset `alwaysThrew` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
