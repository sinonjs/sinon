---
title: spy.calledThrice
description: "`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly thrice."
---

# `spy.calledThrice`

`true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) has been called exactly thrice.

<<< ../../../.vitepress/tests/docs/spies/api/called-thrice.test.js

## Resetting `calledThrice` to default

You can reset `calledThrice` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
