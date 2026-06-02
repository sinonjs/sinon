---
title: spy.notCalled
description: "`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has not been called."
---

# `spy.notCalled`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has not been called.

<<< ../../../.vitepress/tests/docs/spies/api/not-called.test.js

## Resetting `notCalled` to default

You can reset `notCalled` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
