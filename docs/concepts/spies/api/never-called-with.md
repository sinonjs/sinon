---
title: spy.neverCalledWith
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with the provided arguments.
---

# `spy.neverCalledWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was never called with the provided arguments.

<<< ../../../.vitepress/tests/docs/spies/api/never-called-with.test.js

## Resetting `neverCalledWith` to default

You can reset `neverCalledWith` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
