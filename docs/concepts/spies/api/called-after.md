---
title: spy.calledAfter
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, otherwise returns `false`.
---

# `spy.calledAfter`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called after another, otherwise returns `false`.

<<< ../../../.vitepress/tests/docs/spies/api/called-after.test.js

## Resetting `calledAfter` to default

You can reset `calledAfter` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
