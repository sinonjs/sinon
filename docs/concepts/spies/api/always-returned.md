---
title: spy.alwaysReturned
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) always returned the provided value.
---

# `spy.alwaysReturned`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) always returned the provided value.

Uses deep comparison for objects and arrays. Use `spy.alwaysReturned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spies/api/always-returned.test.js

## Resetting `alwaysReturned` to default

You can reset `alwaysReturned` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
