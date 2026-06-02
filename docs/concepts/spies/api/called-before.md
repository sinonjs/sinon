---
title: spy.calledBefore
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, otherwise returns `false`.
---

# `spy.calledBefore`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called before another, otherwise returns `false`.

<<< ../../../.vitepress/tests/docs/spies/api/called-before.test.js

## Resetting `calledBefore` to default

You can reset `calledBefore` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
