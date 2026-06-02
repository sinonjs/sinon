---
title: spy.returned
description: Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) returned the provided value at least once.
---

# `spy.returned`

Returns `true`, when the [`fake`](/concepts/fakes/), [`spy`](../) or [`stub`](/concepts/stubs/) returned the provided value at least once.

Uses deep comparison for objects and arrays. Use `spy.returned(sinon.match.same(obj))` for strict comparison (see [matchers](/concepts/matchers/)).

<<< ../../../.vitepress/tests/docs/spies/api/returned.test.js

## Resetting `returned` to default

You can reset `returned` in three different ways:

- [`spy.resetHistory`](reset-history)
- [`sinon.resetHistory`](/concepts/sandboxes/api/reset-history)
- [`sinon.reset`](/concepts/sandboxes/api/reset)
