---
title: spy.alwaysCalledWithExactly
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the exact provided arguments.
---

# `spy.alwaysCalledWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was always called with the exact provided arguments.

<<< ../../../.vitepress/tests/docs/spies/api/always-called-with-exactly.test.js

## Resetting `alwaysCalledWithExactly` to default

You can reset `alwaysCalledWithExactly` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
