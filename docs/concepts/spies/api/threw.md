---
title: spy.threw
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) threw an exception at least once.
---

# `spy.threw`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) threw an exception at least once.

<<< ../../../.vitepress/tests/docs/spies/api/threw-1.test.js

## `spy.threw("TypeError")`

Returns `true` , when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) threw an exception of the provided type at least once.

<<< ../../../.vitepress/tests/docs/spies/api/threw-2.test.js

## Resetting `threw` to default

You can reset `threw` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
