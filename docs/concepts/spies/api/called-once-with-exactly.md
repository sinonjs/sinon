---
title: spy.calledOnceWithExactly
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once in total and that one call was using the exact provided arguments and no others.
---

# `spy.calledOnceWithExactly`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) was called exactly once in total and that one call was using the exact provided arguments and no others.

<<< ../../../.vitepress/tests/docs/spies/api/called-once-with-exactly.test.js

## Resetting `calledOnceWithExactly` to default

You can reset `calledOnceWithExactly` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
