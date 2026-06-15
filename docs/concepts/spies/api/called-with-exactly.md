---
title: spy.calledWithExactly
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with the provided arguments and no others.
---

# `spy.calledWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called at least once with the provided arguments and no others.

<<< ../../../.vitepress/tests/docs/spies/api/called-with-exactly.test.js

## Resetting `calledWithExactly` to default

You can reset `calledWithExactly` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
