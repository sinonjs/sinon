---
title: spy.calledOnce
description: "`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly once."
---

# `spy.calledOnce`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly once.

<<< ../../../.vitepress/tests/docs/spies/api/called-once.test.js

## Resetting `calledOnce` to default

You can reset `calledOnce` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
