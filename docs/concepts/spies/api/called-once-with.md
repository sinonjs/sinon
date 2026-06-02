---
title: spy.calledOnceWith
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once and that one call was made using the provided arguments.
---

# `spy.calledOnceWith`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once and that one call was made using the provided arguments.

<<< ../../../.vitepress/tests/docs/spies/api/called-once-with.test.js

## Resetting `calledOnceWith` to default

You can reset `calledOnceWith` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
